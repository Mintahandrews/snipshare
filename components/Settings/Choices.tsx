import { useStore } from "@/lib/store";
import { memo, useId } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export default memo(function Choices({
  type,
  choices,
}: {
  type: "fontSize" | "padding" | "colorMode";
  choices: string[];
}) {
  const value = useStore((state) => state[type]);
  const update = useStore((state) => state.update);
  const id = useId();

  return (
    <RadioGroupPrimitive.Root
      id={`${id}-${type}-group`}
      defaultValue={value}
      value={value}
      onValueChange={(value: string) => update(type, value)}
      className={cn("flex h-full items-center justify-center")}
    >
      <div className={cn("flex h-full gap-1 xs:gap-2 sm:gap-3")}>
        {choices.map((choice) => (
          <RadioGroupPrimitive.Item
            key={`${type}-${choice}`}
            id={`${type}-${choice}`}
            value={choice}
            className={cn(
              "flex items-center justify-center rounded-lg px-1 xs:px-2 py-1",
              "text-xs xs:text-sm sm:text-base",
              "select-none outline-none",
              "border border-white/20 bg-black",
              "transition-all duration-100 ease-in-out",
              "hover:text-amlost-white",
              "focus:text-amlost-white focus:ring-1 focus:ring-amlost-white focus:ring-offset-2 focus:ring-offset-black",
              "data-[state=checked]:bg-white/20 data-[state=checked]:text-amlost-white"
            )}
          >
            {choice}
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
});
