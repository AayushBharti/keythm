import {
  KEYCODE,
  type KeyboardThemeDefinition,
  type KeyboardThemeName,
  type KeyVariantSlot,
} from "./types";

export const DEFAULT_KEY_VARIANT_SLOT: KeyVariantSlot = "light";

export const CLASSIC_DARK_KEYS: KEYCODE[] = [
  KEYCODE.F5,
  KEYCODE.F6,
  KEYCODE.F7,
  KEYCODE.F8,
  KEYCODE.F9,
  KEYCODE.F13,
  KEYCODE.Delete,
  KEYCODE.F14,
  KEYCODE.Backspace,
  KEYCODE.PageUp,
  KEYCODE.Tab,
  KEYCODE.Backslash,
  KEYCODE.PageDown,
  KEYCODE.CapsLock,
  KEYCODE.Enter,
  KEYCODE.Home,
  KEYCODE.ShiftLeft,
  KEYCODE.ShiftRight,
  KEYCODE.End,
  KEYCODE.ControlLeft,
  KEYCODE.AltLeft,
  KEYCODE.MetaLeft,
  KEYCODE.MetaRight,
  KEYCODE.Fn,
  KEYCODE.ControlRight,
];

export const MINT_DARK_KEYS: KEYCODE[] = [
  KEYCODE.F5,
  KEYCODE.F6,
  KEYCODE.F7,
  KEYCODE.F8,
  KEYCODE.F9,
  KEYCODE.F13,
  KEYCODE.Delete,
  KEYCODE.F14,
  KEYCODE.Backspace,
  KEYCODE.PageUp,
  KEYCODE.Tab,
  KEYCODE.PageDown,
  KEYCODE.CapsLock,
  KEYCODE.Home,
  KEYCODE.ShiftLeft,
  KEYCODE.ShiftRight,
  KEYCODE.End,
  KEYCODE.ControlLeft,
  KEYCODE.AltLeft,
  KEYCODE.MetaLeft,
  KEYCODE.MetaRight,
  KEYCODE.Fn,
  KEYCODE.ControlRight,
];

// DEFINE YOUR CUSTOM THEMES HERE
export const KEYBOARD_THEMES: Record<
  KeyboardThemeName,
  KeyboardThemeDefinition
> = {
  classic: {
    variants: {
      accent: { bg: "#F57644", text: "rgba(0,0,0,0.5)" },
      dark: { bg: "#737373", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#F5F5F5", text: "rgba(0,0,0,0.7)" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [KEYCODE.Escape],
      dark: CLASSIC_DARK_KEYS,
    }),
  },
  mint: {
    variants: {
      accent: { bg: "#86C8AC", text: "rgba(255,255,255,0.7)" },
      dark: { bg: "#447B82", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#EEEEEE", text: "#447B82" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [
        KEYCODE.Escape,
        KEYCODE.Enter,
        KEYCODE.ArrowLeft,
        KEYCODE.ArrowRight,
        KEYCODE.ArrowUp,
        KEYCODE.ArrowDown,
      ],
      dark: MINT_DARK_KEYS,
    }),
  },
  royal: {
    variants: {
      accent: { bg: "#E4D440", text: "rgba(0,0,0,0.7)" },
      dark: { bg: "#3A3B35", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#324974", text: "rgba(255,255,255,0.7)" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [
        KEYCODE.Escape,
        KEYCODE.Enter,
        KEYCODE.ArrowLeft,
        KEYCODE.ArrowRight,
        KEYCODE.ArrowUp,
        KEYCODE.ArrowDown,
      ],
      dark: MINT_DARK_KEYS,
    }),
  },
  dolch: {
    variants: {
      accent: { bg: "#D73E42", text: "rgba(0,0,0,0.7)" },
      dark: { bg: "#3E3B4C", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#4F5E78", text: "rgba(255,255,255,0.7)" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [KEYCODE.Escape, KEYCODE.Enter, KEYCODE.Space],
      dark: [...MINT_DARK_KEYS, KEYCODE.Backquote, KEYCODE.Backslash],
    }),
  },
  sand: {
    variants: {
      accent: { bg: "#C94E41", text: "rgba(255,255,255,0.7)" },
      dark: { bg: "#893D36", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#EFEFEF", text: "rgba(0,0,0,0.7)" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [KEYCODE.Escape, KEYCODE.Enter],
      dark: MINT_DARK_KEYS,
    }),
  },
  scarlet: {
    variants: {
      accent: { bg: "#E1E1E1", text: "#8F4246" },
      dark: { bg: "#D5868A", text: "rgba(255,255,255,0.7)" },
      light: { bg: "#E4D7D7", text: "#8F4246" },
    },
    keyVariantOverrides: buildKeyVariantOverrides({
      accent: [KEYCODE.Escape, KEYCODE.Enter],
      dark: MINT_DARK_KEYS,
    }),
  },
};

export function buildKeyVariantOverrides({
  accent = [],
  dark = [],
  light = [],
}: {
  accent?: KEYCODE[];
  dark?: KEYCODE[];
  light?: KEYCODE[];
}): Partial<Record<KEYCODE, KeyVariantSlot>> {
  const entries: Array<[KEYCODE, KeyVariantSlot]> = [];

  for (const keyCode of accent) {
    entries.push([keyCode, "accent"]);
  }
  for (const keyCode of dark) {
    entries.push([keyCode, "dark"]);
  }
  for (const keyCode of light) {
    entries.push([keyCode, "light"]);
  }

  return Object.fromEntries(entries) as Partial<
    Record<KEYCODE, KeyVariantSlot>
  >;
}

export function resolveKeyVariant(
  themeName: KeyboardThemeName,
  keyCode?: KEYCODE
): KeyVariantSlot {
  if (!keyCode) {
    return DEFAULT_KEY_VARIANT_SLOT;
  }
  return (
    KEYBOARD_THEMES[themeName].keyVariantOverrides[keyCode] ??
    DEFAULT_KEY_VARIANT_SLOT
  );
}

export function toRgba(color: string, alpha: number): string {
  if (!color.startsWith("#")) {
    return color;
  }

  const value = color.slice(1);
  const hex =
    value.length === 3
      ? value
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : value;

  if (hex.length !== 6) {
    return color;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
