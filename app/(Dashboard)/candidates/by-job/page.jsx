"use client";

import PageShell from "../../components/PageShell";

export default function CandidatesByJobPage() {
  return (
    <PageShell
      title="Candidates by Job"
      description="Select a job and view only candidates who applied to that role."
      plannedFeatures={[
        "Job dropdown filter",
        "Per-job funnel counts (New, Screening, Interview, Offer)",
        "Bulk actions: schedule interview, reject, move stage",
      ]}
    />
  );
}
