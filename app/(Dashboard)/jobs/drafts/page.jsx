"use client";

import PageShell from "../../components/PageShell";

export default function JobDraftsPage() {
  return (
    <PageShell
      title="Job Drafts"
      description="Unpublished jobs saved as drafts before going live."
      plannedFeatures={[
        "Simple draft list with last edited date",
        "Resume editing and publish in one click",
        "Duplicate draft to new job",
      ]}
      actionHref="/jobs/new"
      actionLabel="Create Draft"
    />
  );
}
