"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { syncKeythmFavicon } from "@/lib/favicon-client";

export function DynamicFavicon() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const run = () => {
      syncKeythmFavicon();
      requestAnimationFrame(() => syncKeythmFavicon());
    };

    run();

    const t1 = window.setTimeout(run, 0);
    const t2 = window.setTimeout(run, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted, resolvedTheme]);

  return null;
}
