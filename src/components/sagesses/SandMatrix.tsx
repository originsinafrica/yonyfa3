import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { LIFE_CASES, type LifeCase } from "@/data/cases";
import DotIdeogram from "./DotIdeogram";
import SignDisplay from "./SignDisplay";
import SwipeableCaseDeck from "./SwipeableCaseDeck";
import AudioRecorder from "./AudioRecorder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Phase = "case" | "matrix" | "revealed";

interface RevealedCell {
  row: number;
  col: number;
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  axisXWord: string;
  axisYWord: string;
}

const SandMatrix = () => {
  const [phase, setPhase] = useState<Phase>("case");
  const [lifeCase, setLifeCase] = useState<LifeCase | null>(null);
  const [intuitiveChoice, setIntuitiveChoice] = useState<number | null>(null);
  const [shuffledX, setShuffledX] = useState(() => shuffle(SIGNS));
  const [shuffledY, setShuffledY] = useState(() => shuffle(SIGNS));
  const [revealed, setRevealed] = useState<RevealedCell | null>(null);
  const [caseOpen, setCaseOpen] = useState(false);
  const [finalChoice, setFinalChoice] = useState<number | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  const restart = useCallback(() => {
    setLifeCase(null);
    setIntuitiveChoice(null);
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setRevealed(null);
    setFinalChoice(null);
    setPhase("case");
  }, []);

  const handlePickCase = useCallback(
    (picked: LifeCase, selectedOption: number | null) => {
      setLifeCase(picked);
      setIntuitiveChoice(selectedOption);
      setPhase("matrix");
    },
    [],
  );

  /** Triggered by the close button on the revealed card */
  const requestCloseRevealed = useCallback(() => {
    setConfirmCloseOpen(true);
  }, []);

  /** Confirmed: discard the reveal and go back to the swipeable case deck */
  const confirmCloseRevealed = useCallback(() => {
    setConfirmCloseOpen(false);
    setRevealed(null);
    setIntuitiveChoice(null);
    setFinalChoice(null);
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setLifeCase(null);
    setPhase("case");
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const signX = shuffledX[col];
      const signY = shuffledY[row];
      const matrixRow = signY.valueIndex;
      const matrixCol = valueToMatrixIndex(signX.value);
      const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "";
      const axisXWord = DYNAMICS_AXIS[matrixCol] ?? "";
      const axisYWord = DYNAMICS_AXIS[matrixRow] ?? "";
      setRevealed({ row, col, signX, signY, dynamicWord, axisXWord, axisYWord });
      setPhase("revealed");
    },
    [shuffledX, shuffledY]
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {/* PHASE 1 — Case card */}
        {phase === "case" && (
          <motion.div
            key="case"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <SwipeableCaseDeck
              initialCaseId={lifeCase?.id}
              onPickCase={handlePickCase}
            />
          </motion.div>
        )}

        {/* PHASE 2 — Matrix */}
        {phase === "matrix" && lifeCase && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-6" />
            <div className="overflow-x-auto">
              <div
                className="grid gap-[2px] min-w-[400px]"
                style={{ gridTemplateColumns: `repeat(16, 1fr)` }}
              >
                {shuffledY.map((_, row) =>
                  shuffledX.map((_, col) => (
                    <motion.button
                      key={`${row}-${col}`}
                      onClick={() => handleCellClick(row, col)}
                      className="aspect-square rounded-[3px] transition-all duration-200 cursor-pointer bg-[hsl(40,20%,96%)] hover:bg-[hsl(40,15%,92%)]"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      aria-label={`Case ${row + 1}-${col + 1}`}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setPhase("case")}
                className="text-xs underline"
                style={{ color: "hsl(30, 8%, 45%)" }}
              >
                ← Revenir à la situation
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3 — Revealed sign (Living Editorial design) */}
        {phase === "revealed" && revealed && lifeCase && (
          <motion.div
            key={`revealed-${revealed.row}-${revealed.col}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative font-body rounded-xl overflow-hidden bg-[#ffffff] p-6 md:p-10 lg:p-14"
            style={{
              boxShadow: "0 20px 60px rgba(45, 47, 47, 0.08)",
              color: "#2d2f2f",
            }}
          >
            {/* Close — orange accent */}
            <button
              onClick={requestCloseRevealed}
              aria-label="Fermer"
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
              style={{
                background: "#f0f1f1",
                color: "#e87a1d",
                border: "1px solid rgba(232, 122, 29, 0.25)",
              }}
            >
              <X size={18} />
            </button>

            {/* Collapsible case reminder */}
            <div className="mb-8 mr-14">
              <button
                onClick={() => setCaseOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-90"
                style={{ background: "#f0f1f1" }}
                aria-expanded={caseOpen}
              >
                <span className="flex items-center gap-3 text-left">
                  <span className="text-base">{lifeCase.emoji}</span>
                  <span
                    className="font-label text-[10px] uppercase tracking-[0.2em] font-bold"
                    style={{ color: "#5a5c5c" }}
                  >
                    Rappel du cas
                  </span>
                  <span
                    className="font-headline italic text-sm truncate"
                    style={{ color: "#fbd115" }}
                  >
                    — {lifeCase.label}
                  </span>
                </span>
                {caseOpen ? (
                  <ChevronUp size={16} style={{ color: "#5a5c5c" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "#5a5c5c" }} />
                )}
              </button>
              <AnimatePresence initial={false}>
                {caseOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pt-4 pb-2">
                      <p
                        className="font-headline text-base md:text-lg leading-snug mb-3"
                        style={{ color: "#00693e" }}
                      >
                        {lifeCase.situation}
                      </p>
                      <blockquote
                        className="italic text-sm leading-relaxed pl-4 mb-3"
                        style={{
                          borderLeft: "3px solid #fbd115",
                          color: "rgba(45, 47, 47, 0.85)",
                        }}
                      >
                        {lifeCase.narrative[0]} {lifeCase.narrative[1]}
                      </blockquote>
                      <p
                        className="font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-2"
                        style={{ color: "#5a5c5c" }}
                      >
                        Les 4 propositions — ton intuition initiale
                      </p>
                      <ul className="space-y-1.5">
                        {lifeCase.options.map((opt, i) => {
                          const isPicked = intuitiveChoice === i;
                          return (
                            <li
                              key={i}
                              className="text-sm leading-relaxed flex gap-2"
                              style={{
                                color: isPicked ? "#00693e" : "#2d2f2f",
                                fontWeight: isPicked ? 600 : 400,
                              }}
                            >
                              <span
                                className="font-bold"
                                style={{ color: "#fbd115" }}
                              >
                                {String.fromCharCode(65 + i)}.
                              </span>
                              <span>{opt}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Domain label + Benin flag dots */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-label text-xs tracking-[0.2em] uppercase font-bold"
                style={{ color: "#5a5c5c" }}
              >
                Signe révélé
              </span>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#008751" }} />
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#fcd116" }} />
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: "#e8112d" }} />
              </div>
            </div>

            {/* Editorial title */}
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-headline text-4xl md:text-5xl lg:text-6xl text-center leading-tight mb-10"
              style={{ color: "#00693e" }}
            >
              {revealed.signX.name} {revealed.signY.name}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-col items-center justify-center rounded-xl p-8"
                style={{ background: "#f0f1f1" }}
              >
                <DotIdeogram
                  leftCode={revealed.signX.code}
                  rightCode={revealed.signY.code}
                  size={220}
                  color="#2d2f2f"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <SignDisplay
                  signXIdx={revealed.signX.index}
                  signYIdx={revealed.signY.index}
                  signXName={revealed.signX.name}
                  signYName={revealed.signY.name}
                  dynamicWord={revealed.dynamicWord}
                />
              </motion.div>
            </div>

            {/* Values formula — editorial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="my-10 flex items-center gap-4"
            >
              <div className="flex-1 h-px" style={{ background: "rgba(0, 105, 62, 0.2)" }} />
              <div className="text-center px-3">
                <p
                  className="font-label text-[10px] uppercase tracking-[0.2em] mb-2 font-bold"
                  style={{ color: "#5a5c5c" }}
                >
                  Résonances à explorer
                </p>
                <p className="font-headline text-lg md:text-xl flex items-center justify-center gap-3 flex-wrap">
                  <span style={{ color: "#00693e" }}>{revealed.axisYWord}</span>
                  <span style={{ color: "#5a5c5c" }}>×</span>
                  <span style={{ color: "#fbd115" }}>{revealed.axisXWord}</span>
                  <span style={{ color: "#5a5c5c" }}>=</span>
                  <span style={{ color: "#e8112d" }}>{revealed.dynamicWord}</span>
                </p>
              </div>
              <div className="flex-1 h-px" style={{ background: "rgba(0, 105, 62, 0.2)" }} />
            </motion.div>

            {/* Final choice + Audio interpretation — 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* LEFT — Final choice */}
              <div
                className="rounded-xl p-6"
                style={{
                  background: "#ffffff",
                  boxShadow: "inset 0 0 0 1px rgba(0, 105, 62, 0.35)",
                }}
              >
                <p
                  className="font-label text-xs uppercase tracking-[0.2em] font-bold"
                  style={{ color: "#00693e" }}
                >
                  Ton choix définitif
                </p>
                <p className="text-sm mt-1 mb-4" style={{ color: "#5a5c5c" }}>
                  À la lumière de ce signe, quelle voie choisis-tu ?
                </p>
                <div className="flex flex-col gap-2.5">
                  {lifeCase.options.map((opt, i) => {
                    const isFinal = finalChoice === i;
                    const wasIntuition = intuitiveChoice === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setFinalChoice(i)}
                        className="text-left p-3 rounded-xl text-sm transition-all flex gap-2 items-start"
                        style={{
                          background: isFinal ? "#ffffff" : "#f0f1f1",
                          boxShadow: isFinal
                            ? "inset 0 0 0 2px #00693e"
                            : "inset 0 0 0 1px rgba(172,173,173,0.15)",
                          color: isFinal ? "#00693e" : "#2d2f2f",
                          fontWeight: isFinal ? 600 : 400,
                        }}
                      >
                        <span className="font-bold" style={{ color: "#fbd115" }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {wasIntuition && (
                          <span
                            className="font-label text-[9px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(251, 209, 21, 0.18)",
                              color: "#a07d00",
                            }}
                          >
                            intuition
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — Audio recorder */}
              <AudioRecorder />
            </motion.div>

            {/* Restart + Transmit */}
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <button
                onClick={restart}
                className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-xs uppercase tracking-[0.15em] transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "#f0f1f1",
                  color: "#2d2f2f",
                }}
              >
                <RotateCcw size={14} /> Nouveau cas
              </button>
              <button
                onClick={() => {}}
                className="px-8 py-3 rounded-md font-bold text-xs uppercase tracking-[0.15em] text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, #00693e 0%, #005c36 100%)",
                  boxShadow: "0 12px 30px rgba(0, 105, 62, 0.25)",
                }}
              >
                Transmettre ma sagesse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fermer ce signe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Tu vas revenir au défilement des cas de vie. Le signe révélé et
              ton choix seront perdus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rester sur le signe</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseRevealed}>
              Revenir aux cas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SandMatrix;
