import { Button } from "@/components/catalyst/button";
import { Link } from "@/components/catalyst/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: Props) {
  return (
    <Button
      href={href}
      color={variant === "primary" ? "cyan" : "dark/zinc"}
      className={cn("rounded-xl", className)}
    >
      {children}
    </Button>
  );
}

export function GlassButton({ href, children, className }: Omit<Props, "variant">) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition will-change-transform glass hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Link>
  );
}
