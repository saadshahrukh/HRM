"use client";

import PageShell from "../../components/PageShell";

export default function NewJobPage() {
  return (
    <PageShell
      title="Post New Job"
      description="AI-assisted job creation: title, department, location, then auto-generated description with editable skills and salary band."
      plannedFeatures={[
        "Step 1: Job Title, Department, Location, Employment Type",
        "Step 2: AI-generated job description (editable)",
        "Publish to generate public application link",
      ]}
    />
  );
}
