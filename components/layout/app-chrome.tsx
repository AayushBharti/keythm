"use client";

import { GearSix, Command } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KeythmLogo } from "@/components/layout/keythm-logo";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { cn } from "@/lib/utils";

interface AppChromeContextValue {
  homeLogoHandlerRef: React.MutableRefObject<(() => void) | null>;
  setSettingsOpen: (open: boolean) => void;
  setTypingActive: (active: boolean) => void;
  settingsOpen: boolean;
  typingActive: boolean;
}

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function useAppChrome() {
  const ctx = useContext(AppChromeContext);
  if (!ctx) {
    throw new Error("useAppChrome must be used within AppChrome");
  }
  return ctx;
}

export function AppChrome({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [typingActive, setTypingActive] = useState(false);
  const homeLogoHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ignore */
      });
    }
  }, []);

  // ⌘K to toggle settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSettingsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      settingsOpen,
      setSettingsOpen,
      typingActive,
      setTypingActive,
      homeLogoHandlerRef,
    }),
    [settingsOpen, typingActive]
  );

  return (
    <AppChromeContext.Provider value={value}>
      <div className="flex min-h-dvh w-full flex-col">
        <SiteHeader />
        {children}
      </div>
      <SettingsPanel onOpenChange={setSettingsOpen} open={settingsOpen} />
    </AppChromeContext.Provider>
  );
}

function SiteHeader() {
  const router = useRouter();
  const { setSettingsOpen, typingActive, homeLogoHandlerRef } = useAppChrome();

  const dimHeader = typingActive;

  const [mouseHeaderVisible, setMouseHeaderVisible] = useState(false);
  const headerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const headerVisible = !typingActive || mouseHeaderVisible;

  useEffect(
    () => () => {
      if (headerTimerRef.current) {
        clearTimeout(headerTimerRef.current);
      }
    },
    []
  );

  const handleHeaderMouseMove = useCallback(() => {
    if (!typingActive) {
      return;
    }
    setMouseHeaderVisible(true);
    if (headerTimerRef.current) {
      clearTimeout(headerTimerRef.current);
    }
    headerTimerRef.current = setTimeout(
      () => setMouseHeaderVisible(false),
      2500
    );
  }, [typingActive]);

  function handleLogoClick() {
    if (homeLogoHandlerRef.current) {
      homeLogoHandlerRef.current();
      return;
    }
    router.push("/");
  }

  const headerOpacity = dimHeader ? (headerVisible ? 1 : 0.1) : 1;

  return (
    <motion.header
      animate={{ opacity: headerOpacity }}
      className="flex shrink-0 justify-center px-6 py-4 md:px-10 md:py-5"
      onMouseMove={handleHeaderMouseMove}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="relative flex w-full max-w-5xl items-center justify-between">
        {/* Left — Logo */}
        <button
          className="flex cursor-pointer items-end gap-1 font-semibold text-primary text-xl tracking-tight"
          onClick={handleLogoClick}
          type="button"
        >
          keythm
          <KeythmLogo className="mb-1" size={17} />
        </button>

        {/* Right — Settings */}
        <div className="flex items-center gap-2">
          <motion.button
            aria-label="Settings"
            className="flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.08] hover:text-foreground"
            onClick={() => setSettingsOpen(true)}
            type="button"
            whileTap={{ scale: 0.97 }}
          >
            <GearSix size={15} weight="duotone" />
            <span className="hidden sm:inline">Settings</span>
            <kbd className="hidden items-center gap-px rounded border border-foreground/10 bg-foreground/[0.04] px-1 py-0.5 text-[10px] text-muted-foreground/40 leading-none sm:inline-flex">
              <Command size={10} weight="duotone" />
              <span>K</span>
            </kbd>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
