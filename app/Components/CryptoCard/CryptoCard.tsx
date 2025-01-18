import Image from "next/image";
import React from "react";
import BTC from "@/app/assets/icons/bitcoin-btc-logo.svg";
import ETH from "@/app/assets/icons/ethereum-eth-logo.svg";
import { formatWithAbbreviation } from "@/constants/format";

interface MarketData {
  current_price: Record<string, number>;
  total_value_locked: number | null;
  mcap_to_tvl_ratio: number | null;
  fdv_to_tvl_ratio: number | null;
  roi: Record<string, number>;
  ath: Record<string, number>;
  ath_change_percentage: Record<string, number>;
  ath_date: Record<string, string>;
  atl: Record<string, number>;
  atl_change_percentage: Record<string, number>;
  atl_date: Record<string, string>;
  market_cap: Record<string, number>;
  market_cap_rank: number;
  fully_diluted_valuation: Record<string, number>;
  market_cap_fdv_ratio: number;
  total_volume: Record<string, number>;
  high_24h: Record<string, number>;
  low_24h: Record<string, number>;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  total_supply: number;
  max_supply: number;
  circulating_supply: number;
}

interface CoinDetails {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  totalSupply: number;
  maxSupply: number;
  circulatingSupply: number;
  market_data: MarketData;
}

interface CryptoCardProps {
  coinDetails: CoinDetails;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ coinDetails }) => {
  const logoSize = coinDetails?.name === "Ethereum" ? 20 : 24;

  const coinLogo =
    coinDetails?.name === "Bitcoin"
      ? BTC
      : coinDetails?.name === "Ethereum"
        ? ETH
        : null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-start gap-2">
        {coinLogo && (
          <Image
            src={coinLogo}
            alt={`${coinDetails?.name} logo`}
            width={logoSize}
            height={logoSize}
            className="mr-2 rounded-full"
          />
        )}
        <h1 className="text-xl font-semibold leading-7">{coinDetails?.name}</h1>
        <p className="text-sm font-normal leading-5">({coinDetails?.symbol})</p>
      </div>
      <div className="flex items-center justify-start gap-4">
        <h1 className="text-2xl font-semibold">
          ${coinDetails?.market_data?.current_price?.usd.toLocaleString()}
        </h1>

        <p
          className={`text-lg font-semibold leading-5 ${
            coinDetails?.market_data.price_change_percentage_24h >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {coinDetails?.market_data.price_change_percentage_24h.toFixed(2)}%
          (1d)
        </p>
      </div>
      <div className="flex gap-2">
        <div className="flex h-[80px] w-[180px] flex-col items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
          <p className="text-light400_light500 text-sm font-normal">
            Market Cap
          </p>
          <p className="text-lg font-semibold">
            $
            {formatWithAbbreviation(
              coinDetails?.market_data?.market_cap?.usd || 0
            )}{" "}
          </p>
        </div>
        <div className="flex h-[80px] w-[180px] flex-col items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
          <p className="text-light400_light500 text-sm font-normal">
            Volume (24h)
          </p>
          <p className="text-lg font-semibold">
            $
            {formatWithAbbreviation(
              coinDetails?.market_data?.total_volume?.usd || 0
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex h-[80px] w-[180px] flex-col items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
          <p className="text-light400_light500 text-sm font-normal">
            Total Supply
          </p>
          <p className="text-lg font-semibold">
            {formatWithAbbreviation(
              coinDetails?.market_data?.total_supply || 0
            )}
            <span className="ml-1">BTC</span>
          </p>
        </div>
        <div className="flex h-[80px] w-[180px] flex-col items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
          <p className="text-light400_light500 text-sm font-normal">
            Max. supply
          </p>
          <p className="text-lg font-semibold">
            {formatWithAbbreviation(coinDetails?.market_data?.max_supply || 0)}
            <span className="ml-1">BTC</span>
          </p>
        </div>
      </div>
      <div className="flex h-[80px] w-full flex-col items-center justify-center gap-2 rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
        <p className="text-light400_light500 text-sm font-normal">
          Circulating supply
        </p>
        <p className="text-lg font-semibold">
          {formatWithAbbreviation(
            coinDetails?.market_data?.circulating_supply || 0
          )}
          <span className="ml-1">BTC</span>
        </p>
      </div>
    </div>
  );
};

export default CryptoCard;
