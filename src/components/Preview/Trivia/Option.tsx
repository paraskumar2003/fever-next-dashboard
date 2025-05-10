import { useEffect, useState } from "react";
import { OptionStatusIcon } from "./OptionStatusIcon";

interface OptionProps {
  option_text: string;
  label: string;
  id: number;
  onSubmit?: (id: number, text: string) => Promise<boolean | null>;
}

export function Option({ option_text, label, id, onSubmit }: OptionProps) {
  const [state, setState] = useState<"correct" | "incorrect" | null>(null);

  const handleSubmit = async (id: number, text: string) => {
    let result = await onSubmit?.(id, text);
    result === true
      ? setState("correct")
      : result === false
        ? setState("incorrect")
        : "";
  };

  // Reset state when option_text changes
  useEffect(() => {
    setState(null);
  }, [option_text]);

  return (
    <button
      type="button"
      className="relative mb-4 flex w-full items-center justify-center rounded-md bg-white"
      onClick={() => handleSubmit(id, option_text)}
    >
      {/* Option Label */}
      <span className="bg-button-gradient absolute left-[-6px] flex h-[55px] w-[55px] items-center justify-center rounded-full font-bold">
        {label}
      </span>

      {/* Option Text */}
      <span
        className={
          "text-md flex-1 rounded-md p-1 py-2 font-medium text-black " +
          (state &&
            (state === "correct" ? "bg-[#04BC32] " : "bg-[#B61313] ") +
              "text-white ")
        }
      >
        <div className="flex items-center justify-center gap-4">
          {state && <OptionStatusIcon state={state} />}
          <span>{option_text}</span>
        </div>
      </span>
    </button>
  );
}
