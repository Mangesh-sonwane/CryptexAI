import { Button } from "@mui/material";
import React from "react";

const Trade = () => {
  // const receiveInputSellRef = useRef<HTMLInputElement>(null); // for sell
  // const receiveInputRef = useRef<HTMLInputElement>(null); // for buy
  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-semibold">Swap Anywhere,</h1>
        <h1 className="text-5xl font-semibold">Anywhere</h1>
      </div>
      <div className="background-light800_dark300 mt-10 flex h-fit w-[500px] flex-col items-center justify-start gap-2 rounded-lg p-4">
        <div className="background-light800_darkgradient h-[120px] w-full rounded-lg border-[0.5px] border-gray-300 p-4 shadow-sm dark:border-gray-700">
          <div>
            <p className="text-xl font-medium leading-7">Sell</p>
            <input
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                transition: "width 0.2s ease",
              }}
              // value={displayValue}
              className="border-none text-left text-3xl font-bold leading-10 focus:outline-none"
              placeholder="0.00"
            />
            <p className="text-sm font-medium leading-7">$12.48</p>
          </div>
          <div></div>
        </div>

        <div className="h-[120px] w-full rounded-lg border-[0.5px] border-gray-300 p-4 shadow-sm dark:border-gray-700">
          <p className="text-xl font-medium leading-7">Buy</p>
          <div>
            <input
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                transition: "width 0.2s ease",
              }}
              // value={displayValue}
              className="border-none text-left text-3xl font-bold leading-10 focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="mt-2 w-full px-2">
          <Button
            className="primary-gradient mt-2 h-[40px] !rounded-xl !font-semibold text-light-900"
            variant="contained"
            color="primary"
            fullWidth
          >
            Review Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Trade;
