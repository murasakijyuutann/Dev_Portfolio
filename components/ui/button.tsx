import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded border border-transparent text-small font-medium transition-[transform,box-shadow,background-color] duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border-primary hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-sm",
        outline:
          "bg-transparent text-foreground border-border-strong hover:bg-accent",
        secondary: "bg-secondary text-foreground",
        ghost: "bg-transparent text-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "px-3 py-1.5 text-meta",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
