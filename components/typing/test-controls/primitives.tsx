"use client";

import { Clock, Mountains, Quotes, TextAa } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { QuoteLength } from "@/lib/quotes";
import type { TestMode, TimeOption, WordOption } from "@/lib/test-storage";
import { cn } from "@/lib/utils";

export const MODES = [
  { value: "time", icon: Clock, label: "time" },
  { value: "words", icon: TextAa, label: "words" },
  { value: "quote", icon: Quotes, label: "quote" },
  { value: "zen", icon: Mountains, label: "zen" },
] as const;

export const pillEase = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

export const groupClass =
  "flex items-center rounded-[14px] bg-black/[0.04] p-1 dark:bg-white/[0.04]";

/* ─── Toggle: independent on/off ─────────────────────────── */

export function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      className={cn(
        "flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 font-medium text-[11px] transition-colors duration-150",
        active
          ? "text-primary"
          : "text-muted-foreground/50 hover:text-muted-foreground/70"
      )}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Selector: single-select with sliding pill ──────────── */

export function Selector({
  active,
  onClick,
  layoutId,
  children,
}: {
  active: boolean;
  onClick: () => void;
  layoutId: string;
  children: ReactNode;
}) {
  return (
    <motion.button
      className={cn(
        "relative z-10 flex items-center gap-1 rounded-[10px] px-3 py-1.5 font-medium text-[11px] transition-colors duration-150",
        active
          ? "text-primary"
          : "text-muted-foreground/50 hover:text-muted-foreground/70"
      )}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.97 }}
    >
      {children}
      {active && (
        <motion.span
          className="absolute inset-0 rounded-[10px] bg-primary/20 dark:bg-primary/10"
          layoutId={layoutId}
          transition={pillEase}
        />
      )}
    </motion.button>
  );
}

/* ─── Separator ──────────────────────────────────────────── */

export function Sep() {
  return <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/[0.06]" />;
}

/* ─── Sub-options ────────────────────────────────────────── */

export function SubOptions({
  mode,
  timeOption,
  wordOption,
  quoteLength,
  onTimeOptionChange,
  onWordOptionChange,
  onQuoteLengthChange,
}: {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  quoteLength: QuoteLength;
  onTimeOptionChange: (next: TimeOption) => void;
  onWordOptionChange: (next: WordOption) => void;
  onQuoteLengthChange: (next: QuoteLength) => void;
}) {
  if (mode === "time") {
    return (
      <>
        {([15, 30, 60, 120] as const).map((t) => (
          <Selector
            active={timeOption === t}
            key={t}
            layoutId="sub-time"
            onClick={() => onTimeOptionChange(t)}
          >
            {t}
          </Selector>
        ))}
      </>
    );
  }

  if (mode === "words") {
    return (
      <>
        {([10, 25, 50, 100] as const).map((w) => (
          <Selector
            active={wordOption === w}
            key={w}
            layoutId="sub-words"
            onClick={() => onWordOptionChange(w)}
          >
            {w}
          </Selector>
        ))}
      </>
    );
  }

  if (mode === "quote") {
    return (
      <>
        {(["short", "medium", "long"] as const).map((q) => (
          <Selector
            active={quoteLength === q}
            key={q}
            layoutId="sub-quote"
            onClick={() => onQuoteLengthChange(q)}
          >
            {q}
          </Selector>
        ))}
      </>
    );
  }

  return null;
}

/* ─── Shared sub-option stack ────────────────────────────── */

export function SubOptionStack({
  mode,
  timeOption,
  wordOption,
  quoteLength,
  onTimeOptionChange,
  onWordOptionChange,
  onQuoteLengthChange,
}: {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  quoteLength: QuoteLength;
  onTimeOptionChange: (next: TimeOption) => void;
  onWordOptionChange: (next: WordOption) => void;
  onQuoteLengthChange: (next: QuoteLength) => void;
}) {
  return (
    <>
      {(["time", "words", "quote", "zen"] as const).map((m) => {
        const isActive = mode === m;
        return (
          <div
            aria-hidden={!isActive}
            className={cn(
              "flex items-center gap-0.5 transition-[opacity,filter] duration-150",
              isActive
                ? "opacity-100"
                : "pointer-events-none opacity-0 blur-[2px]"
            )}
            key={m}
          >
            {m === "zen" ? (
              <span className="px-4 py-1.5 text-[10px] text-muted-foreground/20 italic tracking-widest">
                free flow
              </span>
            ) : (
              <SubOptions
                mode={m}
                onQuoteLengthChange={onQuoteLengthChange}
                onTimeOptionChange={onTimeOptionChange}
                onWordOptionChange={onWordOptionChange}
                quoteLength={quoteLength}
                timeOption={timeOption}
                wordOption={wordOption}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
