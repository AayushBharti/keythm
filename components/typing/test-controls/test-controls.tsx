"use client";

import { motion } from "motion/react";
import type { QuoteLength } from "@/lib/quotes";
import type { TestMode, TimeOption, WordOption } from "@/lib/test-storage";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/words";
import { DesktopToolbar } from "./desktop-toolbar";
import { MobileToolbar } from "./mobile-toolbar";

export interface TestControlsProps {
  controlsVisible: boolean;
  difficulty: Difficulty | undefined;
  mode: TestMode;
  numbers: boolean;
  onDifficultyToggle: (d: Difficulty) => void;
  onModeChange: (next: TestMode) => void;
  onNumbersToggle: () => void;
  onPunctuationToggle: () => void;
  onQuoteLengthChange: (next: QuoteLength) => void;
  onRestart: () => void;
  onTimeOptionChange: (next: TimeOption) => void;
  onWordOptionChange: (next: WordOption) => void;
  punctuation: boolean;
  quoteLength: QuoteLength;
  timeOption: TimeOption;
  wordOption: WordOption;
}

/** Orchestrator: renders DesktopToolbar or MobileToolbar based on viewport. */
export function TestControls(props: TestControlsProps) {
  const { controlsVisible } = props;

  return (
    <motion.div
      animate={{ opacity: controlsVisible ? 1 : 0 }}
      className={cn(
        "flex items-center justify-center",
        !controlsVisible && "pointer-events-none select-none"
      )}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Desktop: full inline toolbar */}
      <div className="hidden md:block">
        <DesktopToolbar {...props} />
      </div>

      {/* Mobile: compact bar + drawer */}
      <div className="block md:hidden">
        <MobileToolbar {...props} />
      </div>
    </motion.div>
  );
}
