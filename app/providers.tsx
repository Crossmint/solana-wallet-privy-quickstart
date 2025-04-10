"use client";

import {
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const crossmintApiKey = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ?? "";

if (!privyAppId || !crossmintApiKey) {
  throw new Error(
    "NEXT_PUBLIC_PRIVY_APP_ID or NEXT_PUBLIC_CROSSMINT_API_KEY is not set"
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["wallet", "email", "google", "passkey"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <CrossmintProvider apiKey={crossmintApiKey}>
        <CrossmintWalletProvider>{children}</CrossmintWalletProvider>
      </CrossmintProvider>
    </PrivyProvider>
  );
}
