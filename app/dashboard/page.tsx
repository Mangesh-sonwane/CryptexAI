"use client";
import React from "react";
import LeftSideBar from "../Components/LeftSidebar/LeftSideBar";

const Dashboard: React.FC = () => {
  return (
    <>
      <main className="flex h-screen w-1/4 flex-row">
        <div className="flex h-full w-1/4">
          <LeftSideBar />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
