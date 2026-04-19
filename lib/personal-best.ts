const PB_KEY = "kz-personal-best";

export interface PersonalBest {
  accuracy: number;
  date: string;
  wpm: number;
}

export function getPersonalBest(): PersonalBest | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(PB_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as PersonalBest;
  } catch {
    return null;
  }
}

export function saveIfPersonalBest(
  _mode: string,
  _detail: string,
  wpm: number,
  accuracy: number
): { isNewPb: boolean; previous: PersonalBest | null } {
  const prev = getPersonalBest();
  if (!prev || wpm > prev.wpm) {
    localStorage.setItem(
      PB_KEY,
      JSON.stringify({ wpm, accuracy, date: new Date().toISOString() })
    );
    return { isNewPb: true, previous: prev };
  }
  return { isNewPb: false, previous: prev };
}
