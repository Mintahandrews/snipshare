import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { memo } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId } from "react";

export default memo(function Switch({
  type,
}: {
  type: "lineNumbers" | "grain";
}) {
  const value = useStore((state) => state[type]);
  const update = useStore((state) => state.update);
  const id = useId();

  return (
    <div className={cn("flex h-full items-center")}>
      <SwitchPrimitive.Root
        id={`${id}-${type}-switch`}
        checked={value}
        onCheckedChange={(value: boolean) => update(type, value)}
        className={cn(
          "inline-flex h-6 w-[44px] shrink-0 items-center rounded-full",
          "outline-none",
          "border border-white/20",
          "transition-all duration-100 ease-in-out",
          "focus:ring-1 focus:ring-amlost-white focus:ring-offset-2 focus:ring-offset-black",
          "data-[state=checked]:bg-white/20 data-[state=unchecked]:bg-black"
        )}
        aria-label={`${type}-switch`}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block h-5 w-5 rounded-full",
            "pointer-events-none outline-none",
            "bg-amlost-white shadow-lg",
            "transition-transform duration-100 ease-in-out",
            "data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-px"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
});
