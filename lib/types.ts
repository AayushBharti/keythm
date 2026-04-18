export interface WpmSnapshot {
  errors: number;
  raw: number;
  second: number;
  wpm: number;
}

export interface ResultStats {
  accuracy: number;
  consistency: number;
  correctChars: number;
  correctedErrors: number;
  elapsedSeconds: number;
  extraChars: number;
  incorrectChars: number;
  missedChars: number;
  mode: string;
  modeDetail: string;
  raw: number;
  wpm: number;
  wpmHistory: WpmSnapshot[];
}
