"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Palette,
  KeyRound,
  Save,
  Copy,
  BookOpen,
  ShieldCheck,
  UserCog,
  SlidersHorizontal,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const tabs = [
  { id: "profile", label: "Profile", icon: UserCog },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "api", label: "API", icon: KeyRound },
];

const Settings = () => {
  const { user, setUser } = useUser();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [apiTokenName, setApiTokenName] = useState("");
  const [apiTokens, setApiTokens] = useState([]);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    realtimeAlerts: true,
    candidateFeedback: true,
    weeklyReports: false,
  });

  const [preferenceSettings, setPreferenceSettings] = useState({
    language: "en-US",
    timezone: "UTC",
    autoSyncIntegrations: true,
    liveDashboardRefresh: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const localSettings = localStorage.getItem("hrmSettings");
    if (!localSettings) return;
    const parsed = JSON.parse(localSettings);
    if (parsed?.theme) setTheme(parsed.theme);
    if (parsed?.notifications) setNotifications(parsed.notifications);
    if (parsed?.preferences) setPreferenceSettings(parsed.preferences);
    if (Array.isArray(parsed?.apiTokens)) setApiTokens(parsed.apiTokens);
  }, [setTheme]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("Users")
        .update({
          name: profileData.name,
        })
        .eq("email", user?.email);

      if (error) throw error;

      setUser({ ...user, name: profileData.name });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const saveSystemSettings = async () => {
    const payload = {
      theme,
      notifications,
      preferences: preferenceSettings,
      apiTokens,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem("hrmSettings", JSON.stringify(payload));

    try {
      if (user?.email) {
        await supabase.from("user_settings").upsert(
          {
            user_email: user.email,
            ...payload,
          },
          { onConflict: "user_email" }
        );
      }
      toast.success("Settings saved");
    } catch (error) {
      console.error("Failed to save settings to Supabase:", error);
      toast.success("Saved locally. Supabase table can be applied via migration.");
    }
  };

  const generateApiToken = () => {
    if (!apiTokenName.trim()) {
      toast.error("Please enter token name");
      return;
    }
    const secret = `hrm_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    const token = {
      id: crypto.randomUUID(),
      name: apiTokenName.trim(),
      token: secret,
      createdAt: new Date().toISOString(),
      lastUsed: "Never",
    };
    const updated = [token, ...apiTokens].slice(0, 5);
    setApiTokens(updated);
    setApiTokenName("");
    toast.success("API token generated");
  };

  const copyText = async (value) => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  };

  const activeTheme = resolvedTheme || theme || "dark";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Professional controls for account, real-time behavior, and APIs
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Profile Settings</h2>
            </div>
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Full Name
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address
              </Label>
              <Input id="email" value={profileData.email} disabled />
            </div>
            <Button onClick={handleSaveProfile} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">UI and App Preferences</h2>
            </div>
            <div>
              <Label className="mb-2 block">Theme</Label>
              <div className="flex gap-2">
                {["light", "dark", "system"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`rounded-md border px-3 py-2 text-sm capitalize ${
                      mounted && (mode === "system" ? theme === "system" : activeTheme === mode)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={preferenceSettings.language}
                onChange={(e) =>
                  setPreferenceSettings((prev) => ({ ...prev, language: e.target.value }))
                }
                placeholder="Language e.g. en-US"
              />
              <Input
                value={preferenceSettings.timezone}
                onChange={(e) =>
                  setPreferenceSettings((prev) => ({ ...prev, timezone: e.target.value }))
                }
                placeholder="Timezone e.g. UTC"
              />
            </div>
            <div className="space-y-2">
              {[
                ["autoSyncIntegrations", "Auto sync integrations in real-time"],
                ["liveDashboardRefresh", "Live dashboard refresh"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setPreferenceSettings((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm"
                >
                  <span>{label}</span>
                  <span className="text-primary">
                    {preferenceSettings[key] ? "Enabled" : "Disabled"}
                  </span>
                </button>
              ))}
            </div>
            <Button onClick={saveSystemSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Notification Controls</h2>
            </div>
            {Object.entries(notifications).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left"
              >
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className={`text-sm ${value ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {value ? "Enabled" : "Disabled"}
                </span>
              </button>
            ))}
            <Button onClick={saveSystemSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Notifications
            </Button>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">API and Webhook Access</h2>
            </div>
            <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2 text-foreground font-medium">
                <BookOpen className="h-4 w-4 text-primary" />
                API Documentation
              </p>
              <p>
                Use your token in the `Authorization: Bearer YOUR_TOKEN` header to call HRM APIs and trigger VAPI interview workflows.
              </p>
              <div className="rounded-md border border-border bg-muted/40 p-3 font-mono text-xs overflow-x-auto">
                GET /api/public/v1/interviews
                <br />
                POST /api/public/v1/interviews/:id/start-vapi
                <br />
                GET /api/public/v1/interviews/:id/feedback
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4 space-y-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Generate API Token
              </p>
              <div className="flex gap-2">
                <Input
                  value={apiTokenName}
                  onChange={(e) => setApiTokenName(e.target.value)}
                  placeholder="Token name e.g. ATS Integration"
                />
                <Button onClick={generateApiToken}>Generate</Button>
              </div>
            </div>

            <div className="space-y-2">
              {apiTokens.map((token) => (
                <div key={token.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{token.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(token.createdAt).toLocaleString()} - Last used: {token.lastUsed}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-border"
                      onClick={() => copyText(token.token)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Token
                    </Button>
                  </div>
                  <p className="mt-2 truncate rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    {token.token}
                  </p>
                </div>
              ))}
            </div>
            <Button onClick={saveSystemSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save API Configuration
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;

