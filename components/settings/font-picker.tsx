"use client";

import { Check } from "@phosphor-icons/react";
import {
  FONT_OPTIONS,
  type FontOption,
} from "@/components/settings/settings-provider";
import { cn } from "@/lib/utils";

/** Grouped list of selectable fonts, split by mono/display tag. */
export function FontList({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: FontOption["id"]) => void;
}) {
  const monoFonts = FONT_OPTIONS.filter((f) => f.tag === "mono");
  const sansFonts = FONT_OPTIONS.filter((f) => f.tag === "sans");

  return (
    <div className="space-y-5">
      <FontGroup
        active={active}
        fonts={monoFonts}
        label="Mono"
        onSelect={onSelect}
      />
      <FontGroup
        active={active}
        fonts={sansFonts}
        label="Sans"
        onSelect={onSelect}
      />
    </div>
  );
}

/** Single labelled group of font options. */
function FontGroup({
  label,
  fonts,
  active,
  onSelect,
}: {
  label: string;
  fonts: FontOption[];
  active: string;
  onSelect: (id: FontOption["id"]) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 px-3 font-semibold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
        {label}
      </p>
      <div className="space-y-0.5">
        {fonts.map((f) => {
          const selected = active === f.id;
          return (
            <button
              className={cn(
                "group/font flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-150",
                selected ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.03]"
              )}
              key={f.id}
              onClick={() => onSelect(f.id)}
            >
              <span
                className={cn(
                  "text-xs transition-colors duration-150",
                  selected
                    ? "font-medium text-foreground"
                    : "text-muted-foreground group-hover/font:text-foreground"
                )}
                style={{ fontFamily: f.cssFamily }}
              >
                {f.label}
              </span>
              {selected && (
                <Check
                  className="shrink-0 text-primary"
                  size={14}
                  weight="duotone"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
