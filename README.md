# Mangas Controll

Aplicacao web responsiva para controle pessoal de colecao de mangas, pensada para uso por duas pessoas.

## Stack

- Next.js com TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Autenticacao simples com e-mail e senha

## Funcionalidades

- Login/logout por cookie assinado.
- Dashboard com capas, status e progresso da colecao.
- CRUD de mangas.
- Busca externa por titulo com fallback: Google Books, Open Library e Jikan.
- Edicao manual de URL da capa.
- Detalhe do manga com volumes.
- Geracao automatica de volumes por `totalVolumes`.
- Marcacao de volume possuido, lido e emprestado.
- Telas de volumes faltantes e wishlist.
- Busca e filtros por titulo, autor, editora, status, colecao completa/incompleta e leitura.
- Exportacao CSV.

## Variaveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure:

```env
DATABASE_URL=postgresql://manga_user:manga_password@postgres:5432/manga_collection?schema=public
JWT_SECRET=troque-por-uma-string-grande-e-aleatoria
NEXTAUTH_SECRET=troque-por-uma-string-grande-e-aleatoria
NEXTAUTH_URL=http://localhost:3000
GOOGLE_BOOKS_API_KEY=
REGISTER_INVITE_CODE="troque_este_codigo"
NODE_ENV=production
```

`REGISTER_INVITE_CODE` protege a tela `/register`. Use um codigo longo, aleatorio, e compartilhe apenas com quem pode criar conta. Nunca commite `.env`.

## Rodando com Docker Compose

1. Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Suba os containers:

```bash
docker compose up -d
```

3. Rode migrations do Prisma:

```bash
docker compose exec app npx prisma migrate dev
```

4. Rode seed:

```bash
docker compose exec app npx prisma db seed
```

5. Acesse `http://localhost:3000`.

Comandos uteis:

```bash
docker compose logs -f app
docker compose down
```

O container `app` acessa PostgreSQL por `postgres:5432`. Fora do Docker, ajuste `DATABASE_URL` para `localhost:5432` se quiser rodar `npm run dev` direto na maquina.

## Instalacao sem Docker

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Acesse `http://localhost:3000`.

Usuarios do seed:

- `ana@example.com` / `manga123`
- `leo@example.com` / `manga123`

## Registro com convite

A tela `/register` permite criar conta apenas com `REGISTER_INVITE_CODE`.

Localmente:

```env
REGISTER_INVITE_CODE="um-codigo-longo-e-secreto"
```

Na Vercel:

1. Abra o projeto na Vercel.
2. Va em Settings > Environment Variables.
3. Adicione `REGISTER_INVITE_CODE` sem prefixo `NEXT_PUBLIC_`.
4. Redeploy.

Para criar a conta da esposa, configure o codigo, acesse `http://localhost:3000/register`, preencha nome, e-mail, senha forte e codigo de convite.

O arquivo `.env` contem segredos e nao deve ser commitado.

## PostgreSQL local rapido

Exemplo com Docker:

```bash
docker run --name mangas-postgres -e POSTGRES_PASSWORD=manga_password -e POSTGRES_USER=manga_user -e POSTGRES_DB=manga_collection -p 5432:5432 -d postgres:16
```

## Deploy

1. Crie um banco PostgreSQL em um provedor como Neon, Supabase, Railway ou Render.
2. Configure `DATABASE_URL` e `SESSION_SECRET` no ambiente de producao.
3. Rode migrations no deploy:

```bash
npx prisma migrate deploy
```

4. Gere Prisma Client durante build:

```bash
npm run build
```

Em Vercel, adicione `prisma generate` ao build se necessario:

```bash
npx prisma generate && next build
```
