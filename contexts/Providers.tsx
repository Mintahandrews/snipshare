"use client";

import { SessionProvider } from "next-auth/react";
import * as ToolTipPrimitive from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initialize online status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <SessionProvider>
      <ToolTipPrimitive.Provider delayDuration={0}>
        {children}

        {!isOnline && (
          <div
            className={cn(
              "fixed bottom-4 left-0 right-0 mx-auto w-auto max-w-xs p-3",
              "rounded-lg bg-black border border-white/20 text-white text-center font-medium",
              "shadow-lg z-50"
            )}
          >
            You're offline. Some features may be limited.
          </div>
        )}
      </ToolTipPrimitive.Provider>
    </SessionProvider>
  );
}
