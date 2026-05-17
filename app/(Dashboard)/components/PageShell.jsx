"use client";

import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PageShell({
  title,
  description,
  plannedFeatures = [],
  actionHref,
  actionLabel,
  children,
}) {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
      </motion.div>

      {children}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-dashed border-border bg-card p-8"
      >
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Construction className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This module is wired in navigation and ready for feature rollout.
          </p>

          {plannedFeatures.length > 0 && (
            <ul className="mt-5 w-full space-y-2 text-left text-sm text-muted-foreground">
              {plannedFeatures.map((feature) => (
                <li key={feature} className="rounded-lg border border-border bg-background px-3 py-2">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {actionHref && actionLabel && (
            <Button asChild className="mt-6">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
