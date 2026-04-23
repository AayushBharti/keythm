"use client";

import { Monitor, Moon, Sun } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export interface ThemeSwitcherProps {
  className?: string;
  defaultValue?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  value?: "light" | "dark" | "system";
}

export function ThemeSwitcher({
  value,
  onChange,
  defaultValue = "system",
  className,
}: ThemeSwitcherProps) {
  const [internal, setInternal] = useState(defaultValue);
  const theme = value ?? internal;
  const setTheme = useCallback(
    (next: "light" | "dark" | "system") => {
      setInternal(next);
      onChange?.(next);
    },
    [onChange]
  );
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-8 rounded-full border border-foreground/10 bg-foreground/[0.06] p-1",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-foreground/10"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
              size={16}
              weight="duotone"
            />
          </button>
        );
      })}
    </div>
  );
}
