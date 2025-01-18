"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { cn } from "@/lib/utils";

const tabs = ["7", "30"]; // String type for tab values

interface TabBarProps {
  onTabChange?: (tab: number) => void; // onTabChange expects a number
}

const TabBar: React.FC<TabBarProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>("7"); // Active tab is a string

  const handleTabChange = (tab: string) => {
    setActiveTab(tab); // Set activeTab as a string
    if (onTabChange) {
      onTabChange(Number(tab)); // Pass the tab value as a number to onTabChange
    }
  };

  return (
    <Box
      className="background-light700_dark300 flex items-center justify-between gap-2 rounded-xl p-2"
      sx={{ width: "fit-content" }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => handleTabChange(tab)}
          variant={activeTab === tab ? "contained" : "text"}
          className={cn(
            "text-sm font-medium px-4 py-1 !rounded-lg !font-semibold", // Common styles
            activeTab === tab
              ? "!primary-gradient text-light-900 !w-[50px]" // Active tab styles
              : "text-dark300_light900 hover:!bg-gray-200" // Inactive tab styles
          )}
          sx={{
            textTransform: "none",
            minWidth: "auto",
            transition: "all 0.2s ease",
          }}
        >
          {tab}D
        </Button>
      ))}
    </Box>
  );
};

export default TabBar;
