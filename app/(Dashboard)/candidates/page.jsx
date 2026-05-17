"use client";

import PageShell from "../components/PageShell";

export default function AllCandidatesPage() {
  return (
    <PageShell
      title="All Candidates"
      description="Central candidate table with AI match score, status, and drill-down to AI summary profile."
      plannedFeatures={[
        "Columns: Name, Job Applied, AI Score %, Experience, Status, Applied Date",
        "Filters and sorting by score, stage, and date",
        "Candidate detail: CV viewer + AI extracted skills and insights",
      ]}
      actionHref="/interviews/completed"
      actionLabel="View Completed Interviews"
    />
  );
}
