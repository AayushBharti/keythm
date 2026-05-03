"use client";

import { motion } from "motion/react";
import { memo } from "react";
import { cn } from "@/lib/utils";

export interface WordItemProps {
  /** When true, the word fades nearly invisible (ghost mode for upcoming words). */
  dimmed?: boolean;
  /** Live `typed` for the active word; finalized input for past; "" for future. */
  displayInput: string;
  elemRef?: React.RefObject<HTMLDivElement | null>;
  /** True when a completed word was typed with any error → red underline. */
  hasError: boolean;
  isActive: boolean;
  isPast: boolean;
  word: string;
}

export const WordItem = memo(function WordItem({
  word,
  displayInput,
  isActive,
  isPast,
  hasError,
  elemRef,
  dimmed = false,
}: WordItemProps) {
  const cursorAtEnd = isActive && displayInput.length >= word.length;

  return (
    <div
      className={cn(
        "relative",
        isPast &&
          hasError &&
          "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-destructive/50"
      )}
      ref={isActive ? elemRef : undefined}
      style={dimmed ? { opacity: 0.05 } : undefined}
    >
      {word.split("").map((char, cIdx) => {
        let color = "text-muted-foreground/40";
        if ((isPast || isActive) && cIdx < displayInput.length) {
          color =
            displayInput[cIdx] === char
              ? "text-foreground"
              : "text-destructive";
        }
        const isLastChar = cIdx === word.length - 1;

        return (
          <span className="relative inline-block" key={cIdx}>
            {/* Cursor before this char. Stable layoutId → Framer Motion FLIP-animates
                the cursor smoothly when wordIndex changes (spacebar press). */}
            {isActive && cIdx === displayInput.length && (
              <motion.span
                className="typing-cursor absolute top-0.5 -left-px h-[1.2em] w-0.5 rounded-full bg-primary"
                layoutId="cursor-active"
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 38,
                  mass: 0.6,
                }}
              />
            )}
            {isActive && isLastChar && cursorAtEnd && (
              <motion.span
                className="typing-cursor absolute top-0.5 -right-px h-[1.2em] w-0.5 rounded-full bg-primary"
                layoutId="cursor-active"
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 38,
                  mass: 0.6,
                }}
              />
            )}
            <span className={cn("transition-colors duration-60", color)}>
              {char}
            </span>
          </span>
        );
      })}

      {(isActive || isPast) &&
        displayInput.length > word.length &&
        displayInput
          .slice(word.length)
          .split("")
          .map((char, eIdx) => (
            <span className="text-destructive/60" key={`extra-${eIdx}`}>
              {char}
            </span>
          ))}
    </div>
  );
});
