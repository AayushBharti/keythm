"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppChrome } from "@/components/layout/app-chrome";
import { useSettings } from "@/components/settings/settings-provider";
import { TypingTest } from "@/components/typing/typing-test";
import { Keyboard } from "@/components/ui/keyboard";
import { cn } from "@/lib/utils";

export default function Page() {
  const { settingsOpen, setTypingActive, homeLogoHandlerRef } = useAppChrome();
  const [isFinished, setIsFinished] = useState(false);
  const [typingFocused, setTypingFocused] = useState(true);
  const [restartKey, setRestartKey] = useState(0);
  const { showKeyboard, soundEnabled, soundVolume, accent } = useSettings();

  useEffect(() => {
    homeLogoHandlerRef.current = () => {
      setIsFinished(false);
      setRestartKey((k) => k + 1);
    };
    return () => {
      homeLogoHandlerRef.current = null;
    };
  }, [homeLogoHandlerRef]);

  const handleTypingActiveChange = useCallback(
    (active: boolean) => {
      setTypingActive(active);
    },
    [setTypingActive]
  );

  const handleKeyHighlight = useCallback((_key: string | null) => {
    /* no-op */
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <main
        className={cn(
          "flex flex-col px-6",
          isFinished
            ? "flex-1 justify-center px-10 py-2"
            : "flex-1 items-center justify-center"
        )}
      >
        <TypingTest
          key={restartKey}
          onFinished={setIsFinished}
          onFocusChange={setTypingFocused}
          onKeyHighlight={handleKeyHighlight}
          onTypingActiveChange={handleTypingActiveChange}
          pauseTypingInputRefocus={settingsOpen}
        />
      </main>

      {!isFinished && (
        <footer
          className={cn(
            "hidden items-center justify-center lg:flex",
            showKeyboard
              ? "flex-col pb-4"
              : "invisible h-0 overflow-hidden border-0"
          )}
        >
          <div className="scale-[0.85]">
            <Keyboard
              enableHaptics
              enableSound={soundEnabled}
              forceActive={soundEnabled && !showKeyboard}
              physicalKeysEnabled={typingFocused}
              theme={accent}
              volume={soundVolume}
            />
          </div>
          <p className="text-muted-foreground/40 text-xs">
            Built by{" "}
            <a
              className="text-muted-foreground/60 underline-offset-2 hover:text-foreground hover:underline"
              href="https://aayushbharti.in"
              rel="noopener noreferrer"
              target="_blank"
            >
              Aayush Bharti
            </a>
            . The source code is available on{" "}
            <a
              className="text-muted-foreground/60 underline-offset-2 hover:text-foreground hover:underline"
              href="https://github.com/aayushbharti/keythm"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </p>
        </footer>
      )}
    </div>
  );
}
