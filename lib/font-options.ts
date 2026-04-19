export type TypingFont =
  | "geist-mono"
  | "jetbrains-mono"
  | "fira-code"
  | "ibm-plex-mono"
  | "source-code-pro"
  | "inter-tight"
  | "space-grotesk"
  | "nunito"
  | "atkinson-hyperlegible";

export interface FontOption {
  cssFamily: string;
  googleFamily: string | null;
  id: TypingFont;
  label: string;
  tag?: "mono" | "sans";
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "geist-mono",
    label: "Geist Mono",
    googleFamily: null,
    cssFamily: "var(--font-mono)",
    tag: "mono",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    googleFamily: "JetBrains+Mono:wght@400;500;700",
    cssFamily: "'JetBrains Mono'",
    tag: "mono",
  },
  {
    id: "fira-code",
    label: "Fira Code",
    googleFamily: "Fira+Code:wght@400;500;700",
    cssFamily: "'Fira Code'",
    tag: "mono",
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    googleFamily: "IBM+Plex+Mono:wght@400;500;700",
    cssFamily: "'IBM Plex Mono'",
    tag: "mono",
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    googleFamily: "Source+Code+Pro:wght@400;500;700",
    cssFamily: "'Source Code Pro'",
    tag: "mono",
  },
  {
    id: "inter-tight",
    label: "Inter Tight",
    googleFamily: "Inter+Tight:wght@400;500;700",
    cssFamily: "'Inter Tight'",
    tag: "sans",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    googleFamily: "Space+Grotesk:wght@400;500;700",
    cssFamily: "'Space Grotesk'",
    tag: "sans",
  },
  {
    id: "nunito",
    label: "Nunito",
    googleFamily: "Nunito:wght@400;500;700",
    cssFamily: "'Nunito'",
    tag: "sans",
  },
  {
    id: "atkinson-hyperlegible",
    label: "Atkinson Hyperlegible",
    googleFamily: "Atkinson+Hyperlegible:wght@400;700",
    cssFamily: "'Atkinson Hyperlegible'",
    tag: "sans",
  },
];
