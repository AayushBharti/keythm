"use client";

import { At, Hash } from "@phosphor-icons/react";
import { LayoutGroup } from "motion/react";
import { cn } from "@/lib/utils";
import {
  groupClass,
  MODES,
  Selector,
  Sep,
  SubOptionStack,
  Toggle,
} from "./primitives";
import type { TestControlsProps } from "./test-controls";

/** Desktop inline three-group toolbar. */
export function DesktopToolbar({
  mode,
  timeOption,
  wordOption,
  quoteLength,
  punctuation,
  numbers,
  difficulty,
  onModeChange,
  onTimeOptionChange,
  onWordOptionChange,
  onQuoteLengthChange,
  onPunctuationToggle,
  onNumbersToggle,
  onDifficultyToggle,
}: TestControlsProps) {
  return (
    <LayoutGroup id="toolbar">
      <div className="flex items-center gap-2">
        {/* Toggles */}
        <div className={groupClass}>
          <Toggle active={punctuation} onClick={onPunctuationToggle}>
            <At size={13} weight="duotone" />
            punctuation
          </Toggle>
          <Toggle active={numbers} onClick={onNumbersToggle}>
            <Hash size={13} weight="duotone" />
            numbers
          </Toggle>
          <Sep />
          <Toggle
            active={difficulty === "easy"}
            onClick={() => onDifficultyToggle("easy")}
          >
            easy
          </Toggle>
          <Toggle
            active={difficulty === "hard"}
            onClick={() => onDifficultyToggle("hard")}
          >
            hard
          </Toggle>
        </div>

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
