"use client";
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { Button } from "@mui/material";
import { ShieldCheckered, SignOut, Wallet } from "@phosphor-icons/react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BaseLogo from "@/app/assets/Logo/Base_logo.svg";
import Image from "next/image";
import { ethers } from "ethers";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import ROUTES from "@/constants/routes";

const BASE_CHAIN_ID = "0x2105";

const Navbar = () => {
  const { authenticated, login, logout } = usePrivy();
  const router = useRouter();
  const [isBaseNetwork, setIsBaseNetwork] = useState(false);

  // Check if the network is the Base chain
  const checkNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // Correct way to access providers
      const network = await provider.getNetwork();
      setIsBaseNetwork(network.chainId === parseInt(BASE_CHAIN_ID, 16));
    }
  };

  const switchToBaseNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_CHAIN_ID }],
        });
        setIsBaseNetwork(true);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error) {
          const errorCode = (error as { code: number }).code;
          if (errorCode === 4902) {
            alert("Please add the Base network to your wallet.");
          } else {
            console.error("Failed to switch network:", error);
          }
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  useEffect(() => {
    checkNetwork();
  }, []);

  useEffect(() => {
    if (authenticated) {
      router.push("/insights");
    } else {
      router.push("/");
    }
  }, [authenticated, router]);

  return (
    <div>
      <nav className="flex-between background-light900_dark200 fixed inset-x-0 top-0 z-50 w-full gap-5 p-4 shadow-sm dark:shadow-none">
        <Link href="/" className="flex items-center gap-1">
          <ShieldCheckered size={36} color="#FF7000" weight="fill" />

          <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
            Cryptex <span className="text-primary-500">AI</span>
          </p>
        </Link>
        <div className="flex-between gap-5">
          <ThemeToggleBtn />
          {authenticated ? (
            <>
              <div className="inline-block rounded-full border-2 border-[#FF7000]  p-2">
                <Image src={BaseLogo} alt="" width="28" height="28" />
              </div>
            </>
          ) : null}

          {!isBaseNetwork && (
            <div className="font-semibold text-red-500">
              <Button
                variant="outlined"
                size="small"
                onClick={switchToBaseNetwork}
                className="!rounded-full !font-semibold text-light-900"
                sx={{
                  borderRadius: "9999px", // Rounded full
                  fontWeight: "bold", // Font semibold
                  color: "#FF7000", // Text color
                  borderColor: "#FF7000", // Border color
                  "&:hover": {
                    backgroundColor: "rgba(255, 112, 0, 0.1)", // Add hover effect
                    borderColor: "#FF7000", // Retain border color on hover
                  },
                }}
              >
                Switch Network Base Network
              </Button>
            </div>
          )}

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
