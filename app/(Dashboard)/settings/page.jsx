"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewReminders: true,
    candidateFeedback: true,
    weeklyReports: false,
  });

  // Application Settings
  const [appSettings, setAppSettings] = useState({
    theme: "dark",
    language: "en",
    timezone: "UTC",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

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

  const handleSaveNotifications = () => {
    // Save to localStorage or database
    localStorage.setItem("notificationSettings", JSON.stringify(notifications));
    toast.success("Notification settings saved");
  };

  const handleSaveAppSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(appSettings));
    toast.success("Application settings saved");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            <p className="text-sm text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300 mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="bg-gray-900/50 border-gray-700 text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">
              Email Address
            </Label>
            <Input
              id="email"
              value={profileData.email}
              disabled
              className="bg-gray-900/50 border-gray-700 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Notification Settings
            </h2>
            <p className="text-sm text-gray-400">
              Control how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700"
            >
              <div>
                <Label className="text-white font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <p className="text-xs text-gray-400 mt-1">
                  {key === "emailNotifications" &&
                    "Receive email notifications for important updates"}
                  {key === "interviewReminders" &&
                    "Get reminders before scheduled interviews"}
                  {key === "candidateFeedback" &&
                    "Notify when candidate completes interview"}
                  {key === "weeklyReports" &&
                    "Receive weekly summary reports"}
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({ ...notifications, [key]: !value })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  value ? "bg-indigo-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}

          <Button
            onClick={handleSaveNotifications}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
        </div>
      </motion.div>

      {/* Application Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Application Settings
            </h2>
            <p className="text-sm text-gray-400">
              Customize your application experience
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 mb-2 block">Theme</Label>
            <Select
              value={appSettings.theme}
              onValueChange={(value) =>
                setAppSettings({ ...appSettings, theme: value })
              }
            >
              <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="dark" className="text-white">
                  Dark
                </SelectItem>
                <SelectItem value="light" className="text-white">
                  Light
                </SelectItem>
                <SelectItem value="system" className="text-white">
                  System
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Language</Label>
            <Select
              value={appSettings.language}
              onValueChange={(value) =>
                setAppSettings({ ...appSettings, language: value })
              }
            >
              <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en" className="text-white">
                  English
                </SelectItem>
                <SelectItem value="es" className="text-white">
                  Spanish
                </SelectItem>
                <SelectItem value="fr" className="text-white">
                  French
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Timezone</Label>
            <Select
              value={appSettings.timezone}
              onValueChange={(value) =>
                setAppSettings({ ...appSettings, timezone: value })
              }
            >
              <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="UTC" className="text-white">
                  UTC
                </SelectItem>
                <SelectItem value="EST" className="text-white">
                  EST
                </SelectItem>
                <SelectItem value="PST" className="text-white">
                  PST
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSaveAppSettings}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Application Settings
          </Button>
        </div>
      </motion.div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-gray-700 bg-gray-800 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">API Configuration</h2>
            <p className="text-sm text-gray-400">
              Manage your API keys and security settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 mb-2 block">VAPI API Key</Label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={process.env.NEXT_PUBLIC_VAPI_API_KEY?.substring(0, 20) + "..." || "Not configured"}
                disabled
                className="bg-gray-900/50 border-gray-700 text-gray-400 pr-10"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              API keys are configured in environment variables
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;

