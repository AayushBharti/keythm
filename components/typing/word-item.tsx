"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export interface WordItemProps {
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
}: WordItemProps) {
  return (
    <div
      className={cn(
        "relative",
        isPast &&
          hasError &&
          "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-destructive/50"
      )}
      ref={isActive ? elemRef : undefined}
    >
      {word.split("").map((char, cIdx) => {
        let color = "text-muted-foreground/40";
        if ((isPast || isActive) && cIdx < displayInput.length) {
          color =
            displayInput[cIdx] === char
              ? "text-foreground"
              : "text-destructive";
        }

        return (
          <span className="relative inline-block" key={cIdx}>
            {/* Cursor before this char */}
            {isActive && cIdx === displayInput.length && (
              <span className="typing-cursor absolute top-0.5 -left-px h-[1.2em] w-0.5 rounded-full bg-primary" />
            )}
            {isActive &&
              cIdx === word.length - 1 &&
              displayInput.length >= word.length && (
                <span className="typing-cursor absolute top-0.5 -right-px h-[1.2em] w-0.5 rounded-full bg-primary" />
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
