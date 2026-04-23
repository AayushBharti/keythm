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
    syncKeythmFavicon();
  }, [mounted, resolvedTheme]);

  return null;
}
