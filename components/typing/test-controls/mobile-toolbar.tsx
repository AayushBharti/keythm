"use client"

import { At, Clock, Hash, Sliders } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { groupClass, MODES, Sep } from "./primitives"
import type { TestControlsProps } from "./test-controls"

/* ─── Drawer helpers ─────────────────────────────────────── */

function DrawerSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-2 font-semibold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
        {title}
      </p>
      {children}
    </div>
  )
}

function DrawerChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-medium text-xs transition-colors duration-150",
        active
          ? "bg-primary/10 text-primary"
          : "bg-foreground/[0.04] text-muted-foreground/50 hover:text-muted-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

/** Mobile compact trigger bar + bottom drawer with full controls. */
export function MobileToolbar({
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
  const activeMode = MODES.find((m) => m.value === mode)
  const ActiveIcon = activeMode?.icon ?? Clock

  function getSubLabel() {
    if (mode === "time") {
      return `${timeOption}s`
    }
    if (mode === "words") {
      return `${wordOption}`
    }
    if (mode === "quote") {
      return quoteLength
    }
    return "zen"
  }
  const subLabel = getSubLabel()

  const activeModifiers = [
    punctuation && "@",
    numbers && "#",
    difficulty === "easy" && "easy",
    difficulty === "hard" && "hard",
  ].filter(Boolean)

  return (
    <Drawer>
      {/* Compact trigger bar */}
      <DrawerTrigger
        className={cn(
          groupClass,
          "gap-2 px-3 py-2 font-medium text-[11px] text-muted-foreground",
        )}
      >
        <ActiveIcon className="text-primary" size={13} weight="duotone" />
        <span className="text-primary">{activeMode?.label}</span>
        <Sep />
        <span className="text-primary">{subLabel}</span>
        {activeModifiers.length > 0 && (
          <>
            <Sep />
            <span className="text-muted-foreground/50">
              {activeModifiers.join(" ")}
            </span>
          </>
        )}
        <Sliders
          className="ml-1 text-muted-foreground/30"
          size={14}
          weight="duotone"
        />
      </DrawerTrigger>

      {/* Bottom drawer with full controls */}
      <DrawerPopup className="mx-2! mb-2! flex max-h-[70dvh] flex-col rounded-2xl! [--bleed:0px]">
        <DrawerContent>
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-semibold text-foreground text-sm">
              Test Options
            </DrawerTitle>
            <DrawerClose className="flex items-center justify-center rounded-full bg-foreground/[0.06] p-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
              <span className="sr-only">Close</span>
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <title>Close</title>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </DrawerClose>
          </div>

          <div className="mt-6 space-y-6">
            {/* Mode */}
            <DrawerSection title="Mode">
              <div className="flex flex-wrap gap-1.5">
                {MODES.map(({ value, icon: Icon, label }) => (
                  <DrawerChip
                    active={mode === value}
                    key={value}
                    onClick={() => onModeChange(value)}
                  >
                    <Icon size={14} />
                    {label}
                  </DrawerChip>
                ))}
              </div>
            </DrawerSection>

            {/* Sub-options */}
            {mode !== "zen" && (
              <DrawerSection
                title={
                  mode === "time"
                    ? "Duration"
                    : mode === "words"
                      ? "Word count"
                      : "Length"
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  {mode === "time" &&
                    ([15, 30, 60, 120] as const).map((t) => (
                      <DrawerChip
                        active={timeOption === t}
                        key={t}
                        onClick={() => onTimeOptionChange(t)}
                      >
                        {t}s
                      </DrawerChip>
                    ))}
                  {mode === "words" &&
                    ([10, 25, 50, 100] as const).map((w) => (
                      <DrawerChip
                        active={wordOption === w}
                        key={w}
                        onClick={() => onWordOptionChange(w)}
                      >
                        {w}
                      </DrawerChip>
                    ))}
                  {mode === "quote" &&
                    (["short", "medium", "long"] as const).map((q) => (
                      <DrawerChip
                        active={quoteLength === q}
                        key={q}
                        onClick={() => onQuoteLengthChange(q)}
                      >
                        {q}
                      </DrawerChip>
                    ))}
                </div>
              </DrawerSection>
            )}

            {/* Modifiers */}
            <DrawerSection title="Modifiers">
              <div className="flex flex-wrap gap-1.5">
                <DrawerChip active={punctuation} onClick={onPunctuationToggle}>
                  <At size={14} weight="duotone" />
                  punctuation
                </DrawerChip>
                <DrawerChip active={numbers} onClick={onNumbersToggle}>
                  <Hash size={14} weight="duotone" />
                  numbers
                </DrawerChip>
              </div>
            </DrawerSection>

            {/* Difficulty */}
            <DrawerSection title="Difficulty">
              <div className="flex flex-wrap gap-1.5">
                <DrawerChip
                  active={difficulty === "easy"}
                  onClick={() => onDifficultyToggle("easy")}
                >
                  easy
                </DrawerChip>
                <DrawerChip
                  active={difficulty === "hard"}
                  onClick={() => onDifficultyToggle("hard")}
                >
                  hard
                </DrawerChip>
              </div>
            </DrawerSection>
          </div>
        </DrawerContent>
      </DrawerPopup>
    </Drawer>
  )
}
