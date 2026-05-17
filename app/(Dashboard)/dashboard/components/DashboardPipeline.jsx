"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stages = [
  { label: "Screening", count: 0, color: "bg-blue-500" },
  { label: "Interview", count: 0, color: "bg-violet-500" },
  { label: "Offer", count: 0, color: "bg-amber-500" },
  { label: "Hired", count: 0, color: "bg-emerald-500" },
];

export default function DashboardPipeline() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Hiring Pipeline</h2>
          <p className="text-sm text-muted-foreground">Candidate flow across stages</p>
        </div>
        <Link
          href="/reports/pipeline"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Full report <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stages.map((stage) => (
          <li key={stage.label} className="rounded-xl border border-border bg-background p-4 list-none">
            <span className={`mb-3 block h-1.5 w-full rounded-full ${stage.color} opacity-80`} />
            <p className="text-2xl font-bold text-foreground">{stage.count}</p>
            <p className="text-sm text-muted-foreground">{stage.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
