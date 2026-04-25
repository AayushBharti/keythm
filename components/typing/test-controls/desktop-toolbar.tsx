"use client";

import { LayoutGroup } from "motion/react";
import { cn } from "@/lib/utils";
import {
  groupClass,
  MODES,
  Selector,
  SubOptionStack,
} from "./primitives";
import type { TestControlsProps } from "./test-controls";

/** Desktop inline toolbar. */
export function DesktopToolbar({
  mode,
  timeOption,
  wordOption,
  quoteLength,
  onModeChange,
  onTimeOptionChange,
  onWordOptionChange,
  onQuoteLengthChange,
}: TestControlsProps) {
  return (
    <LayoutGroup id="toolbar">
      <div className="flex items-center gap-2">
        {/* Mode selector */}
        <div className={groupClass}>
          {MODES.map(({ value, icon: Icon, label }) => (
            <Selector
              active={mode === value}
              key={value}
              layoutId="mode"
              onClick={() => onModeChange(value)}
            >
              <Icon size={13} />
              {label}
            </Selector>
          ))}
        </div>

        {/* Sub-options */}
        <div
          className={cn(
            groupClass,
            "relative grid transition-opacity duration-200 [&>*]:col-start-1 [&>*]:row-start-1",
            mode === "zen" && "pointer-events-none opacity-0"
          )}
        >
          <SubOptionStack
            mode={mode}
            onQuoteLengthChange={onQuoteLengthChange}
            onTimeOptionChange={onTimeOptionChange}
            onWordOptionChange={onWordOptionChange}
            quoteLength={quoteLength}
            timeOption={timeOption}
            wordOption={wordOption}
          />
        </div>
      </div>
    </LayoutGroup>
  );
}
