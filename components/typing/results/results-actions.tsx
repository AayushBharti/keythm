"use client";

import { DownloadSimple, Info } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ResultStats, WpmSnapshot } from "@/lib/types";

export const actionBtnClass =
  "flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-0 focus-visible:outline-none";

export function ResultsActionButton({
  onClick,
  label,
  icon,
  spinOnClick = false,
}: {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  spinOnClick?: boolean;
}) {
  const [spinning, setSpinning] = useState(false);

  function handleClick() {
    if (spinOnClick) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 600);
    }
    onClick();
  }

  return (
    <button className={actionBtnClass} onClick={handleClick} type="button">
      <span
        style={{
          display: "inline-flex",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

export function DownloadResultsPopover({ stats }: { stats: ResultStats }) {
  const downloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `typing-test-${new Date().toISOString()}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadCsv = () => {
    const headers = ["second", "wpm", "raw", "errors"];
    const rows = stats.wpmHistory.map((row) =>
      headers.map((header) => row[header as keyof WpmSnapshot] ?? 0).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `typing-test-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Popover>
      <PopoverTrigger className={actionBtnClass}>
        <DownloadSimple aria-hidden size={15} weight="duotone" />
        download
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-36 p-1"
        side="top"
        sideOffset={8}
      >
        <div className="flex flex-col gap-1">
          <button
            className="w-full rounded-md px-2 py-1.5 text-left text-foreground text-xs transition-colors hover:bg-muted"
            onClick={downloadJson}
          >
            JSON format
          </button>
          <button
            className="w-full rounded-md px-2 py-1.5 text-left text-foreground text-xs transition-colors hover:bg-muted"
            onClick={downloadCsv}
          >
            CSV format
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CalculationFormulaPopover() {
  return (
    <Popover>
      <PopoverTrigger className={actionBtnClass}>
        <Info aria-hidden size={15} weight="duotone" />
        formula
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-[min(20rem,calc(100vw-2rem))] p-4"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-4">
          <FormulaItem
            description="Only fully correct words and their spaces count. In time and zen modes, a correct prefix of the current word is included before you press space."
            formula="(correct chars + spaces) / 5 / minutes"
            label="WPM"
          />
          <div className="h-px bg-foreground/[0.06]" />
          <FormulaItem
            description="Every keystroke counts regardless of accuracy. Measures raw typing speed before error correction."
            formula="total keystrokes / 5 / minutes"
            label="Raw"
          />
          <div className="h-px bg-foreground/[0.06]" />
          <FormulaItem
            description="Character-level accuracy. Extra characters beyond the target word count as incorrect."
            formula="correct / (correct + incorrect) x 100"
            label="Accuracy"
          />
          <div className="h-px bg-foreground/[0.06]" />
          <FormulaItem
            description="Measures how steady your speed was. σ is standard deviation, μ is mean of per-second WPM. 100% means perfectly even pacing."
            formula="100 - (σ / μ x 100)"
            label="Consistency"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FormulaItem({
  label,
  formula,
  description,
}: {
  label: string;
  formula: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-medium text-[11px] text-foreground">{label}</p>
      <p className="rounded-md bg-foreground/[0.04] px-2.5 py-1.5 text-[11px] text-muted-foreground">
        {formula}
      </p>
      <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
