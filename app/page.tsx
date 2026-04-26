"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppChrome } from "@/components/layout/app-chrome";
import { TypingTest } from "@/components/typing/typing-test";
import { cn } from "@/lib/utils";

export default function Page() {
  const { settingsOpen, setTypingActive, homeLogoHandlerRef } = useAppChrome();
  const [isFinished, setIsFinished] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

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
          onTypingActiveChange={handleTypingActiveChange}
          pauseTypingInputRefocus={settingsOpen}
        />
      </main>
    </div>
  );
}
