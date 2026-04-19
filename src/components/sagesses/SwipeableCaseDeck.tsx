import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { LIFE_CASES, type LifeCase } from "@/data/cases";
import CaseCard from "./CaseCard";

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 400;

type Direction = 1 | -1;

interface Props {
  /** Called when the user picks a case (clicks "Ouvrir la matrice") */
  onPickCase?: (lifeCase: LifeCase, selectedOption: number | null) => void;
  /** Initial case id to display */
  initialCaseId?: string;
}

const SwipeableCaseDeck = ({ onPickCase, initialCaseId }: Props) => {
  const total = LIFE_CASES.length;
  const initialIndex = Math.max(
    0,
    LIFE_CASES.findIndex((c) => c.id === initialCaseId),
  );
  const [index, setIndex] = useState(initialIndex === -1 ? 0 : initialIndex);
  const [direction, setDirection] = useState<Direction>(1);

  const goTo = useCallback(
    (next: number, dir: Direction) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1, -1), [index, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -SWIPE_THRESHOLD || velocity < -SWIPE_VELOCITY) {
      next();
    } else if (offset > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY) {
      prev();
    }
  };

  const current = LIFE_CASES[index];

  return (
    <div className="w-full">
      <div className="relative overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 120, rotate: direction * 4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -direction * 120, rotate: -direction * 4 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <CaseCard
              lifeCase={current}
              onOpenMatrix={(sel) => onPickCase?.(current, sel)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeableCaseDeck;
