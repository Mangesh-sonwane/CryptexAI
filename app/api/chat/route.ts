import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Type Definitions
interface CryptoPrice {
  usd: number;
  usd_24h_change?: number;
  usd_market_cap?: number;
  last_updated_at?: number;
}

interface CryptoPriceResponse {
  [coinId: string]: CryptoPrice;
}

interface FormattedPriceData {
  name: string;
  symbol: string;
  price_usd: number;
  change_24h?: string;
  market_cap?: number;
  last_updated: string;
}

interface CoinDetailedInfo {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  market_data: {
    current_price: { [currency: string]: number };
    market_cap: { [currency: string]: number };
    total_volume: { [currency: string]: number };
    high_24h: { [currency: string]: number };
    low_24h: { [currency: string]: number };
  };
  description?: { en: string };
}

interface CryptoIdentifier {
  id: string;
  name: string;
  symbol: string;
}

const apiKey = process.env.GOOGLE_API_KEY!;
const COINGECKO_API = "https://api.coingecko.com/api/v3";

if (!apiKey) {
  throw new Error(
    "GOOGLE_API_KEY is not defined in the environment variables."
  );
}

// Mapping of crypto identifiers
const cryptoMap: { [key: string]: CryptoIdentifier } = {
  // Symbol mappings
  BTC: { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  ETH: { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  USDT: { id: "tether", name: "Tether", symbol: "USDT" },
  BNB: { id: "binancecoin", name: "BNB", symbol: "BNB" },
  SOL: { id: "solana", name: "Solana", symbol: "SOL" },
  XRP: { id: "ripple", name: "XRP", symbol: "XRP" },
  ADA: { id: "cardano", name: "Cardano", symbol: "ADA" },
  DOGE: { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },

  // Name mappings (lowercase for easy matching)
  bitcoin: { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  ethereum: { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  tether: { id: "tether", name: "Tether", symbol: "USDT" },
  binance: { id: "binancecoin", name: "BNB", symbol: "BNB" },
  solana: { id: "solana", name: "Solana", symbol: "SOL" },
  ripple: { id: "ripple", name: "XRP", symbol: "XRP" },
  cardano: { id: "cardano", name: "Cardano", symbol: "ADA" },
  dogecoin: { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
};

// Function to detect crypto identifiers in text
function detectCryptoIdentifiers(text: string): CryptoIdentifier[] {
  const words = text.toLowerCase().split(/\s+/);
  const identifiers: CryptoIdentifier[] = [];
  const processed = new Set<string>();

  words.forEach((word) => {
    // Check for symbol (case insensitive)
    const upperWord = word.toUpperCase();
    if (cryptoMap[upperWord] && !processed.has(cryptoMap[upperWord].id)) {
      identifiers.push(cryptoMap[upperWord]);
      processed.add(cryptoMap[upperWord].id);
    }

    // Check for name
    if (cryptoMap[word] && !processed.has(cryptoMap[word].id)) {
      identifiers.push(cryptoMap[word]);
      processed.add(cryptoMap[word].id);
    }
  });

  return identifiers;
}

async function getCryptoData(coinIds: string[]): Promise<CryptoPriceResponse> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_last_updated_at=true`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
}

async function getCoinInfo(coinId: string): Promise<CoinDetailedInfo> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching coin info:", error);
    throw error;
  }
}

function formatPriceData(
  data: CryptoPriceResponse,
  identifier: CryptoIdentifier
): FormattedPriceData | null {
  const coinData = data[identifier.id];

  if (!coinData) return null;

  return {
    name: identifier.name,
    symbol: identifier.symbol,
    price_usd: coinData.usd,
    change_24h: coinData.usd_24h_change?.toFixed(2),
    market_cap: coinData.usd_market_cap,
    last_updated: coinData.last_updated_at
      ? new Date(coinData.last_updated_at * 1000).toISOString()
      : new Date().toISOString(),
  };
}

const initialContext = `You are a cryptocurrency and AI assistant that helps users with:
1. Real-time cryptocurrency prices and market data
2. General cryptocurrency questions
3. Guidance on cryptocurrency operations

When users mention cryptocurrencies (by name or symbol), include their current prices and 24h changes.
Format prices clearly with appropriate decimal places and include % for changes.
`;

export async function POST(req: Request): Promise<Response> {
  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: "You will help users with cryptocurrency questions" },
          ],
        },
        {
          role: "model",
          parts: [{ text: initialContext }],
        },
      ],
    });

    // Detect crypto identifiers in the message
    const detectedCryptos = detectCryptoIdentifiers(message);
    let cryptoContext = "";

    if (detectedCryptos.length > 0) {
      // Get real-time data for detected cryptos
      const coinIds = detectedCryptos.map((crypto) => crypto.id);
      const priceData = await getCryptoData(coinIds);

      // Format price data for each detected crypto
      const formattedPrices = detectedCryptos
        .map((crypto) => formatPriceData(priceData, crypto))
        .filter((data): data is FormattedPriceData => data !== null);

      cryptoContext = `\nReal-time cryptocurrency data:\n${JSON.stringify(formattedPrices, null, 2)}\n`;

      // If only one crypto is detected, get more detailed info
      if (detectedCryptos.length === 1) {
        const detailedInfo = await getCoinInfo(detectedCryptos[0].id);
        cryptoContext += `\nAdditional information for ${detailedInfo.name}:\n${JSON.stringify(
          {
            market_cap_rank: detailedInfo.market_cap_rank,
            total_volume_usd: detailedInfo.market_data.total_volume.usd,
            high_24h_usd: detailedInfo.market_data.high_24h.usd,
            low_24h_usd: detailedInfo.market_data.low_24h.usd,
            description: detailedInfo.description?.en?.slice(0, 200) + "...",
          },
          null,
          2
        )}\n`;
      }
    }

    const enhancedMessage = `${message}\n${cryptoContext}`;
    const result = await chat.sendMessage(enhancedMessage);
    const response = await result.response;

    return NextResponse.json({
      reply: response.text(),
      detected_cryptos: detectedCryptos.map((crypto) => ({
        name: crypto.name,
        symbol: crypto.symbol,
      })),
      has_crypto_data: detectedCryptos.length > 0,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
