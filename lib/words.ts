import { generate } from "random-words";

const punctuationMarks = [".", ",", "!", "?", ";", ":"] as const;

export type Difficulty = "easy" | "hard";

function shuffleInPlace(words: string[]): void {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
}

function pickWithoutReplacement(pool: string[], count: number): string[] {
  const unique = [...new Set(pool)];
  const out: string[] = [];
  let deck = [...unique];
  shuffleInPlace(deck);
  let i = 0;

  while (out.length < count) {
    if (i >= deck.length) {
      const prev = out[out.length - 1];
      deck = [...unique];
      shuffleInPlace(deck);
      i = 0;
      if (prev !== undefined && deck[0] === prev && deck.length > 1) {
        const swapIdx = 1 + Math.floor(Math.random() * (deck.length - 1));
        [deck[0], deck[swapIdx]] = [deck[swapIdx], deck[0]];
      }
    }
    out.push(deck[i]!);
    i += 1;
  }

  return out;
}

function applyModifiers(
  raw: string[],
  options?: { punctuation?: boolean; numbers?: boolean }
): string[] {
  return raw.map((word) => {
    if (options?.numbers && Math.random() < 0.15) {
      return String(Math.floor(Math.random() * 10_000));
    }
    if (!options?.punctuation) {
      return word;
    }
    const rand = Math.random();
    if (rand < 0.1) {
      return (
        word +
        punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)]
      );
    }
    if (rand < 0.15) {
      return `"${word}"`;
    }
    if (rand < 0.2) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
}

/**
 * Generate words from a pre-fetched language word pool (MonkeyType lists).
 * Used for non-English languages and for English when a language pool is loaded.
 */
export function generateWordsFromPool(
  pool: string[],
  count: number,
  options?: { punctuation?: boolean; numbers?: boolean }
): string[] {
  const raw = pickWithoutReplacement(pool, count);
  return applyModifiers(raw, options);
}

/**
 * Fallback: generate English words using the `random-words` npm package.
 * Only used when no language pool is available.
 */
export function generateWords(
  count: number,
  options?: {
    punctuation?: boolean;
    numbers?: boolean;
    difficulty?: Difficulty;
  }
): string[] {
  let raw: string[];

  if (options?.difficulty === "hard") {
    raw = generate({ exactly: count, minLength: 5, maxLength: 12 }) as string[];
  } else {
    raw = generate({ exactly: count, minLength: 2, maxLength: 8 }) as string[];
  }

  return applyModifiers(raw, options);
}
