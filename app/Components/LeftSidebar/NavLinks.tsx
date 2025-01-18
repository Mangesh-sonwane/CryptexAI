"use client";

import { Button } from "@mui/material";
import { cn } from "@/lib/utils";
import {
  ArrowsLeftRight,
  ChartBarHorizontal,
  OpenAiLogo,
} from "@phosphor-icons/react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

const NavLinks = () => {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start justify-start gap-8">
      <div>
        <Button
          size="large"
          startIcon={<ChartBarHorizontal size={24} />}
          variant={pathname === "/insights" ? "contained" : undefined}
          className={cn(
            pathname === "/insights"
              ? "!primary-gradient !rounded-lg !font-semibold text-light-900 !w-[145px]"
              : "text-dark300_light900 !font-semibold"
          )}
          onClick={() => {
            if (authenticated) {
              router.push("/insights");
            }
          }}
        >
          Insights
        </Button>
      </div>
      <div>
        <Button
          size="large"
          startIcon={<OpenAiLogo size={24} />}
          variant={pathname === "/chat" ? "contained" : undefined}
          className={cn(
            pathname === "/chat"
              ? "!primary-gradient !rounded-lg !font-semibold text-light-900 !w-[145px]"
              : "text-dark300_light900 !font-semibold"
          )}
          onClick={() => {
            if (authenticated) {
              router.push("/chat");
            }
          }}
        >
          Chat
        </Button>
      </div>

      <div>
        <Button
          size="large"
          startIcon={<ArrowsLeftRight size={24} />}
          variant={pathname === "/trade" ? "contained" : undefined}
          className={cn(
            pathname === "/trade"
              ? "!primary-gradient !rounded-lg !font-semibold text-light-900 !w-[145px]"
              : "text-dark300_light900 !font-semibold"
          )}
          onClick={() => {
            if (authenticated) {
              router.push("/trade");
            }
          }}
        >
          Trade
        </Button>
      </div>
    </div>
  );
};

export default NavLinks;
