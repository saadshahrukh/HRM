"use client";
import { useUser } from "@/app/Provider";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const WelcomeContainer = () => {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")?.[0] || "Admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-indigo-100">
              {getGreeting()}, {firstName}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your hiring command center
          </h1>
          <p className="mb-4 text-indigo-100 text-lg">
            Jobs, candidates, AI interviews, and reports in one place.
          </p>
          <Link href="/jobs/new">
            <Button className="bg-white font-semibold text-indigo-700 hover:bg-indigo-50">
              + Post New Job
            </Button>
          </Link>
        </div>

        {user?.picture && (
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
            <Image
              width={80}
              height={80}
              alt="Avatar"
              src={user.picture}
              className="relative rounded-full w-20 h-20 border-4 border-white/20 shadow-lg"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeContainer;
