import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-xl border border-line bg-surface shadow-soft ${className}`} {...props} />;
}
