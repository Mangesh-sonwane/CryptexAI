"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
// import Image from "next/image";
// import BTC from "@/app/assets/icons/bitcoin-btc-logo.svg";
import { ArrowFatLineRight, CaretDown } from "@phosphor-icons/react";
import { getSwapQuote, swapTokens } from "../services/ensoApi";
// import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { calculateSwapEstimate, getWalletTokenDetails } from "@/helper/getWeb3";
import { useQuery } from "@tanstack/react-query";
import { convertBalanceToReadable, formatZeros } from "@/constants/format";
import TokenImage from "../Components/Swap/TokenImage";
import { fetchTokenPriceByAddress } from "../services/api";

interface Token {
  token_address: string;
  logo?: string | null;
  name: string;
  symbol: string;
}

interface SwapEstimate {
  outputAmount: string;
  exchangeRate: string;
  priceImpact?: string;
}

const Trade: React.FC = () => {
  const [sellTokenAddress, setSellTokenAddress] = useState<string>("");
  const [buyTokenAddress, setBuyTokenAddress] = useState<string>("");
  const [sellBalance, setSellBalance] = useState<number | null>(null);
  const [buyBalance, setBuyBalance] = useState<number | null>(null);
  const [Amount, setAmount] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedBuyToken, setSelectedBuyToken] = useState<Token | null>(null);
  const [sellTokenUsdValue, setSellTokenUsdValue] = useState<number>(0);
  const [buyTokenUsdValue, setBuyTokenUsdValue] = useState<number>(0);
  const [swapEstimate, setSwapEstimate] = useState<SwapEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  console.log("🚀 ~ selectedToken:", selectedToken);
  const { chain, chainId } = useAccount();
  console.log("🚀 ~ chainId:", chainId, chain);

  // const { user } = usePrivy();
  const { isConnected, address } = useAccount();

  if (!address) {
    console.error("Address is undefined");
    return;
  } else {
    console.log("🚀 ~ address:", address);
  }

  // for sell
  const handleSelectSellTokenChange = (value: string) => {
    const selected = walletTokenList?.find(
      (token) => token.token_address === value
    );

    if (selected) {
      const readableBalance = convertBalanceToReadable(
        selected.balance.toString(),
        selected.decimals
      );

      setSelectedToken(selected);
      setSellTokenAddress(selected?.token_address || "");
      setSellBalance(readableBalance);
    } else {
      setSelectedToken(null);
      setSellBalance(null);
    }
  };

  // for buy
  const handleSelectBuyTokenChange = async (value: string) => {
    const selected = walletTokenList?.find(
      (token) => token.token_address === value
    );
    if (selected) {
      const readableBalance = convertBalanceToReadable(
        selected.balance.toString(),
        selected.decimals
      );

      setSelectedBuyToken(selected);
      setBuyTokenAddress(selected?.token_address || "");
      setBuyBalance(readableBalance);
    } else {
      setSelectedToken(null);
      setSellBalance(null);
    }
    setBuyTokenAddress(value);
  };

  // for amount
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const value = event.target.value;
    // const numericValue = value ? parseFloat(value) : 0;
    // setAmount(numericValue);

    const value = event.target.value;

    // Allow empty input
    if (value === "") {
      setAmount("");
      return;
    }

    // Only allow numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // for swap
  const handleSwap = async () => {
    if (!sellTokenAddress || !buyTokenAddress || !Amount) {
      setError("Please select tokens and enter an amount.");
      return;
    }

    try {
      setIsSwapping(true);

      // First get a quote
      const quote = await getSwapQuote({
        sellToken: sellTokenAddress,
        buyToken: buyTokenAddress,
        amount: parseFloat(Amount),
        walletAddress: address,
      });

      setSwapEstimate({
        outputAmount: quote.outputAmount,
        exchangeRate: (
          parseFloat(quote.outputAmount) / parseFloat(Amount)
        ).toString(),
        priceImpact: quote.route.priceImpact,
      });

      // Execute the swap
      const swapResult = await swapTokens({
        sellToken: sellTokenAddress,
        buyToken: buyTokenAddress,
        amount: parseFloat(Amount),
        walletAddress: address,
        slippage: 0.005, // 0.5% slippage
      });

      console.log("Swap Successful:", swapResult);
      setError(null);
    } catch (err) {
      setError(
        `Swap failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    const updateTokenPrices = async () => {
      if (selectedToken?.symbol) {
        const price = await fetchTokenPriceByAddress(
          selectedToken.token_address,
          "base"
        );
        setSellTokenUsdValue(price);
      }

      if (selectedBuyToken?.symbol) {
        const price = await fetchTokenPriceByAddress(
          selectedBuyToken.token_address,
          "base"
        );
        setBuyTokenUsdValue(price);
      }
    };

    updateTokenPrices();
  }, [selectedToken?.symbol, selectedBuyToken?.symbol]);

  // Calculate USD values
  const sellTokenTotalUsd = sellBalance ? sellBalance * sellTokenUsdValue : 0;
  const buyTokenTotalUsd = buyBalance ? buyBalance * buyTokenUsdValue : 0;
  const amountInUsd = Amount ? parseFloat(Amount) * sellTokenUsdValue : 0;

  const {
    data: walletTokenList,
    isLoading: walletTokenListLoading,
    isError: walletTokenListError,
  } = useQuery({
    queryKey: [`walletTokenList-${address}`, address],
    queryFn: () => getWalletTokenDetails((address as string).toLowerCase()),
    enabled: Boolean(address),
  });

  console.log(
    "🚀 ~ walletTokenList:",
    walletTokenList,
    walletTokenListLoading,
    walletTokenListError
  );

  // Effect to update token prices and calculate swap estimate
  useEffect(() => {
    const updatePricesAndEstimate = async () => {
      try {
        setIsCalculating(true);

        // Only fetch prices if tokens are selected
        if (selectedToken?.token_address && selectedBuyToken?.token_address) {
          // Fetch prices in parallel
          const [sellPrice, buyPrice] = await Promise.all([
            fetchTokenPriceByAddress(selectedToken.token_address, "base"),
            fetchTokenPriceByAddress(selectedBuyToken.token_address, "base"),
          ]);

          setSellTokenUsdValue(sellPrice);
          setBuyTokenUsdValue(buyPrice);

          // Calculate swap estimate if we have an amount
          if (Amount) {
            const estimate = await calculateSwapEstimate(
              Amount,
              sellPrice,
              buyPrice
            );
            setSwapEstimate(estimate);
          }
        }
      } catch (err) {
        console.error("Error updating prices and estimate:", err);
        setError("Failed to calculate swap estimate");
        setSwapEstimate(null);
      } finally {
        setIsCalculating(false);
      }
    };

    updatePricesAndEstimate();
  }, [Amount, selectedToken?.token_address, selectedBuyToken?.token_address]);

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      {/* <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-semibold">Swap Anywhere,</h1>
        <h1 className="text-4xl font-semibold">Anywhere</h1>
      </div> */}
      <div className="background-light800_dark300 mt-10 flex h-fit w-[600px] flex-col items-center justify-start gap-2 rounded-lg p-4 shadow-md">
        <div className="background-light800_darkgradient h-fit w-full rounded-lg border-[0.5px] border-gray-300 p-4 shadow-sm dark:border-gray-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium leading-7">Sell Token</p>
              <Select
                sx={{
                  width: "200px",
                  height: "50px",
                }}
                className="text-dark100_light900 !rounded-lg border-[0.5px] border-gray-300 p-2 font-semibold shadow-sm dark:border-gray-700"
                IconComponent={() => <CaretDown size={32} />}
                value={selectedToken?.token_address || ""}
                onChange={(e) => handleSelectSellTokenChange(e.target.value)}
                renderValue={() => {
                  const selected = walletTokenList?.find(
                    (token) =>
                      token.token_address === selectedToken?.token_address
                  );
                  return selected ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TokenImage
                        logoUrl={selected?.logo}
                        tokenName={selected?.name}
                        className="rounded-full"
                      />

                      <Typography>{selected.name}</Typography>
                    </Box>
                  ) : (
                    "Select Token"
                  );
                }}
              >
                {walletTokenList?.map((token) => (
                  <MenuItem
                    key={token.token_address}
                    value={token.token_address}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TokenImage
                        logoUrl={token?.logo}
                        tokenName={token?.name}
                        className="rounded-full"
                      />

                      <Typography>{token.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-medium leading-7">
                Balance:{" "}
                {sellBalance !== null ? formatZeros(sellBalance) : "Loading..."}
              </p>
              <p className="text-sm font-medium leading-7">
                ${sellTokenTotalUsd.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-fit w-full  gap-2 rounded-lg border-[0.5px] border-gray-300 p-4 shadow-sm dark:border-gray-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium leading-7">Buy Token</p>
              <Select
                sx={{
                  width: "200px",
                  height: "50px",
                }}
                className="text-dark100_light900 !rounded-lg border-[0.5px] border-gray-300 p-2 font-semibold shadow-sm dark:border-gray-700"
                IconComponent={() => <CaretDown size={32} />}
                value={selectedBuyToken?.token_address || ""}
                onChange={(e) => handleSelectBuyTokenChange(e.target.value)}
                renderValue={() => {
                  const selected = walletTokenList?.find(
                    (token) =>
                      token.token_address === selectedBuyToken?.token_address
                  );
                  return selected ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TokenImage
                        logoUrl={selected?.logo}
                        tokenName={selected?.name}
                        className="rounded-full"
                      />

                      <Typography>{selected.name}</Typography>
                    </Box>
                  ) : (
                    "Select Token"
                  );
                }}
              >
                {walletTokenList?.map((token) => (
                  <MenuItem
                    key={token.token_address}
                    value={token.token_address}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TokenImage
                        logoUrl={token?.logo}
                        tokenName={token?.name}
                        className="rounded-full"
                      />
                      <Typography>{token.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-medium leading-7">
                Balance :
                {buyBalance !== null ? formatZeros(buyBalance) : "Loading..."}
              </p>
              <p className="text-sm font-medium leading-7">
                ${buyTokenTotalUsd.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
        {/* amount */}
        <div className="h-fit w-full  gap-2 rounded-lg border-[0.5px] border-gray-300 p-4 shadow-sm dark:border-gray-700">
          <div className="flex w-full items-center justify-between gap-2 ">
            <p className="text-lg font-medium leading-7">Amount</p>
            <div className="flex w-full items-end justify-end">
              <div className="flex flex-col">
                <input
                  value={Amount}
                  onChange={handleAmountChange}
                  style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    transition: "width 0.2s ease",
                  }}
                  // value={displayValue}
                  className="text-end text-2xl font-semibold leading-10 focus:outline-none"
                  placeholder="0.00"
                />
                <div className="flex justify-end">
                  <p className="text-sm text-gray-500">
                    ≈ ${amountInUsd.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token info */}
        <div className="background-light800_darkgradient my-2 flex h-fit w-1/2 items-center justify-between ">
          <div className="flex w-fit items-center justify-center rounded-lg border-[0.5px] border-gray-300 p-2 shadow-sm dark:border-gray-700">
            <TokenImage
              logoUrl={selectedToken?.logo}
              tokenName={selectedToken?.name}
              className="rounded-full"
            />
          </div>
          <ArrowFatLineRight size={38} weight="fill" />
          <div className="flex w-fit items-center justify-center rounded-lg border-[0.5px] border-gray-300 p-2 shadow-sm dark:border-gray-700">
            <TokenImage
              logoUrl={selectedBuyToken?.logo}
              tokenName={selectedBuyToken?.name}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          {selectedToken && selectedBuyToken ? (
            <div className="flex flex-col items-center gap-2">
              <h1>
                You are swapping
                <span className="mx-1 text-lg font-semibold leading-7 text-primary-500">
                  {Amount || "0"} {selectedToken?.symbol}
                </span>
                for
                <span className="mx-1 text-lg font-semibold leading-7 text-primary-500">
                  {isCalculating
                    ? "Calculating..."
                    : swapEstimate
                      ? `${swapEstimate.outputAmount} `
                      : "0 "}
                  {selectedBuyToken?.symbol}
                </span>
              </h1>

              {swapEstimate && (
                <div className="flex flex-col items-center text-sm text-gray-500">
                  <div>
                    Rate: 1 {selectedToken?.symbol} ={" "}
                    {swapEstimate.exchangeRate} {selectedBuyToken?.symbol}
                  </div>
                  {swapEstimate.priceImpact && (
                    <div>Price Impact: {swapEstimate.priceImpact}</div>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {(sellBalance === 0 || !sellBalance) &&
            selectedBuyToken?.token_address && (
              <p className="mt-2 text-sm text-yellow-500">
                Insufficient balance to perform swap
              </p>
            )}

          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="mt-2 w-full px-2">
          <Button
            className="primary-gradient mt-2 h-[40px] !rounded-xl !font-semibold text-light-900"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSwap}
            disabled={isSwapping || isCalculating || !swapEstimate}
          >
            {!isConnected
              ? "Connect Wallet"
              : isSwapping
                ? "Swapping..."
                : isCalculating
                  ? "Calculating..."
                  : "Review Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Trade;
