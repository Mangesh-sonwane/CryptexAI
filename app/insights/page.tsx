"use client";
import React, { useState } from "react";
import CryptoCard from "../Components/CryptoCard/CryptoCard";
import CryptoChart from "../Components/CryptoCard/CryptoChart";
import { useQuery } from "@tanstack/react-query";
// import { Spinner } from "@phosphor-icons/react";
import { fetchCoinDetails, fetchMarketChart } from "../services/api";

const Insights = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
  const [days, setDays] = useState<number>(7);

  const handleCryptoClick = (crypto: string) => {
    setSelectedCrypto(crypto);
  };

  const {
    data: coinDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = useQuery({
    queryKey: ["coinDetails", selectedCrypto],
    queryFn: () => fetchCoinDetails(selectedCrypto),
  });
  console.log(
    "🚀 ~ Insights ~ coinDetails:",
    coinDetails,
    detailsLoading,
    detailsError
  );

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ["marketChart", selectedCrypto, days],
    queryFn: () => fetchMarketChart(selectedCrypto, days),
  });
  console.log(
    "🚀 ~ Insights ~ chartData:",
    chartData,
    chartLoading,
    chartError
  );

  // if (detailsLoading || chartLoading) {
  //   return (
  //     <div className="flex-center h-full flex-col items-center gap-4">
  //       <Spinner size={180} color="#FF7000" />
  //       Loading...
  //     </div>
  //   );
  // }

  // if (detailsError || chartError) {
  //   return (
  //     <div className="flex-center h-full flex-col items-center gap-4">
  //       <Spinner size={180} color="#FF7000" />
  //       Error loading data. Please try again later.
  //     </div>
  //   );
  // }

  return (
    <div className="flex-center flex-col gap-2 p-8">
      <div className="background-light800_dark300 text-light400_light500  flex h-fit w-full flex-row items-start justify-start gap-4 rounded-lg p-4">
        <p
          onClick={() => handleCryptoClick("bitcoin")}
          className={`cursor-pointer text-lg font-medium leading-7 ${
            selectedCrypto === "bitcoin"
              ? "text-lg font-semibold leading-7 text-primary-500"
              : "text-sm font-medium leading-7"
          }`}
        >
          Bitcoin
        </p>
        <p
          onClick={() => handleCryptoClick("ethereum")}
          className={`cursor-pointer text-lg font-medium leading-7 ${
            selectedCrypto === "ethereum"
              ? "text-lg font-semibold leading-7 text-primary-500"
              : "text-sm font-medium leading-7"
          }`}
        >
          Ethereum
        </p>
      </div>
      <div className="flex h-fit w-full gap-2">
        <div className="background-light800_darkgradient  h-fit w-4/12 rounded-lg p-4">
          <CryptoCard coinDetails={coinDetails} />
        </div>
        <div
          className="background-light800_darkgradient h-fit w-9/12 rounded-lg p-4
"
        >
          <div>
            <CryptoChart
              chartData={chartData}
              coinName={coinDetails?.name}
              setDays={setDays}
            />
            {/* crypto details */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
