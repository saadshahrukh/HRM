"use client";

import PageShell from "../../components/PageShell";

export default function TeamPerformanceReportPage() {
  return (
    <PageShell
      title="Team Performance"
      description="Recruiter-level productivity: interviews conducted, hires, and time-to-fill."
      plannedFeatures={[
        "Recruiter activity table",
        "Interviews vs hires conversion",
        "Team leaderboard and SLA tracking",
      ]}
    />
  );
}
