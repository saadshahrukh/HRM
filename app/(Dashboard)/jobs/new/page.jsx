"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/create-interview");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <p className="text-gray-400">Redirecting to Job creation...</p>
    </div>
  );
}
