import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import SandMatrix from "@/components/sagesses/SandMatrix";
import SynchronicityWall from "@/components/sagesses/SynchronicityWall";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sagesses du Bénin" },
      {
        name: "description",
        content:
          "Sagesses du Bénin — explorez la matrice du Fâ et le mur des consultations.",
      },
      { property: "og:title", content: "Sagesses du Bénin" },
      {
        property: "og:description",
        content:
          "Sagesses du Bénin — explorez la matrice du Fâ et le mur des consultations.",
      },
    ],
  }),
});

type Tab = "matrice" | "mur";

const TABS: { id: Tab; label: string }[] = [
  { id: "matrice", label: "Matrice des choix" },
  { id: "mur", label: "Mur des consultations" },
];

const SUBTITLES: Record<Tab, string> = {
  matrice:
    "Tirez dans la matrice pour révéler un signe combiné du Fâ. Chaque case mêle deux des 16 signes mères, ouvrant une dynamique unique à explorer.",
  mur: "Un mur vivant de sagesses partagées. Laissez un visage vous appeler.",
};

function Index() {
  const [tab, setTab] = useState<Tab>("matrice");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-10 pb-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4 text-foreground">
              Sagesses du Bénin
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-full bg-muted border border-border">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-full transition-all"
                  style={{
                    color:
                      tab === t.id
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted-foreground))",
                    background:
                      tab === t.id ? "hsl(var(--foreground))" : "transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {tab === "matrice" ? <SandMatrix /> : <SynchronicityWall />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
