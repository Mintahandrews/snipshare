"use client";

import { useSettingsContext } from "@/contexts/SettingsContext";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useAnimationControls, useDragControls, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Select from "./Select";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { SUPPORTED_PADDING_CHOICES, SUPPORTED_THEMES } from "@/lib/themes";
import Toggle from "./Toggle";
import Choices from "./Choices";
import { SUPPORTED_FONT_STYLES } from "@/lib/fonts";
import {
  FontDefinition,
  LanguageDefinition,
  ThemeDefinition,
} from "@/lib/types";

export default function Settings() {
  const [mainDimensions, setMainDimensions] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });

  const [constraints, setConstraints] = useState<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  }>({ top: 0, left: 0, right: 0, bottom: 0 });

  const {
    language,
    setLanguage,
    theme,
    setTheme,
    fontStyle,
    setFontStyle,
    lineNumbers,
    setLineNumbers,
    padding,
    setPadding,
  } = useSettingsContext();

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  useEffect(() => {
    const main = document.getElementById("main");
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMainDimensions({
          height: main!.offsetHeight,
          width: main!.offsetWidth,
        });

        animationControls.start({
          x: 0,
          y: 0,
        });
      }, 500);
    };

    setMainDimensions({ height: main!.offsetHeight, width: main!.offsetWidth });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const settings = document.getElementById("settings");
    if (!settings) return;

    // Calculate horizontal constraints based on the centered position
    const horizontalConstraint = Math.max(
      mainDimensions.width / 2 - settings.offsetWidth / 2,
      mainDimensions.width * 0.1
    );

    setConstraints({
      top: -settings.offsetTop + 24,
      // Allow movement within a reasonable range from center
      left: -horizontalConstraint,
      right: horizontalConstraint,
      bottom:
        mainDimensions.height -
        settings.offsetHeight -
        settings.offsetTop -
        24,
    });
  }, [mainDimensions.height, mainDimensions.width]);

  // Set initial position to center
  useEffect(() => {
    // Set initial position to center after component mounts
    if (mainDimensions.width > 0) {
      animationControls.start({
        x: 0,
        y: 0
      });
    }
  }, [animationControls, mainDimensions.width]);

  return (
    <motion.section
      id="settings"
      drag
      dragListener={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragConstraints={constraints}
      animate={animationControls}
      initial={{ x: 0, y: 0 }}
      className={clsx(
        "fixed z-10 rounded-xl p-3 sm:p-4 md:p-5 text-xs",
        "transition-opacity duration-200 ease-in-out will-change-transform",
        "border-[1px] border-white/20 bg-black text-white/70 opacity-50 shadow-xl",
        "focus-within:opacity-100 hover:opacity-100",
        "left-1/2 -translate-x-1/2", // Center horizontally
        "bottom-16 sm:bottom-24 md:bottom-32",
        "max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] overflow-x-auto"
      )}
    >
      <motion.div
        onPointerDown={(e) => dragControls.start(e, { snapToCursor: false })}
        whileTap={{
          cursor: "grabbing",
        }}
        className={clsx(
          "absolute -top-[10px] left-1/2 py-[1px] px-[6px]",
          "rounded-md border-[1px] border-white/20 bg-black",
          "transition-all duration-200 ease-in-out will-change-transform",
          "hover:scale-150 hover:cursor-grab hover:bg-gray-800 focus:outline-none"
        )}
      >
        <DragHandleDots2Icon className="rotate-90" />
      </motion.div>
      <div className={clsx("flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8", "")}>
        <div className="flex flex-col gap-1">
          <label htmlFor="language-select" className="text-sm font-medium">Language</label>
          <Select
            id="language-select"
            type="language"
            initialValue={language}
            setValue={
              setLanguage as (
                _: LanguageDefinition | ThemeDefinition | FontDefinition
              ) => void
            }
            options={SUPPORTED_LANGUAGES}
            aria-label="Select programming language"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="theme-select" className="text-sm font-medium">Theme</label>
          <Select
            id="theme-select"
            type="theme"
            initialValue={theme}
            setValue={
              setTheme as (
                _: LanguageDefinition | ThemeDefinition | FontDefinition
              ) => void
            }
            options={SUPPORTED_THEMES}
            aria-label="Select color theme"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="font-select" className="text-sm font-medium">Font</label>
          <Select
            id="font-select"
            type="font"
            initialValue={fontStyle}
            setValue={
              setFontStyle as (
                _: LanguageDefinition | ThemeDefinition | FontDefinition
              ) => void
            }
            options={SUPPORTED_FONT_STYLES}
            aria-label="Select font style"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Toggle 
              id="line-numbers-toggle"
              initialValue={lineNumbers} 
              setValue={setLineNumbers} 
              aria-label="Toggle line numbers"
            />
            <label htmlFor="line-numbers-toggle" className="text-sm font-medium">Line Numbers</label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="padding-choices" className="text-sm font-medium">Padding</label>
          <Choices
            id="padding-choices"
            initialValue={padding}
            setValue={setPadding}
            choices={SUPPORTED_PADDING_CHOICES}
            aria-label="Select padding size"
          />
        </div>
      </div>
    </motion.section>
  );
}
