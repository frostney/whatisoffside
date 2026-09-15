import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Page not found",
    description: "This page could not be found.",
  },
  twitter: {
    card: "summary",
    title: "Page not found",
    description: "This page could not be found.",
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-semibold tracking-tight">
        404
      </p>
      <h1 className="text-xl font-medium">Page not found</h1>
      <p className="max-w-md text-[var(--text-subtle)] text-sm">
        This page could not be found.
      </p>
      <Link
        className="mt-2 text-sm font-medium underline underline-offset-4"
        href="/"
      >
        Back to What Is Offside?
      </Link>
    </main>
  );
}
