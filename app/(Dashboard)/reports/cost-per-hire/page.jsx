"use client";

import PageShell from "../../components/PageShell";

export default function CostPerHireReportPage() {
  return (
    <PageShell
      title="Cost Per Hire"
      description="Track advertising spend, platform fees, and total cost per successful hire."
      plannedFeatures={[
        "Ad spend input per channel",
        "Auto cost-per-hire calculation",
        "Monthly budget vs actual chart",
      ]}
    />
  );
}
