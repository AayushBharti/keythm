// -----------------------------------------------------------------------------
// Public types
// -----------------------------------------------------------------------------

export type KeyboardEventSource = "physical" | "pointer";
export type KeyboardEventPhase = "down" | "up";
export type KeyboardThemeName =
  | "classic"
  | "mint"
  | "royal"
  | "dolch"
  | "sand"
  | "scarlet";

export interface KeyboardInteractionEvent {
  code: string;
  phase: KeyboardEventPhase;
  source: KeyboardEventSource;
}

export interface KeyboardProps {
  className?: string;
  enableHaptics?: boolean;
  enableSound?: boolean;
  /** Keep key-event listeners active even when the keyboard is not intersecting the viewport */
  forceActive?: boolean;
  onKeyEvent?: (event: KeyboardInteractionEvent) => void;
  /** When false, physical key presses are ignored (use when the typing area is not focused) */
  physicalKeysEnabled?: boolean;
  soundUrl?: string;
  theme?: KeyboardThemeName;
  /** Volume 0–1, default 0.5 */
  volume?: number;
}

// -----------------------------------------------------------------------------
// Keyboard constants
// -----------------------------------------------------------------------------

export enum KEYCODE {
  Escape = "Escape",
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",
  F13 = "F13",
  Delete = "Delete",
  F14 = "F14",
  Backquote = "Backquote",
  Digit1 = "Digit1",
  Digit2 = "Digit2",
  Digit3 = "Digit3",
  Digit4 = "Digit4",
  Digit5 = "Digit5",
  Digit6 = "Digit6",
  Digit7 = "Digit7",
  Digit8 = "Digit8",
  Digit9 = "Digit9",
  Digit0 = "Digit0",
  Minus = "Minus",
  Equal = "Equal",
  Backspace = "Backspace",
  PageUp = "PageUp",
  Tab = "Tab",
  KeyQ = "KeyQ",
  KeyW = "KeyW",
  KeyE = "KeyE",
  KeyR = "KeyR",
  KeyT = "KeyT",
  KeyY = "KeyY",
  KeyU = "KeyU",
  KeyI = "KeyI",
  KeyO = "KeyO",
  KeyP = "KeyP",
  BracketLeft = "BracketLeft",
  BracketRight = "BracketRight",
  Backslash = "Backslash",
  PageDown = "PageDown",
  CapsLock = "CapsLock",
  KeyA = "KeyA",
  KeyS = "KeyS",
  KeyD = "KeyD",
  KeyF = "KeyF",
  KeyG = "KeyG",
  KeyH = "KeyH",
  KeyJ = "KeyJ",
  KeyK = "KeyK",
  KeyL = "KeyL",
  Semicolon = "Semicolon",
  Quote = "Quote",
  Enter = "Enter",
  Home = "Home",
  ShiftLeft = "ShiftLeft",
  KeyZ = "KeyZ",
  KeyX = "KeyX",
  KeyC = "KeyC",
  KeyV = "KeyV",
  KeyB = "KeyB",
  KeyN = "KeyN",
  KeyM = "KeyM",
  Comma = "Comma",
  Period = "Period",
  Slash = "Slash",
  ShiftRight = "ShiftRight",
  ArrowUp = "ArrowUp",
  End = "End",
  ControlLeft = "ControlLeft",
  AltLeft = "AltLeft",
  MetaLeft = "MetaLeft",
  Space = "Space",
  MetaRight = "MetaRight",
  Fn = "Fn",
  ControlRight = "ControlRight",
  ArrowLeft = "ArrowLeft",
  ArrowDown = "ArrowDown",
  ArrowRight = "ArrowRight",
  AltRight = "AltRight",
}

export type KeyVariantSlot = "accent" | "dark" | "light";

export interface KeyVariantDefinition {
  bg: string;
  text: string;
}

export interface KeyboardThemeDefinition {
  keyVariantOverrides: Partial<Record<KEYCODE, KeyVariantSlot>>;
  variants: Record<KeyVariantSlot, KeyVariantDefinition>;
}
