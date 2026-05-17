"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

const placeholderItems = [
  "Candidate completed AI interview — feedback ready to review",
  "New interview session created via Vapi",
  "Recruiter shared interview link with candidate",
];

export default function DashboardActivity() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Live hiring events across your workspace</p>
        </div>
      </header>

      <ul className="space-y-3">
        {placeholderItems.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Full activity timeline will appear here. For now, open{" "}
        <Link href="/interviews/completed" className="text-primary hover:underline">
          completed interviews
        </Link>
        .
      </p>
    </section>
  );
}
