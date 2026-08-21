import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { motion } from "motion/react";

import { Backdrop } from "../../atoms/backdrop/Backdrop";
import { Headline } from "../../atoms/headline/Headline";

type ModalProps = {
  title: string;
  state: boolean;
  children: React.ReactNode;
  onToggle: VoidFunction;
};

export function Modal({
  title,
  state,
  children,
  onToggle,
}: ModalProps): React.JSX.Element {
  useEffect(() => {
    const body = window.document.body;
    const originalOverflow = body.style.overflow;

    if (state) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = originalOverflow;
    }

    return () => {
      body.style.overflow = originalOverflow;
    };
  }, [state]);

  return (
    <>
      {state && <Backdrop onClick={onToggle} />}
      <AnimatePresence>
        {state && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed top-1/2 left-1/2 -translate-1/2 bg-white rounded-md w-[90%] md:w-125 overflow-hidden z-10 border border-gray-300 shadow-md"
          >
            <div className="py-3 flex items-center justify-between border-b border-b-gray-200 px-5">
              <Headline tag="h4">{title}</Headline>
              <button
                className="inline-block hover:text-red-700"
                onClick={onToggle}
              >
                <X />
              </button>
            </div>
            <div className="py-4 px-5 lg:p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
