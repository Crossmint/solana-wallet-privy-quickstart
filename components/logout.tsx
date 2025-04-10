"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LogoutButton() {
  const { logout } = usePrivy();

  return (
    <button
      className="w-full py-2 px-4 rounded-md text-sm font-medium border bg-gray-50 hover:bg-gray-100 transition-colors"
      onClick={() => {
        logout();
        window.location.reload();
      }}
    >
      Log out
    </button>
  );
}
