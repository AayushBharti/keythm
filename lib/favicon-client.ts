function buildFaviconHref(
  accent: string,
  kbDark: string,
  kbLight: string,
  plate: string
): string {
  const a = accent.replace(/"/g, "'");
  const d = kbDark.replace(/"/g, "'");
  const l = kbLight.replace(/"/g, "'");
  const pl = plate.replace(/"/g, "'");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">` +
    // outer shadow
    `<rect x="1" y="3" width="30" height="28" rx="5" fill="#000" fill-opacity="0.12"/>` +
    // housing plate
    `<rect x="1" y="1" width="30" height="28" rx="5" fill="${pl}"/>` +
    // keycap faces: accent / light / light / dark
    `<rect x="3" y="3" width="12" height="10.5" rx="2.5" fill="${a}"/>` +
    `<rect x="17" y="3" width="12" height="10.5" rx="2.5" fill="${l}"/>` +
    `<rect x="3" y="15.5" width="12" height="10.5" rx="2.5" fill="${l}"/>` +
    `<rect x="17" y="15.5" width="12" height="10.5" rx="2.5" fill="${d}"/>` +
    // specular highlights
    `<rect x="4.5" y="3.5" width="9" height="3" rx="1.5" fill="#fff" fill-opacity="0.28"/>` +
    `<rect x="18.5" y="3.5" width="9" height="3" rx="1.5" fill="#fff" fill-opacity="0.2"/>` +
    `<rect x="4.5" y="16" width="9" height="3" rx="1.5" fill="#fff" fill-opacity="0.2"/>` +
    `<rect x="18.5" y="16" width="9" height="3" rx="1.5" fill="#fff" fill-opacity="0.12"/>` +
    `</svg>`;

  return `data:image/svg+xml;base64,${globalThis.btoa(svg)}`;
}

/** Resolve a CSS custom property to a computed rgb/rgba string. */
function resolveColor(
  probe: HTMLElement,
  value: string
): string | null {
  probe.style.backgroundColor = value;
  // Force style recalc by reading the computed value
  const resolved = getComputedStyle(probe).backgroundColor;
  return resolved && resolved !== "rgba(0, 0, 0, 0)" ? resolved : null;
}

function readThemeColors(): {
  accent: string;
  kbDark: string;
  kbLight: string;
  plate: string;
} | null {
  if (typeof document === "undefined" || !document.body) {
    return null;
  }

  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none";
  document.body.appendChild(probe);

  const accent = resolveColor(probe, "var(--primary)");
  const kbDark = resolveColor(probe, "var(--kb-dark, var(--muted-foreground))");
  const kbLight = resolveColor(probe, "var(--kb-light, var(--secondary))");
  const background = resolveColor(probe, "var(--background)");

  probe.remove();

  if (!accent || !background) {
    return null;
  }

  return {
    accent,
    kbDark: kbDark ?? accent,
    kbLight: kbLight ?? background,
    plate: darken(background),
  };
}

/** Darken an rgb/rgba color for the housing plate. */
function darken(rgb: string): string {
  const m = rgb.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
  );
  if (!m) {
    return rgb;
  }
  const r = Math.max(0, Math.round(Number(m[1]) * 0.72));
  const g = Math.max(0, Math.round(Number(m[2]) * 0.72));
  const b = Math.max(0, Math.round(Number(m[3]) * 0.72));
  return `rgb(${r},${g},${b})`;
}

export function syncKeythmFavicon() {
  if (typeof document === "undefined") {
    return;
  }

  const colors = readThemeColors();
  if (!colors) {
    return;
  }

  const href = buildFaviconHref(
    colors.accent,
    colors.kbDark,
    colors.kbLight,
    colors.plate
  );

  const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]'] as const;
  let touched = false;
  for (const sel of selectors) {
    document.querySelectorAll<HTMLLinkElement>(sel).forEach((link) => {
      link.type = "image/svg+xml";
      link.href = href;
      touched = true;
    });
  }

  if (!touched) {
    const link = document.createElement("link");
    link.id = "keythm-favicon";
    link.rel = "shortcut icon";
    link.type = "image/svg+xml";
    link.href = href;
    document.head.prepend(link);
  }
}
