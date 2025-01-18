import type { PrivyClientConfig } from "@privy-io/react-auth";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    // Determines when to create wallets for users
    createOnLogin: "all-users", // Could also be "users-without-wallets"
    requireUserPasswordOnCreate: true, // Ensures additional security
    showWalletUIs: true, // Show wallet UI in the embedded wallet interface
  },
  loginMethods: ["wallet", "email", "google", "github"], // Enable Wallet, Email, and SMS login
  appearance: {
    showWalletLoginFirst: true, // Display wallet login option first
    theme: "light", // Light theme
    accentColor: "#FF7000", // Accent color for branding
  },
};
