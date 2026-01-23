"use client";
import { Video, Phone, ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CreateOptions = () => {
  const options = [
    {
      icon: Video,
      title: "Create New Interview",
      description: "Set up a new AI-powered interview session",
      href: "/dashboard/create-interview",
      gradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      icon: Phone,
      title: "Phone Screening",
      description: "Quick phone-based candidate screening",
      href: "#",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      disabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {options.map((option, index) => {
        const Icon = option.icon;
        const Component = option.disabled ? "div" : Link;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Component
              href={option.href}
              className={`group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 transition-all duration-300 ${
                option.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
              }`}
            >
              <div className="relative z-10">
                <div
                  className={`inline-flex p-3 rounded-lg ${option.iconBg} mb-4`}
                >
                  <Icon className={`w-6 h-6 ${option.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {option.description}
                </p>
                {!option.disabled && (
                  <div className="flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                {option.disabled && (
                  <span className="text-xs text-gray-500">Coming Soon</span>
                )}
              </div>

              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </Component>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CreateOptions;
