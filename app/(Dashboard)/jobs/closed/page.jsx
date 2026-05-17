"use client";

import PageShell from "../../components/PageShell";

export default function ClosedJobsPage() {
  return (
    <PageShell
      title="Closed Jobs"
      description="Archived positions with hiring outcomes and historical candidate data."
      plannedFeatures={[
        "Closed job archive with close date and final hire count",
        "Reopen job option",
        "Export job hiring summary",
      ]}
    />
  );
}
