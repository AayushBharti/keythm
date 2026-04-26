"use client";

import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { getVisitCount } from "@/lib/db/visits";

export function VisitCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getVisitCount().then(setCount).catch(console.error);
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <span className="text-muted-foreground/60 text-xs">
      <AnimatedNumber
        className="font-medium text-muted-foreground tabular-nums"
        value={count}
      />{" "}
      thocks and counting
    </span>
  );
}
