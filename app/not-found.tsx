import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Keythm",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="font-bold font-mono text-8xl text-primary sm:text-9xl">
          404
        </span>

        <p className="mt-4 text-muted-foreground text-sm">
          Looks like you mistyped the URL.
          <br />
          Even the best typists miss sometimes.
        </p>

        <Link
          className="mt-6 rounded-full bg-foreground px-5 py-2 font-medium text-background text-xs transition-opacity hover:opacity-90"
          href="/"
        >
          Back to typing
        </Link>
      </div>
    </main>
  );
}
