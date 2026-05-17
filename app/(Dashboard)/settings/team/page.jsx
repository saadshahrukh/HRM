"use client";

import PageShell from "../../components/PageShell";

export default function TeamRolesSettingsPage() {
  return (
    <PageShell
      title="Team & Roles"
      description="Invite recruiters and hiring managers, assign roles, and control permissions per job."
      plannedFeatures={[
        "Invite by email",
        "Roles: Recruiter, Hiring Manager, Admin",
        "Permission matrix (create interviews, view salary, etc.)",
      ]}
    />
  );
}
