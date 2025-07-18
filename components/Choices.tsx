import { ChoiceDefinition } from "@/lib/types";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { memo } from "react";

interface ChoicesProps {
  choices: ChoiceDefinition[];
  initialValue: ChoiceDefinition;
  setValue: (value: ChoiceDefinition) => void;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

export default memo(function Choices({
  choices,
  initialValue,
  setValue,
  id,
  'aria-label': ariaLabel,
  className,
  ...props
}: ChoicesProps) {
  return (
    <RadioGroup<"div", ChoiceDefinition>
      as="div"
      value={initialValue}
      onChange={setValue}
      id={id}
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      <div className="flex gap-3 py-[7px] text-sm" role="radiogroup">
        {choices.map((choice) => (
          <RadioGroup.Option
            key={choice.label}
            value={choice}
            className={clsx("cursor-pointer select-none rounded-md")}
          >
            <span
              className={clsx(
                "rounded-md py-1 px-2",
                "transition-colors duration-100 ease-in-out",
                "ui-checked:bg-blue-100 ui-checked:text-blue-800 dark:ui-checked:bg-blue-900/30 dark:ui-checked:text-blue-200",
                "ui-not-checked:bg-transparent ui-not-checked:text-gray-700 dark:ui-not-checked:text-gray-300"
              )}
            >
              {choice.label}
            </span>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
});
