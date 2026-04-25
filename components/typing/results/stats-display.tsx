"use client";

import { AnimatedNumber } from "@/components/ui/animated-number";

export function KeyStat({
  label,
  value,
  suffix,
  animated,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  animated?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-bold font-mono text-2xl text-foreground">
        {animated && typeof value === "number" ? (
          <AnimatedNumber suffix={suffix} value={value} />
        ) : (
          value
        )}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export function DetailStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`font-medium font-mono text-xs ${accent ? "text-primary" : "text-muted-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
