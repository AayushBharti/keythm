"use client";

import {
  Command,
  GearSix,
  GithubLogo,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
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
import { useSettings } from "@/components/settings/settings-provider";
import { DynamicFavicon } from "@/components/theme/dynamic-favicon";
import { VisitCount } from "@/components/visit-count";
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
      <DynamicFavicon />
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
  const { soundEnabled, setSoundEnabled } = useSettings();

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

        {/* Center — Visit counter (loads async, hidden until ready) */}
        <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
          <VisitCount />
        </div>

        {/* Right — Audio, Settings, GitHub */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <motion.button
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[13px] transition-colors duration-150",
              soundEnabled
                ? "text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
                : "text-muted-foreground/35 hover:bg-foreground/[0.06] hover:text-muted-foreground"
            )}
            onClick={() => setSoundEnabled(!soundEnabled)}
            type="button"
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex"
              initial={{ scale: 0.6, opacity: 0 }}
              key={String(soundEnabled)}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {soundEnabled ? (
                <SpeakerHigh size={15} weight="duotone" />
              ) : (
                <SpeakerSlash size={15} weight="duotone" />
              )}
            </motion.span>
            <span className="hidden sm:inline">Audio</span>
          </motion.button>

          {/* Settings */}
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

          {/* GitHub — primary pill */}
          <motion.a
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 font-medium text-[13px] text-background"
            href="https://github.com/aayushbharti/keythm"
            rel="noopener noreferrer"
            target="_blank"
            whileTap={{ scale: 0.96 }}
          >
            <GithubLogo size={15} weight="duotone" />
            <span className="hidden sm:inline">GitHub</span>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
