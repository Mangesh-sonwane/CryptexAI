import axios from "axios";

// Fetch market chart for a specific coin
// export const fetchCoinDetails = async (crypto: string) => {
//   const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
//   try {
//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/coins/${crypto}`,
//       {
//         headers: {
//           "x-api-key": apiKey!, // Ensure this is correct
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching coin details:", error);
//     if (axios.isAxiosError(error)) {
//       // Check if it's an AxiosError
//       console.error(
//         "Axios error details:",
//         error.response?.data || error.message
//       );
//     }
//     throw new Error("Failed to fetch coin details");
//   }
// };

// Fetch detailed coin info (price, market value, etc.)
// export const fetchMarketChart = async (crypto: string, days: number) => {
//   const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
//   try {
//     const response = await axios.get(
//       `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart`,
//       {
//         params: {
//           vs_currency: "usd",
//           days,
//         },
//         headers: {
//           "x-api-key": apiKey!, // Ensure this is correct
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching market chart data:", error);
//     if (axios.isAxiosError(error)) {
//       // Check if it's an AxiosError
//       console.error(
//         "Axios error details:",
//         error.response?.data || error.message
//       );
//     }
//     throw new Error("Failed to fetch market chart data");
//   }
// };

export const fetchCoinDetails = async (crypto: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${crypto}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    if (axios.isAxiosError(error)) {
      // Check if it's an AxiosError
      console.error(
        "Axios error details:",
        error.response?.data || error.message
      );
    }
    throw new Error("Failed to fetch coin details");
  }
};

export const fetchMarketChart = async (crypto: string, days: number) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days,
          interval: "daily", // Default interval for market chart
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching market chart data:", error);
    if (axios.isAxiosError(error)) {
      // Check if it's an AxiosError
      console.error(
        "Axios error details:",
        error.response?.data || error.message
      );
    }
    throw new Error("Failed to fetch market chart data");
  }
};
