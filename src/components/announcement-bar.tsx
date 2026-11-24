import { site } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-forest text-cream">
      <div className="wrap flex h-9 items-center justify-center gap-3 text-[0.64rem] tracking-[0.12em] uppercase sm:text-[0.68rem] sm:tracking-[0.14em]">
        <span className="hidden items-center gap-2 text-cream/60 sm:flex">
          <span className="size-1 rounded-full bg-clay" aria-hidden />
          Workshop-made apparatus
        </span>
        <span className="hidden h-3 w-px bg-cream/20 sm:block" aria-hidden />
        <span className="truncate sm:hidden">Free delivery over ₨ 15,000</span>
        <span className="hidden truncate sm:inline">{site.announcement}</span>
      </div>
    </div>
  );
}
