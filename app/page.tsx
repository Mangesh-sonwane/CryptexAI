"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePrivy } from "@privy-io/react-auth";
import Dashboard from "./dashboard/page";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState(theme);

  const { authenticated, user } = usePrivy();
  console.log(user?.wallet?.address, "helloworld");

  useEffect(() => {
    if (theme === "system") {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setResolvedTheme(isSystemDark ? "dark" : "light");
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const imageSrc =
    resolvedTheme === "light"
      ? "/Images/sapiens.svg"
      : "/Images/sapiens_dark.svg";

  return (
    <>
      {authenticated ? (
        <>
          <Dashboard />
        </>
      ) : (
        <>
          <div className="flex-center">
            <div className="w-[500px] max-w-full">
              <h1 className="text-center text-6xl font-extrabold leading-relaxed text-slate-700 dark:text-white">
                Where the mass adoption of{" "}
                <span className="text-primary-500">Web3</span> Begins
              </h1>
            </div>
            <Image src={imageSrc} alt="Artwork" width={730} height={730} />
          </div>
        </>
      )}
    </>
  );
}
