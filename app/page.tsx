"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePrivy } from "@privy-io/react-auth";
import Dashboard from "./dashboard/page";

export default function Home() {
  const { theme } = useTheme();

  const { ready, authenticated, user, login, logout } = usePrivy();
  console.log(ready, authenticated, user, login, logout, "helloworld");

  const imageSrc =
    theme === "light" ? "/Images/sapiens.svg" : "/images/sapiens_dark.svg";

  return (
    <>
      {authenticated ? (
        <>
          <Dashboard />
        </>
      ) : (
        <>
          <div className="flex-center h-screen">
            <div className="h-fit w-[500px] max-w-full">
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
