"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { CreditCard, Plus, Check, X, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Billing = () => {
  const { user, setUser } = useUser();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [loading, setLoading] = useState(false);

  const creditPackages = [
    {
      name: "Starter",
      credits: 10,
      price: 9.99,
      icon: Zap,
      color: "from-blue-500 to-cyan-600",
      popular: false,
    },
    {
      name: "Professional",
      credits: 50,
      price: 39.99,
      icon: Crown,
      color: "from-indigo-500 to-purple-600",
      popular: true,
      savings: "20% off",
    },
    {
      name: "Enterprise",
      credits: 200,
      price: 129.99,
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      popular: false,
      savings: "35% off",
    },
  ];

  const handlePurchase = async (packageItem) => {
    try {
      setLoading(true);
      // Simulate payment processing
      // In production, integrate with Stripe or similar
      
      const newCredits = credits + packageItem.credits;
      
      const { error } = await supabase
        .from("Users")
        .update({ credits: newCredits })
        .eq("email", user?.email);

      if (error) throw error;

      setCredits(newCredits);
      setUser({ ...user, credits: newCredits });
      toast.success(`Successfully purchased ${packageItem.credits} credits!`);
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to purchase credits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Credits</h1>
        <p className="text-gray-400">Manage your credits and subscription</p>
      </div>

      {/* Current Credits Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm p-8 shadow-lg"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm mb-2">Available Credits</p>
              <h2 className="text-5xl font-bold text-white mb-2">{credits}</h2>
              <p className="text-gray-300 text-sm">
                Each interview uses 1 credit
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-indigo-300" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </motion.div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Purchase Credits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {creditPackages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl border ${
                  pkg.popular
                    ? "border-indigo-500 bg-gray-800/90"
                    : "border-gray-700 bg-gray-800/80"
                } backdrop-blur-sm p-6 shadow-lg`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${pkg.color} mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-400 text-sm">USD</span>
                  </div>
                  {pkg.savings && (
                    <span className="inline-block mt-2 text-xs text-green-400 font-semibold">
                      {pkg.savings}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>{pkg.credits} Interview Credits</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>AI-Powered Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Video Recordings</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>PDF Reports</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                  className={`w-full ${
                    pkg.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      : "bg-gray-800 hover:bg-gray-700"
                  } text-white`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Purchase Now
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-700 bg-gray-800/80 p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          How Credits Work
        </h3>
        <div className="space-y-3 text-gray-400 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">1</span>
            </div>
            <p>
              Each interview session consumes 1 credit, regardless of duration
              or number of questions.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">2</span>
            </div>
            <p>
              Credits never expire and can be used at any time for any
              interview.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">3</span>
            </div>
            <p>
              Bulk packages offer better value - the more you buy, the more you
              save!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Billing;
