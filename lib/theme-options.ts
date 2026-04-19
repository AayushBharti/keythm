import type { KeyboardThemeName } from "@/components/ui/keyboard";

export const THEME_OPTIONS: {
  id: KeyboardThemeName;
  label: string;
  colors: [string, string, string]; // [light, dark, accent]
}[] = [
  {
    id: "classic",
    label: "Classic",
    colors: ["#F5F5F5", "#737373", "#F57644"],
  },
  { id: "mint", label: "Mint", colors: ["#EEEEEE", "#447B82", "#86C8AC"] },
  { id: "royal", label: "Royal", colors: ["#324974", "#3A3B35", "#E4D440"] },
  { id: "dolch", label: "Dolch", colors: ["#4F5E78", "#3E3B4C", "#D73E42"] },
  { id: "sand", label: "Sand", colors: ["#EFEFEF", "#893D36", "#C94E41"] },
  {
    id: "scarlet",
    label: "Scarlet",
    colors: ["#E4D7D7", "#D5868A", "#E1E1E1"],
  },
];
