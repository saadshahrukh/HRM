"use client";

import PageShell from "../../components/PageShell";

export default function CompanyProfileSettingsPage() {
  return (
    <PageShell
      title="Company Profile"
      description="Brand identity and default interview preferences for your organization."
      plannedFeatures={[
        "Logo and company details",
        "Default interview language and Vapi voice tone",
        "Careers page branding settings",
      ]}
    />
  );
}
