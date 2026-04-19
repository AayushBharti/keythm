// Pre-fetch and cache the sound sprite as early as possible.
// This runs at import time (module evaluation), before any component mounts.
// The <link rel="preload"> in layout.tsx ensures the browser has already
// started fetching by the time this module evaluates.

const SOUND_URL = "/sounds/sound.ogg";

let cachedBuffer: ArrayBuffer | null = null;
let fetchPromise: Promise<ArrayBuffer | null> | null = null;

function startFetch(): Promise<ArrayBuffer | null> {
  if (fetchPromise) {
    return fetchPromise;
  }
  fetchPromise = fetch(SOUND_URL)
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .then((ab) => {
      cachedBuffer = ab;
      return ab;
    })
    .catch(() => null);
  return fetchPromise;
}

// Start immediately on import
if (typeof window !== "undefined") {
  startFetch();
}

export function getSoundBuffer(): Promise<ArrayBuffer | null> {
  if (cachedBuffer) {
    return Promise.resolve(cachedBuffer);
  }
  return startFetch();
}
