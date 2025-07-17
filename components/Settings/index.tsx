"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useAnimationControls,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { GripHorizontal, RefreshCcw } from "lucide-react";
import Select from "./Select";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { SUPPORTED_THEMES } from "@/lib/themes";
import { SUPPORTED_FONT_STYLES } from "@/lib/fonts";
import Choices from "./Choices";
import {
  BASE_COLOR_MODES,
  BASE_FONT_SIZES,
  BASE_PADDING_VALUES,
} from "@/lib/values";
import Switch from "./Switch";
import Picker from "./Picker";
import Angle from "./Angle";
import Actions from "./Actions";

export default function Settings() {
  const [hasMoved, setHasMoved] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  const constraintsRef = useRef(null);

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();
  const isDragging = useMotionValue(false);

  const hasCustomTheme = useStore((state) => state.hasCustomTheme);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  return (
    <>
      <div
        key={`settings-expanded-${hasCustomTheme}`}
        ref={constraintsRef}
        className={cn(
          "fixed bottom-6 left-6 right-6 top-[88px] -z-10",
          "pointer-events-none"
        )}
      />
      <motion.div
        id="settings"
        drag
        dragListener={false}
        dragMomentum={false}
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        onDragStart={() => isDragging.set(true)}
        onDragEnd={(_, info) => {
          isDragging.set(false);

          if (!hasMoved && (info.point.x !== 0 || info.point.y !== 0)) {
            setHasMoved(true);
          }
        }}
        animate={animationControls}
        onUpdate={({ x, y }) => {
          if (hasMoved && x === 0 && y === 0) {
            setHasMoved(false);
          }
        }}
        className={cn(
          "fixed bottom-12 z-40 rounded-xl font-medium",
          "border border-white/20 bg-black/50 shadow-xl shadow-black/40 backdrop-blur-md",
          viewportWidth < 480
            ? "w-[96vw] mx-auto left-[2vw] right-[2vw] max-h-[60vh] overflow-y-auto"
            : viewportWidth < 768
            ? "w-[92vw] mx-auto left-4 right-4 max-h-[80vh] overflow-y-auto"
            : viewportWidth < 1024
            ? "w-[80vw] mx-auto left-0 right-0"
            : "w-[960px]"
        )}
      >
        <DraggableHandle
          dragControls={dragControls}
          animationControls={animationControls}
          hasMoved={hasMoved}
          isDragging={isDragging}
        />
        <div
          className={cn(
            "relative flex-col overflow-hidden rounded-xl px-2 sm:px-4 pb-4 pt-5",
            "border-b border-white/20 bg-black shadow-xl shadow-black/40",
            "transition-all duration-100 ease-in-out",
            hasCustomTheme ? "h-auto sm:h-[211px]" : "h-auto sm:h-[97px]"
          )}
        >
          <BasicSnippetControls />

          {hasCustomTheme && <CustomThemeControls />}
        </div>

        <Actions />
      </motion.div>
    </>
  );
}

function DraggableHandle({
  dragControls,
  animationControls,
  hasMoved,
  isDragging,
}: {
  dragControls: ReturnType<typeof useDragControls>;
  animationControls: ReturnType<typeof useAnimationControls>;
  hasMoved: boolean;
  isDragging: MotionValue<boolean>;
}) {
  const [localIsDragging, setIsLocalDragging] = useState(false);

  useMotionValueEvent(isDragging, "change", (latest) => {
    setIsLocalDragging(latest);
  });

  const icon = useMemo(() => {
    if (!hasMoved || localIsDragging) {
      return <GripHorizontal size={16} aria-hidden="true" />;
    }

    return <RefreshCcw size={14} aria-hidden="true" />;
  }, [hasMoved, localIsDragging]);

  return (
    <motion.div
      onPointerDown={(e) => {
        dragControls.start(e, { snapToCursor: false });
      }}
      onTap={() => {
        if (hasMoved) {
          animationControls.start({
            x: 0,
            y: 0,
          });
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      tabIndex={-1}
      className={cn(
        "absolute -top-[15px] left-1/2 z-50 flex h-7 w-9 items-center justify-center rounded-md",
        "touch-none select-none outline-none",
        "border border-white/20 bg-black",
        "transition-all duration-100 ease-in-out",
        "hover:scale-110 hover:cursor-grab hover:border-almost-white",
        "active:scale-110 active:border-almost-white"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={hasMoved && !localIsDragging ? "refresh" : "grip"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.08, delay: 0.08 }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CustomThemeControls() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.2 }}
      className={cn(
        "flex flex-col sm:flex-row mt-4 justify-evenly gap-4 sm:gap-8 rounded-xl pb-4 pt-5",
        "stripes border border-dashed border-white/20 bg-white/[0.04]",
        isMobile ? "overflow-x-auto" : ""
      )}
    >
      <Control htmlFor="colors" label="Colors">
        <Picker />
      </Control>
      <Control htmlFor="colorMode" label="Color mode">
        <Choices type="colorMode" choices={BASE_COLOR_MODES} />
      </Control>
      <Control htmlFor="gradientAngle" label="Gradient angle">
        <Angle />
      </Control>
      <Control htmlFor="grain" label="Grain">
        <Switch type="grain" />
      </Control>
    </motion.div>
  );
}

function BasicSnippetControls() {
  return (
    <div
      className={cn(
        "flex flex-wrap sm:flex-nowrap justify-center sm:justify-evenly gap-3 sm:gap-4 md:gap-8 px-1 sm:px-0"
      )}
    >
      <Control htmlFor="language" label="Language">
        <Select type="language" options={SUPPORTED_LANGUAGES} />
      </Control>
      <Control htmlFor="theme" label="Theme">
        <Select type="theme" options={SUPPORTED_THEMES} />
      </Control>
      <Control htmlFor="fontFamily" label="Font family">
        <Select type="fontFamily" options={SUPPORTED_FONT_STYLES} />
      </Control>
      <Control htmlFor="fontSize" label="Font Size">
        <Choices type="fontSize" choices={BASE_FONT_SIZES} />
      </Control>
      <Control htmlFor="lineNumbers" label="Line numbers">
        <Switch type="lineNumbers" />
      </Control>
      <Control htmlFor="padding" label="Padding">
        <Choices type="padding" choices={BASE_PADDING_VALUES} />
      </Control>
    </div>
  );
}

function Control({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative flex min-w-max flex-col justify-between gap-3")}
    >
      <label htmlFor={htmlFor} className={cn("text-xs font-bold")}>
        {label}
      </label>
      {children}
    </div>
  );
}
