import type { ResultStats } from "@/lib/types";

/**
 * Reasons a test result can be flagged as invalid.
 */
export type InvalidReason =
  | "no_keystrokes" // nothing was typed
  | "invalid_numbers" // NaN / Infinity in core stats
  | "invalid_accuracy" // accuracy outside [0, 100]
  | "zero_time" // elapsed time ≤ 0
  | "too_short" // test lasted < 2 s (not enough signal)
  | "impossible_wpm"; // WPM above human ceiling (~300)

export interface ValidationResult {
  reason?: InvalidReason;
  valid: boolean;
}

const MAX_WPM = 300;
const MIN_ELAPSED_SECONDS = 2;

/**
 * Returns `{ valid: true }` for a legitimate result or
 * `{ valid: false, reason }` with the first failing check.
 */
export function validateResult(stats: ResultStats): ValidationResult {
  const { wpm, raw, accuracy, correctChars, incorrectChars, extraChars, elapsedSeconds } = stats;

  const keystrokes = correctChars + incorrectChars + extraChars;

  // 1. Nothing typed
  if (keystrokes === 0) {
    return { valid: false, reason: "no_keystrokes" };
  }

  // 2. Core stats must be finite numbers
  if (
    !(Number.isFinite(wpm) && Number.isFinite(raw) && Number.isFinite(accuracy))
  ) {
    return { valid: false, reason: "invalid_numbers" };
  }

  // 3. Accuracy must be in [0, 100]
  if (accuracy < 0 || accuracy > 100) {
    return { valid: false, reason: "invalid_accuracy" };
  }

  // 4. Time sanity
  if (elapsedSeconds <= 0) {
    return { valid: false, reason: "zero_time" };
  }

  if (elapsedSeconds < MIN_ELAPSED_SECONDS) {
    return { valid: false, reason: "too_short" };
  }

  // 5. Impossible speed — human ceiling
  if (wpm > MAX_WPM) {
    return { valid: false, reason: "impossible_wpm" };
  }

  return { valid: true };
}

/** Convenience boolean wrapper — drop-in replacement for the old helper. */
export function isInvalidTestResult(stats: ResultStats): boolean {
  return !validateResult(stats).valid;
}
