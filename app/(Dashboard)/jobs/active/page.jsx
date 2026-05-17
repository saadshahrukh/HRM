"use client";

import PageShell from "../../components/PageShell";

export default function ActiveJobsPage() {
  return (
    <PageShell
      title="Active Jobs"
      description="Live job postings with candidate counts, interview stages, and quick actions (View, Edit, Close, Copy Link)."
      plannedFeatures={[
        "Table: Job Title, Department, Posting Date, Candidates, Stage breakdown",
        "Post New Job CTA with AI job description generator",
        "Unique public application link per job",
      ]}
      actionHref="/jobs/new"
      actionLabel="Post New Job"
    />
  );
}
