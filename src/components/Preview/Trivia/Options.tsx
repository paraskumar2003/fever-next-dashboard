import { useEffect, useState } from "react";
import { Option as OptionType } from "./types";
import { Option } from "./Option";

export function Options({
  options,
  onSelect,
}: {
  options: OptionType[];
  onSelect?: (id: number, text: string) => Promise<boolean>;
}) {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const handleSubmit = async (
    id: number,
    text: string,
  ): Promise<boolean | null> => {
    if (!onSelect || isAnswerSubmitted) return null; // Prevent multiple submissions
    setIsAnswerSubmitted(true); // Mark as submitted before awaiting
    return (await onSelect(id, text)) ?? null; // Ensure a boolean return
  };

  useEffect(() => {
    setIsAnswerSubmitted(false);
  }, [options]);

  return (
    <div className="grid w-full gap-4 px-12 py-4">
      {options.map((o, i) => (
        <Option
          option_text={o.option_text}
          label={o.label || String(i + 1)}
          onSubmit={handleSubmit}
          id={i}
          key={i}
        />
      ))}
    </div>
  );
}
