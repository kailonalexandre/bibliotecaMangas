import { BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/Button";

export function EmptyState({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface/70 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
        <BookOpen className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {actionHref && actionLabel ? <ButtonLink href={actionHref} className="mt-5">{actionLabel}</ButtonLink> : null}
    </div>
  );
}
