const wordCache = new Map<string, string[]>();

export async function fetchLanguageWords(hard: boolean): Promise<string[]> {
  const key = hard ? "english_1k" : "english";
  if (wordCache.has(key)) {
    return wordCache.get(key)!;
  }

  let res = await fetch(`/languages/${key}.json`);
  if (!res.ok && hard) {
    res = await fetch("/languages/english.json");
  }
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { words: string[] };
  wordCache.set(key, data.words);
  return data.words;
}
