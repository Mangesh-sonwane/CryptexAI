"use client";
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { Button } from "@mui/material";
import { ShieldCheckered, Wallet } from "@phosphor-icons/react";

const Navbar = () => {
  return (
    <div>
      <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-4 shadow-light-300 dark:shadow-none sm:px-12">
        <Link href="/" className="flex items-center gap-1">
          {/* <Image
            src="/images/site-logo.svg"
            alt="Devflow logo"
            width={23}
            height={23}
          /> */}
          <ShieldCheckered size={36} color="#FF7000" weight="fill" />

          <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Cryptex <span className="text-primary-500">AI</span>
          </p>
        </Link>
        <div className="flex-between gap-5">
          <ThemeToggleBtn />
          <Button
            variant="contained"
            size="large"
            startIcon={<Wallet size={24} weight="fill" />}
            className=" !rounded-full !bg-primary-500"
          >
            Connect
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
