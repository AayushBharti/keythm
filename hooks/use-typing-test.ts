"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchLanguageWords } from "@/lib/languages";
import { getQuote, type QuoteLength } from "@/lib/quotes";
import {
  DIFFICULTY_STORAGE_KEY,
  NUMBERS_STORAGE_KEY,
  PUNCTUATION_STORAGE_KEY,
  QUOTE_LENGTH_STORAGE_KEY,
  readStoredBool,
  readStoredDifficulty,
  readStoredQuoteLength,
  readStoredTestMode,
  readStoredTimeOption,
  readStoredWordOption,
  TEST_MODE_STORAGE_KEY,
  type TestMode,
  TIME_OPTION_STORAGE_KEY,
  type TimeOption,
  WORD_OPTION_STORAGE_KEY,
  type WordOption,
} from "@/lib/test-storage";
import type { ResultStats, WpmSnapshot } from "@/lib/types";
import {
  type Difficulty,
  generateWords,
  generateWordsFromPool,
} from "@/lib/words";
import {
  accuracyFromCounts,
  countWpm,
  wpmNumeratorFromCounts,
} from "@/lib/wpm-count";

type ResetOverrides = Partial<{
  mode: TestMode;
  quoteLength: QuoteLength;
  wordOption: WordOption;
  timeOption: TimeOption;
  punctuation: boolean;
  numbers: boolean;
  difficulty: Difficulty | undefined;
}>;

interface UseTypingTestProps {
  onFinished?: (finished: boolean) => void;
  onFocusChange?: (focused: boolean) => void;
  onKeyHighlight?: (key: string | null) => void;
  onTypingActiveChange?: (active: boolean) => void;
  onWrongKey?: () => void;
  pauseTypingInputRefocus?: boolean;
}

export function useTypingTest({
  onKeyHighlight,
  onFinished,
  onTypingActiveChange,
  onFocusChange,
  onWrongKey,
  pauseTypingInputRefocus = false,
}: UseTypingTestProps) {
  const pauseRefocusRef = useRef(false);
  pauseRefocusRef.current = pauseTypingInputRefocus;

  // ── Options state ────────────────────────────────────────────────────────
  const [mode, setMode] = useState<TestMode>("time");
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>("medium");
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>("easy");

  // Word pool cache (kept in a ref so it survives re-renders)
  const wordPoolRef = useRef<{
    hard: boolean;
    words: string[];
  } | null>(null);

  // ── Test state ───────────────────────────────────────────────────────────
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [rowOffset, setRowOffset] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordInputs, setWordInputs] = useState<string[]>([]);
  const [wpmHistory, setWpmHistory] = useState<WpmSnapshot[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [isActivelyTyping, setIsActivelyTyping] = useState(false);
  const [screenFade, setScreenFade] = useState(1);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const correctCharsRef = useRef(0);
  const allTypedRef = useRef(0);
  const errorsThisSecondRef = useRef(0);
  const elapsedSecondsRef = useRef(0);
  const correctedErrorsRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabPressedRef = useRef(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetAnimRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTestRef = useRef<(() => void) | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const mtCounts = useMemo(
    () =>
      countWpm({
        targetWords: words,
        wordInputs,
        typed,
        wordIndex,
        mode,
        final: finished,
      }),
    [words, wordInputs, typed, wordIndex, mode, finished]
  );
  const wpmNumerator = wpmNumeratorFromCounts(mtCounts);
  const accuracy = accuracyFromCounts(mtCounts);
  correctCharsRef.current = wpmNumerator;

  // Rule 1: derive realtime WPM inline — re-computed on every render triggered
  // by a keystroke (typed changes → re-render), no useEffect needed.
  const wpm =
    started && startTime && !finished
      ? Math.round(
          wpmNumerator /
            5 /
            Math.max((Date.now() - startTime) / 1000 / 60, 1 / 60)
        )
      : 0;

  // ── finishTest ───────────────────────────────────────────────────────────
  // Rule 3: all finish-related side effects run here, not in reactive effects.
  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setFinished(true);
    setShowControls(true);
    onFinished?.(true);
    onTypingActiveChange?.(false);
    setScreenFade(0);
    requestAnimationFrame(() => setScreenFade(1));
  }, [onFinished, onTypingActiveChange]);

  finishTestRef.current = finishTest;

  // ── buildWords: generate words from English pool or fallback ──────────
  const buildWords = useCallback(
    async (
      count: number,
      opts: {
        punctuation: boolean;
        numbers: boolean;
        difficulty: Difficulty | undefined;
      }
    ): Promise<string[]> => {
      const isHard = opts.difficulty === "hard";
      // Use cached pool if same difficulty tier
      if (wordPoolRef.current && wordPoolRef.current.hard === isHard) {
        return generateWordsFromPool(wordPoolRef.current.words, count, opts);
      }
      const pool = await fetchLanguageWords(isHard);
      if (pool.length > 0) {
        wordPoolRef.current = { hard: isHard, words: pool };
        return generateWordsFromPool(pool, count, opts);
      }
      // Fallback to random-words if fetch fails
      return generateWords(count, opts);
    },
    []
  );

  // ── resetTestWith ────────────────────────────────────────────────────────
  // Rule 3: accepts explicit overrides so option-change handlers can reset
  // immediately with the new value without waiting for state to commit.
  const resetTestWith = useCallback(
    async (overrides: ResetOverrides = {}) => {
      const m = overrides.mode ?? mode;
      const ql = overrides.quoteLength ?? quoteLength;
      const wo = overrides.wordOption ?? wordOption;
      const to = overrides.timeOption ?? timeOption;
      const p = overrides.punctuation ?? punctuation;
      const n = overrides.numbers ?? numbers;
      const d = "difficulty" in overrides ? overrides.difficulty : difficulty;
      const wc = m === "time" ? 200 : m === "words" ? wo : 100;

      setQuoteAuthor(null);
      if (m === "quote") {
        const { words: newWords, author } = getQuote(ql);
        setWords(newWords);
        setQuoteAuthor(author);
      } else {
        const newWords = await buildWords(wc, {
          punctuation: p,
          numbers: n,
          difficulty: d,
        });
        setWords(newWords);
      }
      setTyped("");
      setWordIndex(0);
      setStarted(false);
      setFinished(false);
      setStartTime(null);
      setWordInputs([]);
      setWpmHistory([]);
      correctCharsRef.current = 0;
      allTypedRef.current = 0;
      errorsThisSecondRef.current = 0;
      elapsedSecondsRef.current = 0;
      correctedErrorsRef.current = 0;
      if (m === "time") {
        setTimeLeft(to);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRowOffset(0);
      setShowControls(true);
      setIsActivelyTyping(false);
      onFinished?.(false);
      onTypingActiveChange?.(false);
      inputRef.current?.focus();
    },
    [
      mode,
      quoteLength,
      wordOption,
      timeOption,
      punctuation,
      numbers,
      difficulty,
      buildWords,
      onFinished,
      onTypingActiveChange,
    ]
  );

  const resetTestImmediate = useCallback(
    () => resetTestWith(),
    [resetTestWith]
  );

  const resetTest = useCallback(
    (overrides: ResetOverrides = {}) => {
      if (resetAnimRef.current) {
        clearTimeout(resetAnimRef.current);
      }
      setResetting(true);
      resetAnimRef.current = setTimeout(() => {
        void resetTestWith(overrides).then(() => {
          setResetting(false);
          resetAnimRef.current = null;
        });
      }, 150);
    },
    [resetTestWith]
  );

  // One-time mount — read persisted options and build the first word set.
  useEffect(() => {
    const storedMode = readStoredTestMode();
    const storedTime = readStoredTimeOption();
    const storedWordOption = readStoredWordOption();
    const storedQuoteLength = readStoredQuoteLength();
    const storedPunctuation = readStoredBool(PUNCTUATION_STORAGE_KEY);
    const storedNumbers = readStoredBool(NUMBERS_STORAGE_KEY);
    const storedDifficulty = readStoredDifficulty();

    const m = storedMode ?? mode;
    const to = storedTime ?? timeOption;
    const wo = storedWordOption ?? wordOption;
    const ql = storedQuoteLength ?? quoteLength;
    const p = storedPunctuation ?? punctuation;
    const n = storedNumbers ?? numbers;
    const d = storedDifficulty === undefined ? difficulty : storedDifficulty;

    if (storedMode !== undefined) {
      setMode(storedMode);
    }
    if (storedTime !== undefined) {
      setTimeOption(storedTime);
    }
    if (storedWordOption !== undefined) {
      setWordOption(storedWordOption);
    }
    if (storedQuoteLength !== undefined) {
      setQuoteLength(storedQuoteLength);
    }
    if (storedPunctuation !== undefined) {
      setPunctuation(storedPunctuation);
    }
    if (storedNumbers !== undefined) {
      setNumbers(storedNumbers);
    }
    if (storedDifficulty !== undefined) {
      setDifficulty(storedDifficulty);
    }

    const wc = m === "time" ? 200 : m === "words" ? wo : 100;
    if (m === "quote") {
      const { words: initWords, author } = getQuote(ql);
      setWords(initWords);
      setQuoteAuthor(author);
    } else {
      buildWords(wc, {
        punctuation: p,
        numbers: n,
        difficulty: d,
      }).then((w) => setWords(w));
    }
    if (m === "time") {
      setTimeLeft(to);
    }
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helper callbacks ─────────────────────────────────────────────────────
  const markTypingActive = useCallback(() => {
    setIsActivelyTyping(true);
    if (typingIdleRef.current) {
      clearTimeout(typingIdleRef.current);
    }
    typingIdleRef.current = setTimeout(() => setIsActivelyTyping(false), 1000);
  }, []);

  const handleMouseMove = useCallback(() => {
    if (!started || finished) {
      return;
    }
    setShowControls(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }, [started, finished]);

  const recordWordSnapshot = useCallback(
    (
      snapshotWordInputs: string[],
      snapshotTyped: string,
      snapshotWordIndex: number
    ) => {
      if (!startTime || mode === "time") {
        return;
      }
      const snapCounts = countWpm({
        targetWords: words,
        wordInputs: snapshotWordInputs,
        typed: snapshotTyped,
        wordIndex: snapshotWordIndex,
        mode,
        final: false,
      });
      const snapNum = wpmNumeratorFromCounts(snapCounts);
      const elapsedSec = (Date.now() - startTime) / 1000;
      elapsedSecondsRef.current = elapsedSec;
      const elapsedMin = elapsedSec / 60 || 1 / 60;
      const snapWpm = Math.round(snapNum / 5 / elapsedMin);
      const snapRaw = Math.max(
        Math.round(allTypedRef.current / 5 / elapsedMin),
        snapWpm
      );
      setWpmHistory((prev) => [
        ...prev,
        {
          second: Math.round(elapsedSec),
          wpm: snapWpm,
          raw: snapRaw,
          errors: errorsThisSecondRef.current,
        },
      ]);
      errorsThisSecondRef.current = 0;
    },
    [startTime, mode, words]
  );

  const clearWordOrNavigateBack = useCallback(() => {
    if (typed.length > 0) {
      setTyped("");
      const cw = words[wordIndex];
      onKeyHighlight?.(cw && cw.length > 0 ? cw[0] : null);
      return;
    }
    if (wordIndex <= 0) {
      return;
    }
    const prevInput = wordInputs[wordIndex - 1];
    const prevWord = words[wordIndex - 1];
    setWordIndex((prev) => prev - 1);
    setTyped(prevInput);
    setWordInputs((prev) => prev.slice(0, -1));
    if (prevInput.length < prevWord.length) {
      onKeyHighlight?.(prevWord[prevInput.length]);
    } else {
      onKeyHighlight?.(" ");
    }
  }, [typed, wordIndex, wordInputs, words, onKeyHighlight]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isAltWordDelete =
        e.altKey &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        (e.key === "Backspace" || e.key === "Delete");
      const isCtrlBackspaceWordNav =
        e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.shiftKey &&
        e.key === "Backspace";

      if (isAltWordDelete || isCtrlBackspaceWordNav) {
        e.preventDefault();
        if (finished) {
          return;
        }
        if (!started) {
          setStarted(true);
          setStartTime(Date.now());
          setShowControls(false);
          onTypingActiveChange?.(true);
        }
        markTypingActive();
        clearWordOrNavigateBack();
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        setTimeout(() => {
          tabPressedRef.current = false;
        }, 1000);
        return;
      }
      if (e.key === "Enter" && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        resetTest();
        return;
      }
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        if (mode === "zen" && started && !finished) {
          finishTest();
        }
        return;
      }

      if (finished) {
        return;
      }

      // Don't start the test (or process further) for non-character keys like Shift, Enter, ArrowLeft, etc.
      if (e.key.length > 1 && e.key !== "Backspace") {
        return;
      }

      if (!started) {
        setStarted(true);
        setStartTime(Date.now());
        setShowControls(false);
        onTypingActiveChange?.(true);

        // Rule 3: start the countdown timer here in the event handler instead
        // of reacting to `started` changing in a useEffect.
        if (mode === "time") {
          let elapsedTicks = 0;
          timerRef.current = setInterval(() => {
            elapsedTicks += 1;
            elapsedSecondsRef.current = elapsedTicks;
            const elapsedMin = elapsedTicks / 60;
            const snapWpm =
              elapsedMin > 0
                ? Math.round(correctCharsRef.current / 5 / elapsedMin)
                : 0;
            const snapRaw =
              elapsedMin > 0
                ? Math.max(
                    Math.round(allTypedRef.current / 5 / elapsedMin),
                    snapWpm
                  )
                : 0;
            setWpmHistory((prev) => [
              ...prev,
              {
                second: elapsedTicks,
                wpm: snapWpm,
                raw: snapRaw,
                errors: errorsThisSecondRef.current,
              },
            ]);
            errorsThisSecondRef.current = 0;
            if (elapsedTicks >= timeOption) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              finishTestRef.current?.();
            } else {
              setTimeLeft(timeOption - elapsedTicks);
            }
          }, 1000);
        }
      }

      markTypingActive();

      const currentWord = words[wordIndex];

      if (e.key === " ") {
        e.preventDefault();
        if (typed.length === 0) {
          return;
        }

        allTypedRef.current += 1; // count the space keystroke so raw >= wpm

        for (let i = 0; i < Math.min(typed.length, currentWord.length); i++) {
          if (typed[i] !== currentWord[i]) {
            errorsThisSecondRef.current++;
          }
        }
        if (typed.length > currentWord.length) {
          errorsThisSecondRef.current++;
        }

        const nextInputs = [...wordInputs, typed];
        const nextIndex = wordIndex + 1;
        recordWordSnapshot(nextInputs, "", nextIndex);

        if (wordIndex + 1 >= words.length) {
          setWordInputs(nextInputs);
          finishTest();
          return;
        }
        setWordInputs(nextInputs);
        setWordIndex(nextIndex);
        setTyped("");
        onKeyHighlight?.(null);
        // Rule 3: measure DOM row offset after React re-renders the new active word.
        requestAnimationFrame(() => {
          if (!activeWordRef.current) {
            return;
          }
          const word = activeWordRef.current;
          const lineH = word.offsetHeight + 4;
          const row = Math.round(word.offsetTop / lineH);
          setRowOffset(Math.max(0, row - 1) * lineH);
        });
        return;
      }

      if (e.key === "Backspace") {
        if (typed.length === 0 && wordIndex > 0) {
          const prevInput = wordInputs[wordIndex - 1];
          setWordIndex((prev) => prev - 1);
          setTyped(prevInput);
          setWordInputs((prev) => prev.slice(0, -1));
        } else if (typed.length > 0) {
          const lastIdx = typed.length - 1;
          const isWrong =
            lastIdx >= currentWord.length ||
            typed[lastIdx] !== currentWord[lastIdx];
          if (isWrong) {
            correctedErrorsRef.current += 1;
          }
          setTyped((prev) => prev.slice(0, -1));
        }
        return;
      }

      if (e.key.length === 1) {
        allTypedRef.current += 1;
        const nextTyped = typed + e.key;
        setTyped(nextTyped);

        const charIndex = typed.length;
        const isWrong =
          charIndex >= currentWord.length || e.key !== currentWord[charIndex];
        if (isWrong) {
          onWrongKey?.();
        }

        const isLastWord = wordIndex + 1 >= words.length;
        if (
          isLastWord &&
          nextTyped.length >= currentWord.length &&
          mode !== "time" &&
          mode !== "zen"
        ) {
          for (
            let i = 0;
            i < Math.min(nextTyped.length, currentWord.length);
            i++
          ) {
            if (nextTyped[i] !== currentWord[i]) {
              errorsThisSecondRef.current++;
            }
          }
          if (nextTyped.length > currentWord.length) {
            errorsThisSecondRef.current++;
          }
          const nextInputs = [...wordInputs, nextTyped];
          setWordInputs(nextInputs);
          recordWordSnapshot(nextInputs, "", wordIndex + 1);
          finishTest();
          return;
        }

        const nextCharIndex = nextTyped.length;
        onKeyHighlight?.(
          nextCharIndex < currentWord.length ? currentWord[nextCharIndex] : " "
        );
      }
    },
    [
      finished,
      started,
      words,
      wordIndex,
      typed,
      wordInputs,
      mode,
      timeOption,
      resetTest,
      finishTest,
      onKeyHighlight,
      recordWordSnapshot,
      markTypingActive,
      onTypingActiveChange,
      onWrongKey,
      clearWordOrNavigateBack,
    ]
  );

  const handleFocus = () => {
    if (pauseRefocusRef.current) {
      return;
    }
    inputRef.current?.focus();
  };

  const handleInputBlur = useCallback(() => {
    if (pauseRefocusRef.current) {
      return;
    }
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  // ── Frozen stats (computed inline, not via effect) ────────────────────────
  const frozenStatsRef = useRef<ResultStats | null>(null);

  if (finished && !frozenStatsRef.current) {
    const elapsed = startTime
      ? (Date.now() - startTime) / 1000
      : elapsedSecondsRef.current;
    const elapsedMin = elapsed / 60 || 1 / 60;
    const wpmValues = wpmHistory.map((s) => s.wpm).filter((v) => v > 0);
    let consistency = 100;
    if (wpmValues.length > 1) {
      const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
      const variance =
        wpmValues.reduce((a, b) => a + (b - mean) ** 2, 0) / wpmValues.length;
      consistency = Math.max(
        0,
        Math.round(100 - (Math.sqrt(variance) / (mean || 1)) * 100)
      );
    }
    const computedWpm = Math.round(wpmNumerator / 5 / elapsedMin);
    const computedRaw = Math.max(
      Math.round(allTypedRef.current / 5 / elapsedMin),
      computedWpm
    );
    frozenStatsRef.current = {
      wpm: computedWpm,
      accuracy,
      raw: computedRaw,
      correctChars: mtCounts.correctWordChars,
      incorrectChars: mtCounts.incorrectChars,
      extraChars: mtCounts.extraChars,
      missedChars: mtCounts.missedChars,
      consistency,
      elapsedSeconds: Math.round(elapsed),
      correctedErrors: correctedErrorsRef.current,
      mode,
      modeDetail:
        mode === "time"
          ? String(timeOption)
          : mode === "words"
            ? String(wordOption)
            : mode === "quote"
              ? quoteLength
              : "",
      wpmHistory,
    };
  }
  if (!finished) {
    frozenStatsRef.current = null;
  }

  // Resets all typing state but keeps the current word list (for "restart same test").
  const resetSameWords = useCallback(() => {
    setTyped("");
    setWordIndex(0);
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setWordInputs([]);
    setWpmHistory([]);
    correctCharsRef.current = 0;
    allTypedRef.current = 0;
    errorsThisSecondRef.current = 0;
    elapsedSecondsRef.current = 0;
    correctedErrorsRef.current = 0;
    if (mode === "time") {
      setTimeLeft(timeOption);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRowOffset(0);
    setShowControls(true);
    setIsActivelyTyping(false);
    onFinished?.(false);
    onTypingActiveChange?.(false);
    inputRef.current?.focus();
  }, [mode, timeOption, onFinished, onTypingActiveChange]);

  // Rule 3: fade results→typing on restart, driven by user action.
  const handleResultsRestart = useCallback(() => {
    setScreenFade(0);
    if (screenFadeRef.current) {
      clearTimeout(screenFadeRef.current);
    }
    screenFadeRef.current = setTimeout(() => {
      setResetting(true);
      resetSameWords();
      setTimeout(() => setResetting(false), 150);
      requestAnimationFrame(() => setScreenFade(1));
      screenFadeRef.current = null;
    }, 150);
  }, [resetSameWords]);

  const handleResultsNext = useCallback(() => {
    setScreenFade(0);
    if (screenFadeRef.current) {
      clearTimeout(screenFadeRef.current);
    }
    screenFadeRef.current = setTimeout(() => {
      void resetTestImmediate().then(() => {
        requestAnimationFrame(() => setScreenFade(1));
        screenFadeRef.current = null;
      });
    }, 150);
  }, [resetTestImmediate]);

  // ── Option-change handlers (Rule 3) ──────────────────────────────────────
  const onModeChange = useCallback(
    (next: TestMode) => {
      setMode(next);
      localStorage.setItem(TEST_MODE_STORAGE_KEY, next);
      resetTest({ mode: next });
    },
    [resetTest]
  );

  const onTimeOptionChange = useCallback(
    (next: TimeOption) => {
      setTimeOption(next);
      localStorage.setItem(TIME_OPTION_STORAGE_KEY, String(next));
      resetTest({ timeOption: next });
    },
    [resetTest]
  );

  const onWordOptionChange = useCallback(
    (next: WordOption) => {
      setWordOption(next);
      localStorage.setItem(WORD_OPTION_STORAGE_KEY, String(next));
      resetTest({ wordOption: next });
    },
    [resetTest]
  );

  const onQuoteLengthChange = useCallback(
    (next: QuoteLength) => {
      setQuoteLength(next);
      localStorage.setItem(QUOTE_LENGTH_STORAGE_KEY, next);
      resetTest({ quoteLength: next });
    },
    [resetTest]
  );

  const onPunctuationToggle = useCallback(() => {
    const next = !punctuation;
    setPunctuation(next);
    localStorage.setItem(PUNCTUATION_STORAGE_KEY, String(next));
    resetTest({ punctuation: next });
  }, [punctuation, resetTest]);

  const onNumbersToggle = useCallback(() => {
    const next = !numbers;
    setNumbers(next);
    localStorage.setItem(NUMBERS_STORAGE_KEY, String(next));
    resetTest({ numbers: next });
  }, [numbers, resetTest]);

  const onDifficultyToggle = useCallback(
    (d: Difficulty) => {
      const next = difficulty === d ? undefined : d;
      setDifficulty(next);
      if (next) {
        localStorage.setItem(DIFFICULTY_STORAGE_KEY, next);
      } else {
        localStorage.removeItem(DIFFICULTY_STORAGE_KEY);
      }
      resetTest({ difficulty: next });
    },
    [difficulty, resetTest]
  );

  const controlsVisible = !started || showControls;
  const showResults = finished && frozenStatsRef.current;

  return {
    // State
    mode,
    timeOption,
    wordOption,
    quoteLength,
    quoteAuthor,
    punctuation,
    numbers,
    difficulty,
    words,
    typed,
    wordIndex,
    started,
    rowOffset,
    finished,
    timeLeft,
    wordInputs,
    showControls,
    isFocused,
    resetting,
    isActivelyTyping,
    screenFade,
    wpm,
    accuracy,
    // Computed
    controlsVisible,
    showResults,
    frozenStats: frozenStatsRef.current,
    // Refs
    inputRef,
    wordsContainerRef,
    activeWordRef,
    // Handlers
    handleKeyDown,
    handleFocus,
    handleInputBlur,
    handleInputFocus,
    handleMouseMove,
    handleResultsRestart,
    handleResultsNext,
    onModeChange,
    onTimeOptionChange,
    onWordOptionChange,
    onQuoteLengthChange,
    onPunctuationToggle,
    onNumbersToggle,
    onDifficultyToggle,
    onRestart: () => resetTest(),
  };
}
