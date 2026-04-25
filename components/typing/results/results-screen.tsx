"use client";

import {
  ArrowCounterClockwise,
  ArrowRight,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { ResultStats } from "@/lib/types";
import { isInvalidTestResult } from "@/lib/validate-result";
import {
  CalculationFormulaPopover,
  DownloadResultsPopover,
  ResultsActionButton,
} from "./results-actions";
import { DetailStat, KeyStat } from "./stats-display";
import { WpmChart } from "./wpm-chart";

interface ResultsScreenProps {
  onNext: () => void;
  onRestart: () => void;
  stats: ResultStats;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

export function ResultsScreen({
  stats,
  onRestart,
  onNext,
}: ResultsScreenProps) {
  const {
    wpm,
    accuracy,
    raw,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    consistency,
    elapsedSeconds,
    correctedErrors,
    mode,
    modeDetail,
    wpmHistory,
  } = stats;

  const invalid = isInvalidTestResult(stats);

  if (invalid) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        className="flex w-full flex-col gap-8 md:mx-auto md:max-w-5xl"
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex flex-col items-center gap-3 px-2 text-center">
          <p className="font-bold text-3xl text-muted-foreground md:text-4xl">
            invalid result
          </p>
          <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
            No keystrokes were recorded, so scores can&apos;t be calculated.
            This often happens if the timer ran out before you typed, you left
            focus, or the test ended right after it started.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            {mode} {modeDetail}
            {elapsedSeconds > 0 ? ` · ${elapsedSeconds}s` : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-border border-t pt-6 pb-2">
          <ResultsActionButton
            icon={<ArrowRight aria-hidden size={16} />}
            label="next test"
            onClick={onNext}
          />
          <ResultsActionButton
            icon={<ArrowCounterClockwise aria-hidden size={16} />}
            label="restart"
            onClick={onRestart}
            spinOnClick
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 md:mx-auto md:max-w-5xl md:gap-6">
      {/* ── Hero: WPM + Accuracy — the star moment ── */}
      <div className="flex items-end justify-center gap-5 pt-2 sm:gap-8 md:gap-12">
        {/* WPM */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease }}
          >
            <AnimatedNumber
              className="font-bold font-mono text-5xl text-primary leading-none sm:text-7xl md:text-9xl"
              value={wpm}
            />
          </motion.div>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-muted-foreground uppercase tracking-widest sm:text-xs"
            initial={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.2, duration: 0.35, ease }}
          >
            wpm
          </motion.span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="font-bold font-mono text-5xl leading-none sm:text-7xl md:text-9xl"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            transition={{ delay: 0.08, duration: 0.6, ease }}
          >
            <AnimatedNumber className="text-foreground" value={accuracy} />
            <span className="text-muted-foreground/50">%</span>
          </motion.div>
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-muted-foreground uppercase tracking-widest sm:text-xs"
            initial={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.28, duration: 0.35, ease }}
          >
            accuracy
          </motion.span>
        </div>
      </div>

      {/* ── Key stats — each cascades in individually ── */}
      <div className="flex items-center justify-center gap-8 md:gap-12">
        <motion.div
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          transition={{ delay: 0.35, duration: 0.4, ease }}
        >
          <KeyStat animated label="raw" value={raw} />
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scaleY: 1 }}
          className="h-6 w-px bg-border"
          initial={{ opacity: 0, scaleY: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease }}
        />

        <motion.div
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          transition={{ delay: 0.45, duration: 0.4, ease }}
        >
          <KeyStat
            animated
            label="consistency"
            suffix="%"
            value={consistency}
          />
        </motion.div>
      </div>

      {/* ── Chart — clips open from top ── */}
      <motion.div
        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        className="h-[180px] w-full md:h-[200px]"
        initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
        transition={{ delay: 0.55, duration: 0.6, ease }}
      >
        {wpmHistory.length > 1 ? (
          <WpmChart history={wpmHistory} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/50 text-xs">
            not enough data
          </div>
        )}
      </motion.div>

      {/* ── Divider — draws from center ── */}
      <motion.div
        animate={{ scaleX: 1, opacity: 1 }}
        className="mx-auto h-px w-full max-w-5xl bg-border/50"
        initial={{ scaleX: 0, opacity: 0 }}
        style={{ originX: 0.5 }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
      />

      {/* ── Detail stats ── */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        transition={{ delay: 0.8, duration: 0.4, ease }}
      >
        <DetailStat
          label="characters"
          value={`${correctChars}/${incorrectChars}/${extraChars}/${missedChars}`}
        />
        <DetailStat label="time" value={`${elapsedSeconds}s`} />
        <DetailStat label="fixes" value={correctedErrors} />
        <DetailStat accent label="test" value={`${mode} ${modeDetail}`} />
      </motion.div>

      {/* ── Actions — spring up individually ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-2">
        {[
          <ResultsActionButton
            icon={<ArrowRight aria-hidden size={16} />}
            key="next"
            label="next test"
            onClick={onNext}
          />,
          <ResultsActionButton
            icon={<ArrowCounterClockwise aria-hidden size={16} />}
            key="restart"
            label="restart"
            onClick={onRestart}
            spinOnClick
          />,
          <DownloadResultsPopover key="download" stats={stats} />,
          <CalculationFormulaPopover key="formula" />,
        ].map((child, i) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            // biome-ignore lint: index is stable for static array
            key={i}
            transition={{
              delay: 0.9 + i * 0.06,
              type: "spring",
              stiffness: 250,
              damping: 22,
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
