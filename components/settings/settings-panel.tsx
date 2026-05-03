"use client";

import { CaretRight, Command, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  FONT_OPTIONS,
  THEME_OPTIONS,
  useSettings,
} from "@/components/settings/settings-provider";
import { NextThemeSwitcher } from "@/components/theme/next-theme-switcher";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FontList } from "./font-picker";
import { ThemeGrid } from "./theme-picker";

/* ─── Main panel ─────────────────────────────────────────── */

interface SettingsPanelProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const {
    accent,
    setAccent,
    font,
    setFont,
    showKeyboard,
    setShowKeyboard,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    liveStats,
    setLiveStats,
    faahMode,
    setFaahMode,
    ghostMode,
    setGhostMode,
  } = useSettings();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const swipe = isMobile ? "down" : "right";
  const selectedFont = FONT_OPTIONS.find((f) => f.id === font);
  const selectedTheme = THEME_OPTIONS.find((c) => c.id === accent);

  const popupClass = cn(
    "h-full",
    isMobile
      ? "mx-3! mb-3! flex max-h-[90dvh] flex-col rounded-2xl! [--bleed:0px]"
      : "m-3! flex h-[calc(100%-1.5rem)]! flex-col rounded-2xl! [--bleed:0px]"
  );

  return (
    <Drawer onOpenChange={onOpenChange} open={open} swipeDirection={swipe}>
      <DrawerPopup className={popupClass}>
        <DrawerContent className="flex h-full flex-col">
          <SubDrawerHeader title="Settings" />

          <div className="mt-8 flex-1 space-y-6 overflow-y-auto">
            {/* ── Appearance ── */}
            <Section title="Appearance">
              <Row label="Mode">
                <NextThemeSwitcher />
              </Row>

              <SubDrawerRow
                label="Themes"
                popupClass={popupClass}
                preview={
                  <>
                    <span className="flex h-3.5 w-8 overflow-hidden rounded-full ring-1 ring-foreground/10">
                      {selectedTheme?.colors.map((c) => (
                        <span
                          className="flex-1"
                          key={c}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="text-[11px]">{selectedTheme?.label}</span>
                  </>
                }
                swipe={swipe}
              >
                <ThemeGrid active={accent} onSelect={setAccent} />
              </SubDrawerRow>

              <SubDrawerRow
                label="Font"
                popupClass={popupClass}
                preview={
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: selectedFont?.cssFamily }}
                  >
                    {selectedFont?.label ?? font}
                  </span>
                }
                swipe={swipe}
                title="Font"
              >
                <FontList active={font} onSelect={setFont} />
              </SubDrawerRow>
            </Section>

            {/* ── Keyboard ── */}
            <Section title="Keyboard">
              <Toggle
                description="Virtual keyboard below the test"
                disabledOnMobile="Not available on mobile"
                enabled={showKeyboard}
                label="Show keyboard"
                onToggle={() => setShowKeyboard(!showKeyboard)}
              />
              <Toggle
                description="Mechanical key sounds"
                disabledOnMobile="Not available on mobile"
                enabled={soundEnabled}
                label="Sound"
                onToggle={() => setSoundEnabled(!soundEnabled)}
              />
              {soundEnabled && (
                <VolumeSlider onChange={setSoundVolume} value={soundVolume} />
              )}
            </Section>

            {/* ── Gameplay ── */}
            <Section title="Gameplay">
              <Toggle
                description="Show WPM and accuracy while typing"
                enabled={liveStats}
                label="Live stats"
                onToggle={() => setLiveStats(!liveStats)}
              />
              <Toggle
                description="Dim upcoming words for focus"
                enabled={ghostMode}
                label="Ghost mode"
                onToggle={() => setGhostMode(!ghostMode)}
              />
              <Toggle
                description="Sound on wrong keystrokes"
                enabled={faahMode}
                label="Faah mode"
                onToggle={() => setFaahMode(!faahMode)}
              />
            </Section>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-center gap-1.5 pt-6 pb-2 text-[10px] text-muted-foreground/30">
            Press
            <kbd className="inline-flex items-center gap-px rounded border border-foreground/10 bg-foreground/[0.04] px-1 py-0.5 text-[10px] text-muted-foreground/40 leading-none">
              <Command size={10} weight="duotone" />
              <span>K</span>
            </kbd>
            to toggle settings
          </div>
        </DrawerContent>
      </DrawerPopup>
    </Drawer>
  );
}

/* ─── Shared sub-drawer header ───────────────────────────── */

function SubDrawerHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <DrawerTitle className="font-semibold text-foreground text-sm">
        {title}
      </DrawerTitle>
      <DrawerClose className="flex items-center justify-center rounded-full bg-foreground/[0.06] p-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
        <X size={14} />
        <span className="sr-only">Close</span>
      </DrawerClose>
    </div>
  );
}

/* ─── Sub-drawer row (reusable pattern) ──────────────────── */

function SubDrawerRow({
  label,
  preview,
  children,
  swipe,
  popupClass,
  title,
}: {
  label: string;
  preview: ReactNode;
  children: ReactNode;
  swipe: "down" | "right";
  popupClass: string;
  title?: string;
}) {
  return (
    <Drawer swipeDirection={swipe}>
      <DrawerTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.03]">
        <span className="text-foreground text-xs">{label}</span>
        <span className="flex items-center gap-2 text-muted-foreground text-xs transition-colors group-hover:text-foreground">
          {preview}
          <CaretRight
            className="text-muted-foreground/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground"
            size={12}
          />
        </span>
      </DrawerTrigger>
      <DrawerPopup className={popupClass}>
        <SubDrawerHeader title={title ?? label} />
        <div className="mt-6 flex-1 overflow-y-auto">{children}</div>
      </DrawerPopup>
    </Drawer>
  );
}

/* ─── Primitives ─────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <p className="mb-2 font-semibold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-foreground/[0.03]">
      <span className="text-foreground text-xs">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  enabled,
  onToggle,
  disabledOnMobile,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  disabledOnMobile?: string;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const disabled = !!disabledOnMobile && isMobile;

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-foreground/[0.03]"
      )}
      disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      title={disabled ? disabledOnMobile : undefined}
      type="button"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-xs">{label}</span>
        {description && (
          <span className="text-[10px] text-muted-foreground/60 leading-tight">
            {description}
          </span>
        )}
      </div>
      <div
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          disabled && "bg-muted",
          !disabled && enabled && "bg-primary",
          !(disabled || enabled) && "bg-foreground/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 dark:bg-foreground",
            !disabled && enabled && "translate-x-4"
          )}
        />
      </div>
    </button>
  );
}

function VolumeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Slider
        max={100}
        min={0}
        onValueChange={(v) => {
          const arr = Array.isArray(v) ? v : [v];
          onChange(arr[0] / 100);
        }}
        step={5}
        value={[value * 100]}
      />
      <span className="w-8 text-right font-medium text-[11px] text-muted-foreground tabular-nums">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}
