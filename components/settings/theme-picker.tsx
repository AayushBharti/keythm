"use client";

import { Check } from "@phosphor-icons/react";
import { THEME_OPTIONS } from "@/components/settings/settings-provider";
import type { KeyboardThemeName } from "@/components/ui/keyboard";
import { cn } from "@/lib/utils";

export function ThemeGrid({
  active,
  onSelect,
}: {
  active: KeyboardThemeName;
  onSelect: (id: KeyboardThemeName) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {THEME_OPTIONS.map((t) => {
        const selected = active === t.id;
        return (
          <button
            className={cn(
              "group relative flex flex-col gap-2.5 rounded-xl px-3 py-3 text-left transition-all duration-150",
              selected
                ? "bg-foreground/[0.06] ring-1 ring-foreground/10"
                : "hover:bg-foreground/[0.04]"
            )}
            key={t.id}
            onClick={() => onSelect(t.id)}
          >
            {/* Palette strip — 3 colors */}
            <div className="flex h-6 w-full overflow-hidden rounded-lg ring-1 ring-black/5">
              <span
                className="flex-1"
                style={{ backgroundColor: t.colors[0] }}
              />
              <span
                className="flex-1"
                style={{ backgroundColor: t.colors[1] }}
              />
              <span
                className="flex-1"
                style={{ backgroundColor: t.colors[2] }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-medium text-xs",
                  selected
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {t.label}
              </span>
              {selected && <Check className="text-primary" size={14} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
