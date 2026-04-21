import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-violet-500 text-white hover:bg-violet-400 shadow-[0_0_24px_rgba(124,58,237,0.35)]",
  secondary: "bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25 border border-emerald-400/20",
  ghost: "bg-transparent text-slate-200 hover:bg-white/8",
  outline: "bg-white/5 text-slate-100 border border-white/12 hover:bg-white/10",
  danger: "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 border border-rose-400/20",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
