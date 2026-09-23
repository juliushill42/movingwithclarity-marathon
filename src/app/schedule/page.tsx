"use client";
import Link from "next/link";
import { dayOfRun } from "@/lib/catalog";
import { schedule, todayPlan } from "@/lib/schedule";

export default function SchedulePage() {
  const days = schedule();
  const today = todayPlan();
  const current = dayOfRun();
  return (
    <>
      <div className="poster" />
      <main className="page">
        <p className="mark">MOVING WITH CLARITY</p>
        <h1>21-day schedule</h1>
        <p className="muted">September 22 to October 12, 2026. Today is day {current}: {today.label}.</p>
        <p>
          <Link href="/">Home</Link> · <Link href="/ledger">The 193 systems</Link>
        </p>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Focus</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.day} style={d.day === current ? { outline: "1px solid #7ee0e8" } : undefined}>
                <td>{d.day}</td>
                <td>{d.date}</td>
                <td>
                  <b>{d.label}.</b> {d.focus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
