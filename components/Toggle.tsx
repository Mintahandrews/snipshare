import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { memo } from "react";

interface ToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  initialValue: boolean;
  setValue: (_: boolean) => void;
  id?: string;
  'aria-label'?: string;
}

export default memo(function Toggle({ 
  initialValue, 
  setValue, 
  id, 
  'aria-label': ariaLabel, 
  ...props 
}: ToggleProps) {
  return (
    <div className="flex h-[34px] items-center">
      <Switch
        checked={initialValue}
        onChange={setValue}
        className={clsx(
          "flex h-5 w-9 cursor-pointer rounded-full p-1",
          "transition-colors duration-200 ease-in-out",
          "focus:outline-none",
          "ui-checked:bg-blue-600 ui-not-checked:bg-gray-200"
        )}
        id={id}
        aria-label={ariaLabel}
      >
        <span
          className={clsx(
            "pointer-events-none h-full w-3 translate-y-0 rounded-full",
            "bg-white",
            "transform transition-transform duration-200 ease-in-out will-change-transform",
            "ui-checked:translate-x-4"
          )}
        />
      </Switch>
    </div>
  );
});
