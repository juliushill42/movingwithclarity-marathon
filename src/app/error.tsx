"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page" style={{ fontFamily: "ui-monospace, monospace", padding: 24 }}>
      <p className="mark">MOVING WITH CLARITY</p>
      <h1>Floor fault.</h1>
      <p>The 3D layer failed on this device. The ledger still works.</p>
      <p>
        <Link href="/ledger">Open the 193-system ledger</Link>
        {" · "}
        <Link href="/godmode">/godmode</Link>
        {" · "}
        <button type="button" onClick={() => reset()}>
          retry floor
        </button>
      </p>
    </main>
  );
}
