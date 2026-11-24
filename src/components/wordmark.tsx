import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="font-display text-[1.45rem] leading-none font-semibold tracking-[-0.03em] text-forest">
        ECD
      </span>
      <span className="h-4 w-px bg-taupe" aria-hidden />
      <span className="text-[0.58rem] leading-none font-semibold tracking-[0.34em] text-clay uppercase">
        World
      </span>
    </span>
  );
}
