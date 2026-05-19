import React from "react";
import { ModernSpinner } from "@/components/global_components/ModernSpinner";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-12">
      <ModernSpinner size="xl" text="Loading dashboard data..." />
    </div>
  );
}
