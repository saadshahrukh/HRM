"use client";
import React from "react";
import WelcomeContainer from "./components/WelcomeContainer";
import CreateOptions from "./components/CreateOptions";
import LatestInterviewsList from "./components/LatestInterviewsList";
import StatsCards from "./components/StatsCards";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <WelcomeContainer />
      <StatsCards />
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  );
};

export default Dashboard;
