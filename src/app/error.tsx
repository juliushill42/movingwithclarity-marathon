"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page">
      <p className="mark">MOVING WITH CLARITY</p>
      <h1>This page hit a snag.</h1>
      <p>The list of 193 systems still works.</p>
      <p>
        <Link href="/ledger">Open the list</Link>
        {" · "}
        <button type="button" onClick={() => reset()}>
          Try again
        </button>
      </p>
    </main>
  );
}
