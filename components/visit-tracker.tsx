"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/db/visits";

export function VisitTracker() {
  useEffect(() => {
    recordVisit();
  }, []);
  return null;
}
