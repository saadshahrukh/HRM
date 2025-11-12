"use client";

import React, { useMemo, useState } from "react";
import moment from "moment";
import {
  Calendar,
  Clock,
  Layers,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CircleCheck,
  Info,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Modern, dark-mode ready UI for Interview Details
 * - Clean header with subtle glass effect
 * - Animated question pagination (Next/Prev + dots + progress bar)
 * - No business logic changed, just UI
 */
const InterviewDetailsContainer = ({ interviewDetail }) => {
  const questions = interviewDetail?.questionList ?? [];
  const [index, setIndex] = useState(0);

  const typesText = useMemo(() => {
    // Type sometimes comes JSON string like '["Technical","Behavioral"]'
    try {
      const parsed = JSON.parse(interviewDetail?.type ?? "[]");
      if (Array.isArray(parsed)) return parsed.join(" • ");
      if (typeof parsed === "string") return parsed;
      return "";
    } catch {
      return interviewDetail?.type ?? "";
    }
  }, [interviewDetail?.type]);

  const createdOn = useMemo(
    () => (interviewDetail?.created_at ? moment(interviewDetail.created_at).format("DD MMM YYYY") : "-"),
    [interviewDetail?.created_at]
  );

  const canPrev = index > 0;
  const canNext = index < Math.max(0, questions.length - 1);

  const goPrev = () => canPrev && setIndex((i) => i - 1);
  const goNext = () => canNext && setIndex((i) => i + 1);
  const goto = (i) => setIndex(i);

  const progressPct = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  return (
    <div className="mt-5">
      {/* Outer wrapper with dark support */}
      <div
        className="
          relative overflow-hidden rounded-2xl 
          border border-zinc-200/60 bg-white 
          shadow-sm 
          dark:border-zinc-800 dark:bg-zinc-900
        "
      >
        {/* Subtle gradient top stripe */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-400/10" />

        {/* Header */}
        <div className="relative p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Interview Details
              </div>
              <h2 className="mt-3 truncate text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {interviewDetail?.jobPosition || "—"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                A clean, modern view of your AI-generated interview set.
              </p>
            </div>

            {/* Meta small cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <MetaPill
                label="Duration"
                icon={Clock}
                value={interviewDetail?.duration || "-"}
              />
              <MetaPill label="Created On" icon={Calendar} value={createdOn} />
              {!!typesText && <MetaPill label="Type" icon={Layers} value={typesText} />}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* Job Description */}
        <section className="relative px-6 pb-6 pt-5 md:px-7">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Info className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            Job Description
          </h3>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {interviewDetail?.jobDescription || "No description provided."}
          </p>
        </section>

        {/* Divider */}
        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* Questions Section */}
        <section className="relative px-6 pb-7 pt-5 md:px-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <ListChecks className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              Interview Questions
            </h3>

            {/* Count pill */}
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              {questions.length} total
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300 ease-out dark:bg-indigo-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="
                  rounded-xl border border-zinc-200/60 bg-white/70 p-5 
                  backdrop-blur supports-[backdrop-filter]:bg-white/50 
                  shadow-sm 
                  dark:border-zinc-800 dark:bg-zinc-900/70 dark:supports-[backdrop-filter]:bg-zinc-900/60
                "
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white dark:bg-indigo-400">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {questions[index]?.question || "—"}
                    </p>
                    {questions[index]?.type && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                        <CircleCheck className="h-3.5 w-3.5" />
                        {questions[index].type}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={!canPrev}
                className={cx(
                  baseBtn,
                  "justify-center",
                  !canPrev && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goto(i)}
                    className={cx(
                      "h-2.5 w-2.5 rounded-full transition",
                      i === index
                        ? "scale-110 bg-indigo-500 dark:bg-indigo-400"
                        : "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                    )}
                    aria-label={`Go to question ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={!canNext}
                className={cx(
                  baseBtn,
                  "justify-center",
                  !canNext && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Grid (optional view all) */}
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Quick glance
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => goto(i)}
                    className={cx(
                      "group rounded-lg border text-left transition",
                      "border-zinc-200/60 bg-white/60 hover:bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80",
                      "px-4 py-3"
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <span
                        className={cx(
                          "inline-flex h-5 w-5 items-center justify-center rounded-md",
                          i === index
                            ? "bg-indigo-500 text-white dark:bg-indigo-400"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        )}
                      >
                        {i + 1}
                      </span>
                      {q?.type ? <span>{q.type}</span> : <span>Question</span>}
                    </div>
                    <p
                      className={cx(
                        "line-clamp-2 text-sm",
                        i === index
                          ? "font-medium text-zinc-900 dark:text-zinc-100"
                          : "text-zinc-700 dark:text-zinc-300"
                      )}
                      title={q?.question}
                    >
                      {q?.question || "—"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/** ----------------------------- Sub components ----------------------------- */

const MetaPill = ({ label, value, icon: Icon }) => (
  <div
    className="
      flex items-center gap-3 rounded-2xl border
      border-zinc-200/60 bg-white/70 px-4 py-3 shadow-sm
      backdrop-blur supports-[backdrop-filter]:bg-white/50
      dark:border-zinc-800 dark:bg-zinc-900/70 dark:supports-[backdrop-filter]:bg-zinc-900/60
    "
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700">
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  </div>
);

/** ----------------------------- Utilities ----------------------------- */

const baseBtn =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium " +
  "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900 " +
  "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:active:bg-zinc-100 " +
  "transition focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-0";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default InterviewDetailsContainer;
