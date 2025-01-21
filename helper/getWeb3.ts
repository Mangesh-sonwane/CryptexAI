import Moralis from "moralis";
import { connectMoralis } from "./moralis";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  logo?: string | null;
  token_address: string;
  decimals: number;
  price?: string;
}

interface SwapEstimate {
  outputAmount: string;
  exchangeRate: string;
  priceImpact?: string;
}

export const getWalletTokenDetails = async (
  address: string
): Promise<Token[]> => {
  try {
    await connectMoralis();
    console.log(process.env.NEXT_PUBLIC_MORALIS, "moralis key");

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: "0x2105",
      address,
    });

    // Filter out tokens that do not have logos
    const filteredResponse: Token[] = response.raw.filter(
      (token: Token) => token.logo !== null
    );

    return filteredResponse;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const calculateSwapEstimate = async (
  inputAmount: string,
  sellPrice: number,
  buyPrice: number
): Promise<SwapEstimate> => {
  if (!inputAmount || !sellPrice || !buyPrice) {
    throw new Error("Missing required price data");
  }

  // Convert input to float and handle empty string
  const amount = parseFloat(inputAmount || "0");

  // Calculate USD value of input
  const inputAmountUSD = amount * sellPrice;

  // Calculate estimated output tokens
  const estimatedOutputAmount = buyPrice > 0 ? inputAmountUSD / buyPrice : 0;

  // Calculate exchange rate (1 sell token = X buy tokens)
  const exchangeRate = sellPrice > 0 ? buyPrice / sellPrice : 0;

  // Add a simple price impact calculation (this is a basic example)
  // In reality, you'd want to use liquidity pool data for this
  const priceImpact = amount > 1000 ? "~0.5%" : "< 0.1%";

  return {
    outputAmount: estimatedOutputAmount.toFixed(6),
    exchangeRate: exchangeRate.toFixed(6),
    priceImpact,
  };
};
