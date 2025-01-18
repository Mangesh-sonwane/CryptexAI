"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import LeftSideBar from "./Components/LeftSidebar/LeftSideBar";
import Navbar from "./Components/Navbar/Navbar";

const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = usePrivy();

  return (
    <div className="fixed flex h-screen w-full flex-col">
      <Navbar />

      <div className="flex flex-1">
        {authenticated && (
          <div className="w-[180px]">
            <LeftSideBar />
          </div>
        )}

        {/* Main Content */}
        <main className="background-light850_dark100 mt-[80px] flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavbarLayout;
