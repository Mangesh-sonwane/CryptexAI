"use client";
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { Button } from "@mui/material";
import { ShieldCheckered, SignOut, Wallet } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import ROUTES from "@/constants/routes";

const Navbar = () => {
  const { authenticated, login, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/insights");
    } else {
      router.push("/");
    }
  }, [authenticated, router]);

  return (
    <div>
      <nav className="flex-between background-light900_dark200 fixed inset-x-0 top-0 z-50 w-full gap-5 p-4 shadow-light-300 dark:shadow-none">
        <Link href="/" className="flex items-center gap-1">
          <ShieldCheckered size={36} color="#FF7000" weight="fill" />

          <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Cryptex <span className="text-primary-500">AI</span>
          </p>
        </Link>
        <div className="flex-between gap-5">
          <ThemeToggleBtn />
          {authenticated ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<SignOut size={24} weight="fill" />}
              className=" primary-gradient !rounded-full !font-semibold text-light-900"
              onClick={logout}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<Wallet size={24} weight="fill" />}
              className=" primary-gradient !rounded-full !font-semibold text-light-900"
              onClick={() =>
                login({
                  loginMethods: ["wallet", "email", "google", "github"],
                })
              }
            >
              Connect
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
