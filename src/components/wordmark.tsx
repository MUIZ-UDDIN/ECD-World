import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 sm:gap-2.5", className)}>
      <span className="font-display text-[1.18rem] leading-none font-semibold tracking-[-0.03em] text-forest sm:text-[1.45rem]">
        ECD
      </span>
      <span className="h-4 w-px bg-taupe" aria-hidden />
      <span className="text-[0.5rem] leading-none font-semibold tracking-[0.24em] text-clay uppercase sm:text-[0.58rem] sm:tracking-[0.34em]">
        World
      </span>
    </span>
  );
}
