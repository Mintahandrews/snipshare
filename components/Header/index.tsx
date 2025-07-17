"use client";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import Home from "./Home";
import Message from "./Message";
import Social from "./Social";
import Help from "./Help";
import Auth from "./Auth";
import { useEffect, useState } from "react";

export default function Header() {
  const { status: sessionStatus } = useSession();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    // Set initial value
    if (typeof window !== "undefined") {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkScreenSize);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-12 sm:h-14 md:h-16 items-center justify-between px-2 sm:px-[18px] font-medium",
        "border-b border-white/20 bg-black/95 backdrop-blur-sm shadow-xl shadow-black/40"
      )}
    >
      <Home />

      {/* Only show messages in header on non-small screens */}
      {!isSmallScreen && <Message />}

      {sessionStatus !== "loading" && (
        <div
          className={cn(
            "flex items-center justify-center",
            isSmallScreen ? "gap-0.5" : "gap-1 sm:gap-2"
          )}
        >
          {/* Show message component for small screens in the right group */}
          {isSmallScreen && <Message />}
          <Social />
          <Help />
          <Auth />
        </div>
      )}
    </header>
  );
}
