import Moralis from "moralis";

let moralisClient: typeof Moralis;

export const connectMoralis = async () => {
  try {
    if (!Moralis.Core.isStarted) {
      console.log("🚀 Connecting to Moralis...");

      await Moralis.start({
        apiKey: `${process.env.NEXT_PUBLIC_MORALIS}`,
      });

      moralisClient = Moralis;
    }
    console.log("🚀 Connected to Moralis...");

    return moralisClient;
  } catch (e) {
    const err = e as Error;
    console.error("failed to connect to moralis", err.message);
    throw err;
  }
};
