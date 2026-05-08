"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plug,
  Check,
  X,
  Zap,
  Mail,
  Calendar,
  Slack,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Integrations = () => {
  const [integrations, setIntegrations] = useState({
    slack: { connected: false, webhook: "" },
    email: { connected: false, apiKey: "" },
    calendar: { connected: false, token: "" },
    webhook: { connected: false, url: "" },
  });

  const integrationList = [
    {
      id: "slack",
      name: "Slack",
      description: "Get interview notifications and updates in Slack",
      icon: Slack,
      color: "from-purple-500 to-pink-600",
      fields: [{ label: "Webhook URL", key: "webhook", type: "url" }],
    },
    {
      id: "email",
      name: "Email Service",
      description: "Send interview reports via email automatically",
      icon: Mail,
      color: "from-blue-500 to-cyan-600",
      fields: [{ label: "API Key", key: "apiKey", type: "password" }],
    },
    {
      id: "calendar",
      name: "Google Calendar",
      description: "Sync interviews with your calendar",
      icon: Calendar,
      color: "from-green-500 to-emerald-600",
      fields: [{ label: "Access Token", key: "token", type: "password" }],
    },
    {
      id: "webhook",
      name: "Custom Webhook",
      description: "Send interview data to your custom endpoint",
      icon: Webhook,
      color: "from-orange-500 to-red-600",
      fields: [{ label: "Webhook URL", key: "url", type: "url" }],
    },
  ];

  const handleConnect = (integrationId) => {
    const integration = integrationList.find((i) => i.id === integrationId);
    const currentState = integrations[integrationId];

    // Check if required fields are filled
    const hasRequiredFields = integration.fields.every(
      (field) => currentState[field.key]?.trim()
    );

    if (!hasRequiredFields && !currentState.connected) {
      toast.error(`Please fill in all required fields for ${integration.name}`);
      return;
    }

    setIntegrations((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        connected: !prev[integrationId].connected,
      },
    }));

    toast.success(
      `${integration.name} ${currentState.connected ? "disconnected" : "connected"} successfully`
    );
  };

  const handleFieldChange = (integrationId, fieldKey, value) => {
    setIntegrations((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [fieldKey]: value,
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Connect third-party services to enhance your interview workflow
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationList.map((integration, index) => {
          const Icon = integration.icon;
          const currentState = integrations[integration.id];
          const isConnected = currentState.connected;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl border ${
                isConnected
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card"
              } p-6`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      Connected
                    </span>
                  </div>
                )}
              </div>

              {/* Configuration Fields */}
              {!isConnected && (
                <div className="space-y-3 mb-4">
                  {integration.fields.map((field) => (
                    <div key={field.key}>
                      <label className="text-sm text-muted-foreground mb-1 block">
                        {field.label}
                      </label>
                      <Input
                        type={field.type}
                        value={currentState[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            integration.id,
                            field.key,
                            e.target.value
                          )
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Connection Status */}
              {isConnected && (
                <div className="mb-4 p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>
                      {integration.name} is connected and active
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => handleConnect(integration.id)}
                className={`w-full ${
                  isConnected
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                {isConnected ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Plug className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          How Integrations Work
        </h3>
        <div className="space-y-3 text-muted-foreground text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">1</span>
            </div>
            <p>
              Connect your preferred services to receive real-time notifications
              and updates about interviews.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">2</span>
            </div>
            <p>
              Interview reports and candidate feedback will be automatically
              sent to your connected services.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-indigo-400 text-xs font-bold">3</span>
            </div>
            <p>
              You can disconnect any integration at any time. Your data remains
              secure and private.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Integrations;

