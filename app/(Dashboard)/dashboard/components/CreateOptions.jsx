"use client";
import { Video, Phone, ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CreateOptions = () => {
  const options = [
    {
      icon: Video,
      title: "Create New Interview",
      description: "Set up a new AI-powered interview session",
      href: "/dashboard/create-interview",
      available: true,
    },
    {
      icon: Phone,
      title: "Phone Screening",
      description: "Quick phone-based candidate screening",
      href: "#",
      available: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {options.map((option, index) => {
        const Icon = option.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            {/* 1. Changed wrapper to a DIV to avoid nested Link errors */}
            <div
              className={`relative h-full flex flex-col overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                option.available
                  ? "border-gray-700 bg-gray-800/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                  : "border-gray-800 bg-gray-900/40 opacity-70"
              }`}
            >
              {/* 2. Added a subtle glow instead of solid blobs */}
              {option.available && (
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
              )}

              {/* 3. Icon - Consistent rounded-lg shape */}
              <div className="mb-5 relative z-10">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                    option.available
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"
                      : "bg-gray-700 text-gray-500"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${option.available ? "text-white" : "text-gray-400"}`} />
                </div>
              </div>

              {/* 4. Content Area */}
              <div className="flex-grow relative z-10">
                <h3 className={`text-xl font-bold mb-2 ${option.available ? "text-white" : "text-gray-500"}`}>
                  {option.title}
                </h3>
                <p className={`text-sm mb-6 ${option.available ? "text-gray-400" : "text-gray-600"}`}>
                  {option.description}
                </p>
              </div>

              {/* 5. Action - Single Link or Disabled Text */}
              <div className="mt-auto relative z-10">
                {option.available ? (
                  <Link
                    href={option.href}
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-semibold group/link"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                ) : (
                  <span className="text-gray-600 text-xs font-medium uppercase tracking-wider">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CreateOptions;