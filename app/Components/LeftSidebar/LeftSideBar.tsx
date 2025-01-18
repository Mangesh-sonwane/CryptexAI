// import ROUTES from "@/constants/routes";
import { Button } from "@mui/material";
import React from "react";
import NavLinks from "./NavLinks";

const LeftSideBar = () => {
  return (
    <div>
      <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen w-[180px] flex-col justify-between overflow-y-auto border-r p-6 pt-24 shadow-light-300 dark:shadow-none">
        <div className="flex flex-1 flex-col items-center gap-8">
          <NavLinks />
        </div>

        <div className="flex flex-col gap-3">
          <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
            <span className="primary-text-gradient max-lg:hidden">Help</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LeftSideBar;
