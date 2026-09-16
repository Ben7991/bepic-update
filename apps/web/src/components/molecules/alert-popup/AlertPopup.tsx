import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheckBig, CircleX, X } from "lucide-react";

import { Headline } from "../../atoms/headline/Headline";
import type { AlertVariant } from "../../../lib/utils/types.utils";

export type AlertPopupProps = {
  variant?: AlertVariant;
  show: boolean;
  headline: string;
  message?: string;
  onToggle: VoidFunction;
};

export function AlertPopup({
  variant,
  headline,
  message,
  show,
  onToggle,
}: AlertPopupProps): React.JSX.Element {
  const isSuccess = variant === "success";
  const timerRef = useRef<number>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout((): void => {
      onToggle();
    }, 3000);
  }, [onToggle]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, translateY: 0 }}
          animate={{ opacity: 1, translateY: "30px" }}
          exit={{ opacity: 0, translateY: 0 }}
          className={`${isSuccess ? "bg-green-100" : "bg-red-100"} fixed left-1/2 -translate-x-1/2 border border-gray-300 rounded-md shadow-lg z-10 p-4 w-[90%] md:w-106.25 lg:w-137.5`}
        >
          <div className="relative flex gap-3">
            <span>
              {isSuccess ? (
                <CircleCheckBig className="text-green-700" />
              ) : (
                <CircleX className="text-red-700" />
              )}
            </span>
            <div className="space-y-1">
              <Headline tag="h5">{headline}</Headline>
              <p>{message}</p>
            </div>
          </div>
          <button
            className="absolute top-3 right-3 hover:text-red-600"
            onClick={onToggle}
            type="button"
          >
            <X />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
