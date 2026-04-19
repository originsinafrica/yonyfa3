import { motion } from "framer-motion";
import { resolveFaSign, type SignMeaning } from "@/data/signMeanings";

interface Props {
  signXIdx: number;
  signYIdx: number;
  /** Compact mode: smaller image, shorter text */
  compact?: boolean;
  /** Fallback context used when no curated meaning exists yet */
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}

/**
 * Displays the authentic Fa sign representation extracted from the PDF
 * along with its reformulated meaning (proverb, essence, vigilance, engagement).
 *
 * For undocumented signs (100-256) or partially documented ones, a contextual
 * description is generated from the combined name + dynamic word so the card
 * never falls back to a "coming soon" placeholder.
 */
const SignDisplay = ({
  signXIdx,
  signYIdx,
  compact = false,
  signXName,
  signYName,
  dynamicWord,
}: Props) => {
  const meaning: SignMeaning | null = resolveFaSign(signXIdx, signYIdx);

  // Build a graceful fallback: name + a contextual sentence
  const combinedName =
    meaning?.name ??
    (signXName && signYName ? `${signXName}-${signYName}` : "Signe combiné");

  const fallbackEssence = buildFallbackEssence({
    signXName,
    signYName,
    dynamicWord,
  });

  const essence = meaning?.essence?.trim() || fallbackEssence;
  const proverb = meaning?.proverb?.trim() || null;
  const vigilance = meaning?.vigilance?.trim() || null;
  const engagement = meaning?.engagement?.trim() || null;
  const isMother = meaning?.tier === "mother";



  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="font-body rounded-xl p-6"
      style={{
        background: "#ffffff",
        boxShadow: "inset 0 0 0 1px rgba(172, 173, 173, 0.25)",
      }}
    >
      <div>
        <h4
          className="font-headline text-2xl md:text-3xl leading-tight"
          style={{ color: "#00693e" }}
        >
          {combinedName}
        </h4>
        {proverb && (
          <blockquote
            className="italic text-sm md:text-base mt-3 leading-relaxed pl-4"
            style={{
              borderLeft: "3px solid #fbd115",
              color: "rgba(45, 47, 47, 0.85)",
            }}
          >
            « {proverb} »
          </blockquote>
        )}
        <p
          className="mt-4 text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(45, 47, 47, 0.9)" }}
        >
          {essence}
        </p>
        {isMother && (
          <div className="mt-4">
            <span
              className="inline-block font-label text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(251, 209, 21, 0.18)",
                color: "#a07d00",
                border: "1px solid rgba(251, 209, 21, 0.4)",
              }}
            >
              Signe mère
            </span>
          </div>
        )}
      </div>

      {!compact && (vigilance || engagement) && (
        <div
          className="mt-5 pt-5 space-y-4"
          style={{ borderTop: "1px solid rgba(172, 173, 173, 0.25)" }}
        >
          {vigilance && (
            <Block label="Vigilance" text={vigilance} dot="#e8112d" />
          )}
          {engagement && (
            <Block label="Engagement" text={engagement} dot="#fbd115" />
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Builds a meaningful, never-empty description from the available context
 * (sign names + dynamic word). Used when the curated PDF data is not yet
 * available for a given combined sign.
 */
function buildFallbackEssence({
  signXName,
  signYName,
  dynamicWord,
}: {
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}): string {
  if (signXName && signYName && dynamicWord) {
    return `Ce signe combine la force de ${signXName} et celle de ${signYName}. Leur rencontre dessine une voie d'${dynamicWord.toLowerCase()} : un appel à honorer ce qui, en toi, cherche à s'accorder. Écoute ce que cette tension intérieure veut révéler — c'est là que se trouve ta réponse.`;
  }
  if (signXName && signYName) {
    return `La rencontre de ${signXName} et ${signYName} ouvre un passage singulier. Prends le temps d'observer ce qui s'éveille en toi à la lecture de ce signe : la sagesse du Fâ se reçoit autant qu'elle se déchiffre.`;
  }
  return "Ce signe t'invite à un temps d'écoute intérieure. Ce qui se présente à toi en ce moment porte une parole — accueille-la sans hâte.";
}

const Block = ({
  label,
  text,
  dot,
}: {
  label: string;
  text: string;
  dot: string;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      <span
        className="font-label text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{ color: "#5a5c5c" }}
      >
        {label}
      </span>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: "rgba(45, 47, 47, 0.85)" }}>
      {text}
    </p>
  </div>
);

export default SignDisplay;
