"use client";
import React from "react";
import WelcomeContainer from "./components/WelcomeContainer";
import CreateOptions from "./components/CreateOptions";
import LatestInterviewsList from "./components/LatestInterviewsList";
import StatsCards from "./components/StatsCards";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import DashboardPipeline from "./components/DashboardPipeline";
import DashboardActivity from "./components/DashboardActivity";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <WelcomeContainer />
      <StatsCards />
      <CreateOptions />
      <DashboardPipeline />
      <AdvancedAnalytics />
      <LatestInterviewsList />
      <DashboardActivity />
      
      
    </div>
  );
};

export default Dashboard;
