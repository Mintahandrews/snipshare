import { useStore } from "@/lib/store";
import { useEffect, useMemo, useRef, useState } from "react";
import chroma from "chroma-js";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [marginTop, setMarginTop] = useState(15);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasCustomTheme = useStore((state) => state.hasCustomTheme);
  const code = useStore((state) => state.code);
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const fontFamily = useStore((state) => state.fontFamily);
  const fontSize = useStore((state) => state.fontSize);
  const lineNumbers = useStore((state) => state.lineNumbers);
  const customColors = useStore((state) => state.customColors);
  const update = useStore((state) => state.update);
  const colorMode = useStore((state) => state.colorMode);
  const padding = useStore((state) => state.padding);
  const angle = useStore((state) => state.angle);
  const grain = useStore((state) => state.grain);

  const baseColors = useMemo(() => {
    return hasCustomTheme ? customColors : theme.baseColors;
  }, [hasCustomTheme, theme.baseColors, customColors]);

  const gradientColors = useMemo(() => {
    return baseColors.length === 1
      ? [...baseColors, baseColors[0]]
      : chroma
          .scale(baseColors)
          .mode(colorMode)
          .colors(baseColors.length + (baseColors.length - 1));
  }, [baseColors, colorMode]);

  // Initialize sizes on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const newViewportHeight = window.innerHeight;
        const newViewportWidth = window.innerWidth;
        const divHeight = wrapperRef.current.clientHeight;
        const heightPercentage = (divHeight / newViewportHeight) * 100;

        setViewportWidth(newViewportWidth);
        setViewportHeight(newViewportHeight);

        // Dynamic margin calculation based on screen size and content
        let newMarginTop = 15; // Default margin

        if (newViewportWidth < 480) {
          // Small mobile devices
          newMarginTop = Math.max(1, 5 - heightPercentage / 20);
        } else if (newViewportWidth < 768) {
          // Mobile devices
          newMarginTop = Math.max(2, 6 - heightPercentage / 15);
        } else if (newViewportWidth < 1024) {
          // Tablet devices
          newMarginTop = Math.max(3, 8 - heightPercentage / 12);
        } else if (heightPercentage > 40) {
          // Desktop with tall content
          const excessPercentage = heightPercentage - 40;
          const marginTopReduction = excessPercentage / 0.5;
          newMarginTop = Math.max(2, 15 - marginTopReduction * 0.35);
        }

        // Apply a more specific adjustment for very small screens
        if (newViewportWidth < 360) {
          newMarginTop = Math.max(0.5, newMarginTop - 1);
        }

        if (newMarginTop !== marginTop) {
          setMarginTop(newMarginTop);
        }
      }
    };

    if (isReady && wrapperRef.current) {
      const observer = new ResizeObserver(updateSize);
      observer.observe(wrapperRef.current);
      window.addEventListener("resize", updateSize);
      updateSize(); // Call initially

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateSize);
      };
    }
  }, [marginTop, isReady]);

  // Calculate padding based on screen size
  const responsivePadding = useMemo(() => {
    if (viewportWidth < 360) return Math.max(4, +padding / 4);
    if (viewportWidth < 480) return Math.max(8, +padding / 3);
    if (viewportWidth < 768) return Math.max(12, +padding / 2);
    return +padding;
  }, [viewportWidth, padding]);

  if (!isReady) {
    return null; // Prevent layout shift by not rendering until we have viewport dimensions
  }

  return (
    <motion.div
      ref={wrapperRef}
      layoutId="wrapper"
      animate={{
        opacity: 1,
        transition: { duration: 0.1, delay: 0.05 },
      }}
      initial={{ opacity: 0 }}
      className={cn(
        "overflow-hidden",
        "shadow-xl shadow-black/40",
        viewportWidth < 360
          ? "w-[95vw]"
          : viewportWidth < 480
          ? "w-[92vw]"
          : viewportWidth < 768
          ? "w-[90vw]"
          : "w-auto"
      )}
      style={{
        marginTop: `${marginTop}vh`,
        borderRadius: viewportWidth < 768 ? 6 : 8 + +padding / 10,
      }}
    >
      <div
        id="screenshot"
        className={cn(
          "relative z-0 w-auto",
          viewportWidth < 360
            ? "min-w-[220px] max-w-full"
            : viewportWidth < 480
            ? "min-w-[260px] max-w-full"
            : viewportWidth < 768
            ? "min-w-[300px] max-w-full"
            : "min-w-[512px] max-w-[5xl]",
          "transition-all duration-100 ease-in-out"
        )}
        style={{
          padding: `${responsivePadding}px`,
          backgroundImage: `linear-gradient(${angle}deg, ${gradientColors.join(
            ", "
          )})`,
        }}
      >
        <div
          className={cn(
            "invisible absolute inset-0",
            "bg-noise bg-contain opacity-30",
            grain && "visible"
          )}
        />

        <div
          className={cn(
            "relative z-[1] h-full w-full",
            viewportWidth < 360
              ? "min-w-[200px]"
              : viewportWidth < 480
              ? "min-w-[240px]"
              : viewportWidth < 768
              ? "min-w-[280px]"
              : "min-w-[480px] max-w-2xl",
            "rounded-lg"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-lg",
              "after:absolute after:inset-0 after:z-[2] after:translate-y-6 after:rounded-xl after:bg-black/60 after:blur-xl"
            )}
          >
            <div
              className={cn("absolute inset-0 z-[3] rounded-lg")}
              style={{
                backgroundImage: `linear-gradient(${angle}deg, ${gradientColors.join(
                  ", "
                )})`,
              }}
            />
          </div>
          <div className={cn("relative z-[4] rounded-lg", "bg-black/70")}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
