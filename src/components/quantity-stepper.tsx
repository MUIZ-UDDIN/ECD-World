"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onChange,
  className,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-cream",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="rounded-full p-2 text-forest transition-colors hover:bg-shell disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <span
        aria-live="polite"
        className="min-w-7 text-center text-sm font-medium tabular-nums text-ink"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="rounded-full p-2 text-forest transition-colors hover:bg-shell disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
