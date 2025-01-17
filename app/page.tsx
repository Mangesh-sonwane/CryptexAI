"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex-center h-screen">
      <div className="h-fit w-[500px] max-w-full">
        <h1 className="text-center text-6xl font-extrabold leading-relaxed text-slate-700 dark:text-white">
          Where the mass adoption of{" "}
          <span className="text-primary-500">Web3</span> Begins
        </h1>
      </div>

      {theme === "light" ? (
        <Image
          src="/images/sapiens.svg"
          alt="Artwork"
          width={730}
          height={730}
        />
      ) : (
        <Image
          src="/images/sapiens_dark.svg"
          alt="Artwork"
          width={730}
          height={730}
        />
      )}
    </div>
  );
}
