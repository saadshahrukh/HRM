"use client";

import PageShell from "../../components/PageShell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LiveInterviewsPage() {
  return (
    <PageShell
      title="Live Now"
      description="Monitor ongoing Vapi voice interviews in real time. Admin can observe transcript stream without interfering."
      plannedFeatures={[
        "Live list with pulsing status indicator",
        "Real-time transcript viewer (privacy-safe, no raw audio for admin)",
        "Join as observer mode",
      ]}
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          No live sessions detected right now. Create and share an interview link to start.
        </p>
        <Button asChild>
          <Link href="/dashboard/create-interview">Create AI Interview</Link>
        </Button>
      </div>
    </PageShell>
  );
}
