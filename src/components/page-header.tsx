import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-line bg-cream", className)}>
      <div className="wrap py-10 md:py-14">
        {children}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-display text-forest">{title}</h1>
        {description && (
          <p className="mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
