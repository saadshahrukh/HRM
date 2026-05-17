"use client";

import PageShell from "../../components/PageShell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HiringPipelineReportPage() {
  return (
    <PageShell
      title="Hiring Pipeline"
      description="Funnel analytics from Applied to Hired with average days in each stage."
      plannedFeatures={[
        "Funnel: Applied → Screened → Interviewed → Offered → Hired",
        "Average time-in-stage metrics",
        "Export PDF / CSV",
      ]}
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Basic analytics are available on Dashboard today. Advanced pipeline reporting is next.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Open Dashboard Analytics</Link>
        </Button>
      </div>
    </PageShell>
  );
}
