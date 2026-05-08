import type { ComponentProps } from "react";

const variants = {
  default: "bg-surface-2 text-ink",
  accent: "bg-accent/10 text-accent ring-1 ring-accent/20",
  success: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
  danger: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300"
};

export function Badge({ className = "", variant = "default", ...props }: ComponentProps<"span"> & { variant?: keyof typeof variants }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`} {...props} />;
}
