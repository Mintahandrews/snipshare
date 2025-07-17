import { cn } from "@/lib/cn";
import { debounce } from "@/lib/debounce";
import { useStore } from "@/lib/store";
import { HexColorInput, HexColorPicker } from "react-colorful";
import Popover from "../ui/Popover";
import { Minus, Plus } from "lucide-react";
import chroma from "chroma-js";
import { useEffect, useState } from "react";

export default function Picker() {
  const customColors = useStore((state) => state.customColors);
  const setCustomColor = useStore((state) => state.setCustomColor);
  const addCustomColor = useStore((state) => state.addCustomColor);
  const removeCustomColor = useStore((state) => state.removeCustomColor);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "flex h-8 w-full sm:w-28 gap-2 rounded-lg justify-center sm:justify-start"
      )}
    >
      {customColors.map((color, i) => (
        <div key={i} className={cn("relative", "group")}>
          <Popover
            content={
              <SingleColor
                color={color}
                setCustomColor={(newColor) => setCustomColor(newColor, i)}
                isMobile={isMobile}
              />
            }
            sideOffset={12}
          >
            <button
              className={cn(
                "h-full w-8 sm:w-8 overflow-hidden rounded-lg",
                "outline-none",
                "border-2 border-white/20",
                "transition-all animate-in zoom-in duration-100 ease-in-out",
                "focus:ring-1 focus:ring-amlost-white focus:ring-offset-2 focus:ring-offset-black",
                "active:ring-1 active:ring-amlost-white active:ring-offset-2 active:ring-offset-black"
              )}
              style={{
                background: color,
              }}
              aria-label={`Edit color ${i + 1}`}
            />
          </Popover>

          {customColors.length > 1 && (
            <button
              onClick={() => removeCustomColor(i)}
              className={cn(
                "absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full",
                "select-none outline-none",
                "border border-white/20 bg-black",
                "transition-all animate-in zoom-in duration-100 ease-in-out",
                "hover:border-amlost-white hover:text-amlost-white",
                "active:border-amlost-white active:text-amlost-white",
                isMobile ? "flex" : "hidden group-hover:flex"
              )}
              aria-label={`Remove color ${i + 1}`}
            >
              <Minus size={12} aria-hidden="true" />
              <span className="sr-only">Remove color</span>
            </button>
          )}
        </div>
      ))}

      {customColors.length < 3 && (
        <button
          onClick={() => addCustomColor(chroma.random().hex())}
          className={cn(
            "flex h-full w-8 sm:w-8 items-center justify-center rounded-lg",
            "select-none outline-none",
            "border-2 border-white/20",
            "transition-all duration-100 ease-in-out",
            "hover:border-amlost-white hover:text-amlost-white",
            "active:border-amlost-white active:text-amlost-white",
            "focus:text-amlost-white focus:outline-1 focus:outline-offset-2 focus:outline-amlost-white"
          )}
          aria-label="Add color"
        >
          <Plus size={12} aria-hidden="true" />
          <span className="sr-only">Add color</span>
        </button>
      )}
    </div>
  );
}

function SingleColor({
  color,
  setCustomColor,
  isMobile,
}: {
  color: string;
  setCustomColor: (color: string) => void;
  isMobile?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-3",
        "picker",
        isMobile ? "w-[250px]" : "w-auto"
      )}
    >
      <HexColorPicker color={color} onChange={debounce(setCustomColor, 300)} />

      <HexColorInput
        color={color}
        onChange={debounce(setCustomColor, 300)}
        className={cn(
          "text-center font-medium uppercase",
          "outline-none p-1",
          "bg-transparent text-amlost-white/40",
          "transition-all duration-100 ease-in-out",
          "focus:text-amlost-white",
          "h-8 rounded-md",
          "border border-transparent",
          "focus:border-white/20"
        )}
        aria-label="Color hex value"
      />
    </section>
  );
}
