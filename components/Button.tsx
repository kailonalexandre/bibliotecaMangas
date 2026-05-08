import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-accent text-white shadow-sm hover:brightness-95",
  secondary: "border border-line bg-surface text-ink shadow-sm hover:bg-surface-2",
  danger: "bg-berry text-white shadow-sm hover:brightness-95"
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
