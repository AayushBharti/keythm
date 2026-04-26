"use server";

import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { stats } from "@/lib/db/schema";

const KEY = "total_visits";
const COOKIE_NAME = "kz-visit";
const THROTTLE_SECONDS = 120;

// Cached read — revalidates every 300s
export const getVisitCount = unstable_cache(
  async () => {
    const row = await db.select().from(stats).where(eq(stats.key, KEY)).get();
    return row?.value ?? 0;
  },
  ["visit-count"],
  { revalidate: 300 }
);

// Server Action — called from client on mount
export async function recordVisit() {
  const cookieStore = await cookies();
  const visited = cookieStore.get(COOKIE_NAME);

  if (visited) {
    return;
  }

  cookieStore.set(COOKIE_NAME, "1", {
    maxAge: THROTTLE_SECONDS,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  await db
    .insert(stats)
    .values({ key: KEY, value: 1 })
    .onConflictDoUpdate({
      target: stats.key,
      set: { value: sql`${stats.value} + 1` },
    });
}
