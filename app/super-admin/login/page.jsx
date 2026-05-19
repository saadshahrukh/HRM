"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { useUser } from "@/app/Provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const ADMIN_EMAILS = [
  'saad122sharukh@gmail.com',
  'admin@myapp.com'
];

const SuperAdminLogin = () => {
  const router = useRouter();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to super-admin dashboard
  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email)) {
      router.push("/super-admin");
    }
  }, [user, router]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      // Basic check against configuration and allowed admin list
      if (!ADMIN_EMAILS.includes(email)) {
        toast.error("Unauthorized. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Hardcoded password verification or fallback to environment verification
      if (password === "SaadSuperAdmin2026!") {
        // Authenticate standard session with cookies
        document.cookie = `sb-access-token=super-admin-bypass-token; path=/; max-age=3600; SameSite=Lax; Secure`;
        toast.success("Bypass Authentication Successful! Welcome Admin.");
        router.push("/super-admin");
      } else {
        // Standard Supabase Auth SignIn for email/password if enabled
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        toast.success("Welcome Super Admin!");
        router.push("/super-admin");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/super-admin`
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4 shadow-inner">
            <Shield className="h-10 w-10 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Gate</h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Strict Multi-Tenant Control Panel. Authorized emails only.
          </p>
        </div>

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950 border-slate-800 pl-10 text-white placeholder-gray-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              type="password"
              placeholder="Security Key / Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 pl-10 text-white placeholder-gray-500 focus:border-indigo-500"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl shadow-lg shadow-indigo-600/20 mt-2"
          >
            {loading ? "Verifying Authority..." : "Access Console"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-slate-800" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            OR SECURE SINGLE-SIGN-ON
          </span>
        </div>

        <Button 
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white h-11 rounded-xl flex items-center justify-center gap-3"
        >
          <Image 
            src="/google.png" 
            alt="Google Logo" 
            width={18} 
            height={18} 
            className="object-contain" 
            onError={(e) => e.target.style.display = 'none'} 
          />
          Authorize with Google
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
