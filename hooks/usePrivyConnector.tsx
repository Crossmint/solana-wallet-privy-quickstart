"use client";

import { useEffect } from "react";
import {
  useCrossmint,
  useWallet as useCrossmintWallet,
} from "@crossmint/client-sdk-react-ui";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";

export const usePrivyConnector = () => {
  const { setJwt } = useCrossmint();
  const {
    getOrCreateWallet: getOrCreateCrossmintWallet,
    status: crossmintWalletStatus,
    error: crossmintWalletError,
    wallet: crossmintWallet,
  } = useCrossmintWallet();

  const { ready, authenticated, getAccessToken } = usePrivy();
  const { wallets: privyWallets, ready: privyReady } = useSolanaWallets();

  useEffect(() => {
    const syncPrivyJwt = async () => {
      try {
        const privyJwt = await getAccessToken();
        if (privyJwt != null) {
          setJwt(privyJwt);
        }
      } catch (error) {
        setJwt(undefined);
        console.error("Failed to get Privy JWT:", error);
      }
    };

    if (ready && authenticated) {
      syncPrivyJwt();
    }
  }, [ready, authenticated, getAccessToken, setJwt]);

  const privyEmbeddedWallet =
    privyWallets?.find((wallet) => wallet.walletClientType === "privy") ?? null;

  useEffect(() => {
    const createCrossmintWallet = async () => {
      if (!privyEmbeddedWallet || !authenticated || !ready) {
        return;
      }
      try {
        await getOrCreateCrossmintWallet({
          type: "solana-smart-wallet",
          args: {
            adminSigner: {
              address: privyEmbeddedWallet.address,
              signer: {
                signMessage: privyEmbeddedWallet.signMessage,
                signTransaction: privyEmbeddedWallet.signTransaction as any,
              },
              type: "solana-keypair",
            },
          },
        });
      } catch (error) {
        console.error("Failed to create Crossmint wallet:", error);
      }
    };
    createCrossmintWallet();
  }, [privyEmbeddedWallet, authenticated, ready]);

  return {
    privyEmbeddedWallet,
    crossmintWallet,
    crossmintWalletStatus,
    crossmintWalletError,
    isLoading: crossmintWalletStatus === "in-progress" || !privyReady,
  };
};
