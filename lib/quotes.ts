import rawQuotes from "@/data/quotes.json";

export type QuoteLength = "short" | "medium" | "long";

const BOUNDS: Record<QuoteLength, [number, number]> = {
  short: [40, 130],
  medium: [131, 199],
  long: [200, 600],
};

export function getQuote(length: QuoteLength): {
  words: string[];
  author: string;
} {
  const [min, max] = BOUNDS[length];
  const pool = rawQuotes.filter(
    (q) => q.text.length >= min && q.text.length <= max
  );
  const quote = pool[Math.floor(Math.random() * pool.length)];
  return { words: quote.text.split(" "), author: quote.from };
}
