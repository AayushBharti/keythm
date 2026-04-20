"use client";

import {
  IconArrowNarrowLeft,
  IconBrightnessDown,
  IconBrightnessUp,
  IconBulb,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCommand,
  IconFrame,
  IconLayoutDashboard,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconSearch,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";
import { QWERTY_LAYOUT } from "@/lib/keyboard-layouts";
import { cn } from "@/lib/utils";

import { KeyboardProvider, useKeyboardContext } from "./context";
import { KEYBOARD_THEMES, resolveKeyVariant, toRgba } from "./themes";
import { KEYCODE, type KeyboardProps } from "./types";

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------

export function Keyboard({
  className,
  theme = "classic",
  enableSound = true,
  enableHaptics = true,
  soundUrl = "/sounds/sound.ogg",
  onKeyEvent,
  forceActive = false,
  physicalKeysEnabled = true,
  volume = 0.5,
}: KeyboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = QWERTY_LAYOUT;

  return (
    <KeyboardProvider
      containerRef={containerRef}
      enableHaptics={enableHaptics}
      enableSound={enableSound}
      forceActive={forceActive}
      layout={layout}
      onKeyEvent={onKeyEvent}
      physicalKeysEnabled={physicalKeysEnabled}
      soundUrl={soundUrl}
      theme={theme}
      volume={volume}
    >
      <div className={cn("inline-block", className)} ref={containerRef}>
        <KeyboardKeys />
      </div>
    </KeyboardProvider>
  );
}

export default Keyboard;

// -----------------------------------------------------------------------------
// UI rendering
// -----------------------------------------------------------------------------

function KeyboardKeys() {
  const { layout } = useKeyboardContext();

  /** Helper: resolve label for a key from the current layout, falling back to QWERTY. */
  function label(keyCode: string): [string, string?] | undefined {
    return layout[keyCode] ?? QWERTY_LAYOUT[keyCode];
  }

  return (
    <div>
      <div className="h-fit w-fit rounded-[16px] border-2 border-black bg-black/70 p-3 dark:border-white/20 dark:bg-white/20">
        <div className="h-[278px] rounded-[5px] rounded-t-[8px] border border-black bg-black/80 dark:border-zinc-500 dark:bg-zinc-700">
          <div className="-translate-y-1 -space-y-1 overflow-hidden rounded-[5px]">
            <Row>
              <Key keyCode={KEYCODE.Escape}>{"esc"}</Key>

              <Key keyCode={KEYCODE.F1}>
                <IconBrightnessDown className="size-[10px]" />
                <span>{"F1"}</span>
              </Key>
              <Key keyCode={KEYCODE.F2}>
                <IconBrightnessUp className="size-[10px]" />
                <span>{"F2"}</span>
              </Key>
              <Key keyCode={KEYCODE.F3}>
                <IconLayoutDashboard className="size-[10px]" />
                <span>{"F3"}</span>
              </Key>
              <Key keyCode={KEYCODE.F4}>
                <IconSearch className="size-[10px]" />
                <span>{"F4"}</span>
              </Key>

              <Key keyCode={KEYCODE.F5}>
                <IconMicrophone className="size-[10px]" />
                <span>{"F5"}</span>
              </Key>
              <Key keyCode={KEYCODE.F6}>
                <IconMoon className="size-[10px]" />
                <span>{"F6"}</span>
              </Key>
              <Key keyCode={KEYCODE.F7}>
                <IconPlayerTrackPrev className="size-[10px]" />
                <span>{"F7"}</span>
              </Key>
              <Key keyCode={KEYCODE.F8}>
                <IconPlayerSkipForward className="size-[10px]" />
                <span>{"F8"}</span>
              </Key>
              <Key keyCode={KEYCODE.F9}>
                <IconPlayerTrackNext className="size-[10px]" />
                <span>{"F9"}</span>
              </Key>

              <Key keyCode={KEYCODE.F10}>
                <IconVolume3 className="size-[10px]" />
                <span>{"F10"}</span>
              </Key>
              <Key keyCode={KEYCODE.F11}>
                <IconVolume2 className="size-[10px]" />
                <span>{"F11"}</span>
              </Key>
              <Key keyCode={KEYCODE.F12}>
                <IconVolume className="size-[10px]" />
                <span>{"F12"}</span>
              </Key>

              <Key keyCode={KEYCODE.F13}>
                <IconFrame className="size-[10px]" />
              </Key>
              <Key keyCode={KEYCODE.Delete}>{"del"}</Key>
              <Key keyCode={KEYCODE.F14}>
                <IconBulb className="size-[12px]" />
              </Key>
            </Row>

            <Row>
              <DualKey
                keyCode={KEYCODE.Backquote}
                labels={label("Backquote")}
              />

              <DualKey keyCode={KEYCODE.Digit1} labels={label("Digit1")} />
              <DualKey keyCode={KEYCODE.Digit2} labels={label("Digit2")} />
              <DualKey keyCode={KEYCODE.Digit3} labels={label("Digit3")} />
              <DualKey keyCode={KEYCODE.Digit4} labels={label("Digit4")} />

              <DualKey keyCode={KEYCODE.Digit5} labels={label("Digit5")} />
              <DualKey keyCode={KEYCODE.Digit6} labels={label("Digit6")} />
              <DualKey keyCode={KEYCODE.Digit7} labels={label("Digit7")} />
              <DualKey keyCode={KEYCODE.Digit8} labels={label("Digit8")} />
              <DualKey keyCode={KEYCODE.Digit9} labels={label("Digit9")} />

              <DualKey keyCode={KEYCODE.Digit0} labels={label("Digit0")} />
              <DualKey keyCode={KEYCODE.Minus} labels={label("Minus")} />
              <DualKey keyCode={KEYCODE.Equal} labels={label("Equal")} />

              <Key keyCode={KEYCODE.Backspace} width={100}>
                <IconArrowNarrowLeft className="size-[12px]" />
              </Key>
              <Key keyCode={KEYCODE.PageUp}>{"pgup"}</Key>
            </Row>

            <Row>
              <Key keyCode={KEYCODE.Tab} width={75}>
                {"tab"}
              </Key>

              <DualKey keyCode={KEYCODE.KeyQ} labels={label("KeyQ")} />
              <DualKey keyCode={KEYCODE.KeyW} labels={label("KeyW")} />
              <DualKey keyCode={KEYCODE.KeyE} labels={label("KeyE")} />
              <DualKey keyCode={KEYCODE.KeyR} labels={label("KeyR")} />

              <DualKey keyCode={KEYCODE.KeyT} labels={label("KeyT")} />
              <DualKey keyCode={KEYCODE.KeyY} labels={label("KeyY")} />
              <DualKey keyCode={KEYCODE.KeyU} labels={label("KeyU")} />
              <DualKey keyCode={KEYCODE.KeyI} labels={label("KeyI")} />
              <DualKey keyCode={KEYCODE.KeyO} labels={label("KeyO")} />
              <DualKey keyCode={KEYCODE.KeyP} labels={label("KeyP")} />

              <DualKey
                keyCode={KEYCODE.BracketLeft}
                labels={label("BracketLeft")}
              />
              <DualKey
                keyCode={KEYCODE.BracketRight}
                labels={label("BracketRight")}
              />

              <DualKey
                keyCode={KEYCODE.Backslash}
                labels={label("Backslash")}
                width={75}
              />
              <Key keyCode={KEYCODE.PageDown}>{"pgdn"}</Key>
            </Row>

            <Row>
              <Key keyCode={KEYCODE.CapsLock} width={100}>
                {"caps lock"}
              </Key>

              <DualKey keyCode={KEYCODE.KeyA} labels={label("KeyA")} />
              <DualKey keyCode={KEYCODE.KeyS} labels={label("KeyS")} />
              <DualKey keyCode={KEYCODE.KeyD} labels={label("KeyD")} />
              <DualKey keyCode={KEYCODE.KeyF} labels={label("KeyF")} />

              <DualKey keyCode={KEYCODE.KeyG} labels={label("KeyG")} />
              <DualKey keyCode={KEYCODE.KeyH} labels={label("KeyH")} />
              <DualKey keyCode={KEYCODE.KeyJ} labels={label("KeyJ")} />
              <DualKey keyCode={KEYCODE.KeyK} labels={label("KeyK")} />
              <DualKey keyCode={KEYCODE.KeyL} labels={label("KeyL")} />

              <DualKey
                keyCode={KEYCODE.Semicolon}
                labels={label("Semicolon")}
              />
              <DualKey keyCode={KEYCODE.Quote} labels={label("Quote")} />

              <Key keyCode={KEYCODE.Enter} width={100}>
                {"return"}
              </Key>
              <Key keyCode={KEYCODE.Home}>{"home"}</Key>
            </Row>

            <Row>
              <Key keyCode={KEYCODE.ShiftLeft} width={123}>
                {"shift"}
              </Key>

              <DualKey keyCode={KEYCODE.KeyZ} labels={label("KeyZ")} />
              <DualKey keyCode={KEYCODE.KeyX} labels={label("KeyX")} />
              <DualKey keyCode={KEYCODE.KeyC} labels={label("KeyC")} />
              <DualKey keyCode={KEYCODE.KeyV} labels={label("KeyV")} />

              <DualKey keyCode={KEYCODE.KeyB} labels={label("KeyB")} />
              <DualKey keyCode={KEYCODE.KeyN} labels={label("KeyN")} />
              <DualKey keyCode={KEYCODE.KeyM} labels={label("KeyM")} />

              <DualKey keyCode={KEYCODE.Comma} labels={label("Comma")} />
              <DualKey keyCode={KEYCODE.Period} labels={label("Period")} />
              <DualKey keyCode={KEYCODE.Slash} labels={label("Slash")} />

              <Key keyCode={KEYCODE.ShiftRight} width={77}>
                {"shift"}
              </Key>
              <Key keyCode={KEYCODE.ArrowUp}>
                <IconChevronUp className="size-[12px]" />
              </Key>
              <Key keyCode={KEYCODE.End}>{"end"}</Key>
            </Row>

            <Row>
              <Key keyCode={KEYCODE.ControlLeft} width={62}>
                {"ctrl"}
              </Key>
              <Key keyCode={KEYCODE.AltLeft} width={62}>
                {"option"}
              </Key>
              <Key keyCode={KEYCODE.MetaLeft} width={62}>
                <IconCommand className="size-[12px]" />
              </Key>

              <Key keyCode={KEYCODE.Space} width={314}>
                {/* <span className="text-[7px] tracking-widest opacity-50">
                  {"Built by Aayush Bharti"}
                </span> */}
              </Key>

              <Key keyCode={KEYCODE.MetaRight}>
                <IconCommand className="size-[12px]" />
              </Key>
              <Key keyCode={KEYCODE.Fn}>{"fn"}</Key>
              <Key keyCode={KEYCODE.ControlRight}>{"ctrl"}</Key>
              <Key keyCode={KEYCODE.ArrowLeft}>
                <IconChevronLeft className="size-[12px]" />
              </Key>
              <Key keyCode={KEYCODE.ArrowDown}>
                <IconChevronDown className="size-[12px]" />
              </Key>
              <Key keyCode={KEYCODE.ArrowRight}>
                <IconChevronRight className="size-[12px]" />
              </Key>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex">{children}</div>;
}

/** Renders a key with one or two labels (shift label on top, normal on bottom). */
function DualKey({
  keyCode,
  labels,
  width,
}: {
  keyCode: KEYCODE;
  labels?: [string, string?];
  width?: number;
}) {
  if (!labels) {
    return <Key keyCode={keyCode} width={width} />;
  }
  const [normal, shift] = labels;
  if (shift) {
    return (
      <Key keyCode={keyCode} width={width}>
        <span>{shift}</span>
        <span>{normal}</span>
      </Key>
    );
  }
  return (
    <Key keyCode={keyCode} width={width}>
      {normal}
    </Key>
  );
}

interface KeyProps {
  children?: ReactNode;
  className?: string;
  keyCode?: KEYCODE;
  width?: number;
}

function Key({ width = 50, children, className, keyCode }: KeyProps) {
  const { themeName, pressedKeys, pressKey, releaseKey, triggerPointerHaptic } =
    useKeyboardContext();
  const isPressed = keyCode ? pressedKeys.has(keyCode) : false;
  const pointerSessionActiveRef = useRef(false);
  const [isPointerDownVisual, setIsPointerDownVisual] = useState(false);
  const visuallyPressed = isPressed || isPointerDownVisual;
  const keyVariantSlot = resolveKeyVariant(themeName, keyCode);
  const keyVariant = KEYBOARD_THEMES[themeName].variants[keyVariantSlot];

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!keyCode || event.button !== 0) {
      return;
    }

    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures on browsers/platforms that do not support this path.
    }

    if (pressKey(keyCode, "pointer")) {
      pointerSessionActiveRef.current = true;
      setIsPointerDownVisual(true);
    }
  };

  const handlePointerRelease = () => {
    setIsPointerDownVisual(false);
    if (!(keyCode && pointerSessionActiveRef.current)) {
      return;
    }

    pointerSessionActiveRef.current = false;
    releaseKey(keyCode, "pointer");
  };

  return (
    <button
      aria-label={keyCode}
      className="flex cursor-pointer touch-none appearance-none items-end border-0 bg-transparent p-0 text-left focus:outline-none"
      onClick={triggerPointerHaptic}
      onPointerCancel={handlePointerRelease}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerRelease}
      style={{ height: 50, width }}
      type="button"
    >
      <div
        className={cn(
          "relative flex h-[50px] items-start justify-center overflow-hidden rounded-[4px] rounded-t-[12px] border border-black/40 transition-all duration-100",
          visuallyPressed && "h-[45px]"
        )}
        style={{
          width: `${width}px`,
          backgroundColor: toRgba(keyVariant.bg, 0.8),
        }}
      >
        <div
          className={cn(
            "relative z-10 h-[37px] rounded-[6px] border border-black/40 border-t-0 transition-all duration-100",
            "flex select-none flex-col items-center justify-between gap-0.5 p-1 font-medium text-[9px]",
            className
          )}
          style={{
            width: `${width - 13}px`,
            backgroundColor: keyVariant.bg,
            color: keyVariant.text,
          }}
        >
          {children}
        </div>

        <div
          className={cn(
            "absolute right-0 bottom-0 z-0 h-px w-8 translate-x-3.5 rotate-70 bg-black/30 transition-all duration-100",
            visuallyPressed && "rotate-60"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 z-0 h-px w-8 -translate-x-3.5 -rotate-70 bg-black/30 transition-all duration-100",
            visuallyPressed && "-rotate-60"
          )}
        />
      </div>
    </button>
  );
}
