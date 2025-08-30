import { useEffect, useState } from "react";
import Image from "next/image";

export function Timer({
  timeToCount,
  start = false,
  onEnd,
  shift,
}: {
  timeToCount: number;
  start?: boolean;
  onEnd?: () => void;
  shift: number;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(timeToCount);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(timeToCount);
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, [timeToCount]);

  // Start countdown
  useEffect(() => {
    if (!start || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onEnd?.();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    setIntervalId(interval);

    return () => clearInterval(interval);
  }, [start, timeLeft, onEnd, shift]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  return (
    <div className="my-4 flex justify-center pt-8">
      <div className="flex items-center rounded-full border-2 border-purple-600 bg-white px-4 py-2">
        <div>
          <Image
            src="/images/preview/trivia/timmer.png?v=1"
            alt="timer"
            width={35}
            height={35}
            priority
          />
        </div>
        <div className="text-3xl font-semibold text-[#727272]">
          {formatTime(timeLeft / 1000)}
        </div>
      </div>
    </div>
  );
}
