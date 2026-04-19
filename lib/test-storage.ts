import type { QuoteLength } from "@/lib/quotes";
import type { Difficulty } from "@/lib/words";

export type TestMode = "time" | "words" | "quote" | "zen";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;

export const TEST_MODE_STORAGE_KEY = "tc-test-mode";
export const TIME_OPTION_STORAGE_KEY = "tc-time-option";
export const WORD_OPTION_STORAGE_KEY = "tc-word-option";
export const QUOTE_LENGTH_STORAGE_KEY = "tc-quote-length";
export const PUNCTUATION_STORAGE_KEY = "tc-punctuation";
export const NUMBERS_STORAGE_KEY = "tc-numbers";
export const DIFFICULTY_STORAGE_KEY = "tc-difficulty";

const VALID_TEST_MODES: readonly TestMode[] = ["time", "words", "quote", "zen"];
const VALID_TIME_OPTIONS: readonly TimeOption[] = [15, 30, 60, 120];
const VALID_WORD_OPTIONS: readonly WordOption[] = [10, 25, 50, 100];
const VALID_QUOTE_LENGTHS: readonly QuoteLength[] = ["short", "medium", "long"];
const VALID_DIFFICULTIES: readonly Difficulty[] = ["easy", "hard"];

function isBrowser() {
  return typeof window !== "undefined";
}

export function readStoredTestMode(): TestMode | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(TEST_MODE_STORAGE_KEY);
  if (!(raw && (VALID_TEST_MODES as readonly string[]).includes(raw))) {
    return;
  }
  return raw as TestMode;
}

export function readStoredTimeOption(): TimeOption | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(TIME_OPTION_STORAGE_KEY);
  if (raw === null) {
    return;
  }
  const n = Number(raw);
  if (!(Number.isFinite(n) && VALID_TIME_OPTIONS.includes(n as TimeOption))) {
    return;
  }
  return n as TimeOption;
}

export function readStoredWordOption(): WordOption | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(WORD_OPTION_STORAGE_KEY);
  if (raw === null) {
    return;
  }
  const n = Number(raw);
  if (
    !(
      Number.isFinite(n) &&
      (VALID_WORD_OPTIONS as readonly number[]).includes(n)
    )
  ) {
    return;
  }
  return n as WordOption;
}

export function readStoredQuoteLength(): QuoteLength | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(QUOTE_LENGTH_STORAGE_KEY);
  if (!(raw && (VALID_QUOTE_LENGTHS as readonly string[]).includes(raw))) {
    return;
  }
  return raw as QuoteLength;
}

export function readStoredBool(key: string): boolean | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(key);
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }
  return;
}

export function readStoredDifficulty(): Difficulty | undefined {
  if (!isBrowser()) {
    return;
  }
  const raw = localStorage.getItem(DIFFICULTY_STORAGE_KEY);
  if (!(raw && (VALID_DIFFICULTIES as readonly string[]).includes(raw))) {
    return;
  }
  return raw as Difficulty;
}
