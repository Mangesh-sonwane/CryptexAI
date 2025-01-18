import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { SignOut } from "@phosphor-icons/react";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

const LeftSideBar = () => {
  const { address } = useAccount();
  const { logout } = usePrivy();
  return (
    <>
      <div className="mt-[64px] flex h-screen items-center justify-center">
        <div className="m-4">
          <p className="text-2xl">Wallet address: {address}</p>
        </div>
        <Link href="/" passHref>
          <Button
            size="medium"
            startIcon={<SignOut size={24} />}
            className="btn !rounded-full !px-4 !py-2 !font-semibold !text-slate-700 dark:!text-white"
            onClick={logout}
          >
            <span className="text-slate-700 dark:text-white">DisConnect</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default LeftSideBar;
