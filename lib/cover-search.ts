export type CoverResult = {
  source: "Google Books" | "Open Library" | "Jikan";
  title: string;
  author?: string;
  publisher?: string;
  description?: string;
  coverUrl?: string;
  originalTitle?: string;
};

type GoogleBook = {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
};

export async function searchExternalManga(title: string): Promise<CoverResult[]> {
  const query = title.trim();
  if (!query) return [];
  const results: CoverResult[] = [];

  const [google, jikan] = await Promise.allSettled([searchGoogleBooks(query), searchJikan(query)]);
  if (google.status === "fulfilled") results.push(...google.value);
  if (jikan.status === "fulfilled") results.push(...jikan.value);

  const openLibrary = await searchOpenLibrary(query, results);
  results.push(...openLibrary);

  const seen = new Set<string>();
  return results.filter((item) => {
    const key = `${item.source}:${item.coverUrl || item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function searchGoogleBooks(query: string): Promise<CoverResult[]> {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", `${query} manga`);
  url.searchParams.set("maxResults", "5");
  if (key) url.searchParams.set("key", key);
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { items?: GoogleBook[] };
  return (data.items || []).map((book) => {
    const info = book.volumeInfo || {};
    const image = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
    return {
      source: "Google Books",
      title: info.title || query,
      author: info.authors?.join(", "),
      publisher: info.publisher,
      description: info.description,
      coverUrl: image?.replace("http://", "https://")
    };
  });
}

async function searchOpenLibrary(query: string, existing: CoverResult[]): Promise<CoverResult[]> {
  const isbn = existing
    .map((item) => item.coverUrl?.match(/isbn\/([0-9X-]+)/i)?.[1])
    .find(Boolean);

  if (isbn) {
    return [{ source: "Open Library", title: query, coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` }];
  }

  const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=3`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { docs?: { title?: string; author_name?: string[]; publisher?: string[]; cover_i?: number }[] };
  return (data.docs || [])
    .filter((doc) => doc.cover_i)
    .map((doc) => ({
      source: "Open Library",
      title: doc.title || query,
      author: doc.author_name?.join(", "),
      publisher: doc.publisher?.[0],
      coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    }));
}

async function searchJikan(query: string): Promise<CoverResult[]> {
  const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=5`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) return [];
  const data = (await response.json()) as {
    data?: {
      title?: string;
      title_japanese?: string;
      authors?: { name: string }[];
      synopsis?: string;
      images?: { jpg?: { large_image_url?: string; image_url?: string } };
    }[];
  };
  return (data.data || []).map((item) => ({
    source: "Jikan",
    title: item.title || query,
    originalTitle: item.title_japanese,
    author: item.authors?.map((author) => author.name).join(", "),
    description: item.synopsis,
    coverUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url
  }));
}
