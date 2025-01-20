import axios from "axios";

interface SwapStep {
  pool: {
    address: string;
    fee: number;
    type: string;
  };
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
}

interface SwapParams {
  sellToken: string;
  buyToken: string;
  amount: number;
  walletAddress: string;
  slippage?: number;
}

interface SwapPool {
  address: string;
  fee: number;
  type: string;
}

interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

interface SwapRouteStep {
  pool: SwapPool;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
}

interface SwapRoute {
  swaps: SwapRouteStep[];
  gasEstimate: string;
  outputAmount: string;
  totalGasUsed: string;
  expectedOutput: string;
  priceImpact: string;
  routeType: string;
}

interface EnsoSwapResponse {
  tx: {
    data: string;
    to: string;
    value: string;
    from: string;
    gasPrice: string;
    gas: string;
  };
  route: {
    swaps: SwapStep[];
    gasEstimate: string;
    outputAmount: string;
    inputAmount: string;
  };
}

interface QuoteResponse {
  outputAmount: string;
  gasEstimate: string;
  route: SwapRoute;
}

const ENSO_API_URL = "https://api.enso.finance/api/v1/shortcuts";

export const swapTokens = async ({
  sellToken,
  buyToken,
  amount,
  walletAddress,
  slippage = 0.005, // Default 0.5% slippage
}: SwapParams): Promise<EnsoSwapResponse> => {
  try {
    // Convert amount to wei string if needed
    const amountInWei = amount.toString(); // You might need to convert based on token decimals

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENSO_API_KEY}`,
    };

    const payload = {
      chainId: 8453, // Replace with appropriate chain ID (1 for Ethereum mainnet)
      fromAddress: walletAddress,
      inputToken: sellToken,
      outputToken: buyToken,
      amount: amountInWei,
      slippage: slippage * 100, // Convert to percentage
      enableForecall: true, // Optional: enables route simulation
      referralFee: 0, // Optional: referral fee in basis points
    };

    const response = await axios.post<EnsoSwapResponse>(
      `${ENSO_API_URL}/route`,
      payload,
      { headers }
    );

    if (response.status !== 200) {
      throw new Error(`Swap request failed with status ${response.status}`);
    }

    // Validate response data
    if (!response.data?.tx) {
      throw new Error("Invalid response format from Enso API");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Swap failed: ${error.response.data?.message || error.message}`
        );
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
};

// Helper function to estimate gas
export const estimateGas = async (
  txData: EnsoSwapResponse["tx"]
): Promise<string> => {
  try {
    const response = await axios.post(`${ENSO_API_URL}/estimate-gas`, txData, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENSO_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.gasEstimate;
  } catch (error) {
    throw new Error(`Failed to estimate gas ${error}`);
  }
};

// Helper function to get swap quote
export const getSwapQuote = async ({
  sellToken,
  buyToken,
  amount,
  walletAddress,
}: SwapParams): Promise<QuoteResponse> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENSO_API_KEY}`,
    };

    const response = await axios.post<QuoteResponse>(
      `${ENSO_API_URL}/quote`,
      {
        chainId: 1,
        fromAddress: walletAddress,
        inputToken: sellToken,
        outputToken: buyToken,
        amount: amount.toString(),
      },
      { headers }
    );

    return {
      outputAmount: response.data.outputAmount,
      gasEstimate: response.data.gasEstimate,
      route: response.data.route,
    };
  } catch (error) {
    throw new Error(`Failed to get swap quote ${error}`);
  }
};
