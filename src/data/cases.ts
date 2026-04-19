import { PROFILE_PHOTOS } from "@/assets/profiles";

export interface LifeCase {
  id: string;
  emoji: string;
  label: string;
  /** Poetic editorial title (e.g. "Reflet brisé ?") */
  title: string;
  /** Persona name and age, displayed as floating badge over the image */
  persona: string;
  /** First-person scenario quote (italic, with golden left border) */
  quote: string;
  situation: string;
  /** Hero image for the editorial card */
  image: string;
  /** Two-paragraph narrative describing the case in depth */
  narrative: [string, string];
  options: string[];
}

export const LIFE_CASES: LifeCase[] = [
  {
    id: "amour",
    emoji: "❤️",
    label: "Amour",
    title: "Reflet brisé ?",
    persona: "Rosine, 28 ans",
    quote:
      "Rosine, 28 ans, vendeuse de tissu à Calavi. Son petit ami lui a dit qu'il l'aimait hier soir. Ce matin, le miroir accroché au mur s'est brisé en deux sans raison.",
    situation: "Relation floue / instable.",
    image: PROFILE_PHOTOS[0],
    narrative: [
      "Depuis quelques semaines, ce lien que tu pensais clair s'est mis à vaciller. Les mots se font rares, les silences plus pesants, et chaque échange laisse une trace d'incertitude. Tu sens que quelque chose se joue, sans pouvoir le nommer.",
      "Ce flou n'est pas une absence : c'est un appel. Il te demande de regarder ce que tu cherches vraiment dans cette relation, et ce que tu es prêt·e à offrir. La sagesse du Fâ t'invite à honorer ce qui se présente — sans fuir ni forcer.",
    ],
    options: [
      "Ce lien est sincère, mais quelque chose dans sa lignée s'y oppose.",
      "Il cache une autre relation.",
      "L'amour est vrai, mais le moment est mauvais.",
      "C'est elle-même qui sabote ce qui lui arrive de bien.",
    ],
  },
  {
    id: "amitie",
    emoji: "🤝",
    label: "Amitié",
    title: "Le silence de l'ami ?",
    persona: "Kofi, 32 ans",
    quote:
      "Kofi, 32 ans, mécanicien à Cotonou. Son meilleur ami d'enfance ne répond plus à ses messages depuis trois semaines. Hier, il l'a croisé au marché : il a détourné le regard.",
    situation: "Changement d'attitude d'un proche.",
    image: PROFILE_PHOTOS[1],
    narrative: [
      "Un·e ami·e proche a changé. Plus distant·e, plus fermé·e, ou peut-être simplement ailleurs. Tu te demandes si tu as fait quelque chose, ou si la vie a tout simplement déplacé ses priorités sans prévenir.",
      "Les liens vivants évoluent comme les saisons. Ce moment t'invite à écouter ton ressenti sans précipitation : est-ce un passage, une transformation, ou une fin qui demande à être reconnue avec dignité ?",
    ],
    options: [
      "Quelque chose de non-dit pèse entre nous.",
      "Il traverse une épreuve qu'il ne sait pas partager.",
      "Notre lien a fait son temps, sans drame.",
      "Une jalousie cachée s'est invitée entre nous.",
    ],
  },
  {
    id: "famille",
    emoji: "👨‍👩‍👧",
    label: "Famille",
    title: "Racines en tension ?",
    persona: "Adjoa, 35 ans",
    quote:
      "Adjoa, 35 ans, infirmière à Porto-Novo. De retour au village pour les obsèques d'un oncle, elle sent que les siens la regardent comme une étrangère. Sa mère ne lui adresse plus la parole.",
    situation: "Décalage avec les siens.",
    image: PROFILE_PHOTOS[2],
    narrative: [
      "Tu reviens chez les tiens et quelque chose ne s'ajuste plus. Les conversations tournent en rond, les attentes sont implicites, et tu sens un fossé silencieux entre qui tu es devenu·e et ce qu'on attend encore de toi.",
      "Le Fâ rappelle que la famille est une racine, pas une cage. Il t'invite à honorer la lignée tout en assumant ta propre voie — trouver le geste juste qui ne renie ni ce que tu deviens, ni ce que tu reçois d'eux.",
    ],
    options: [
      "Mon évolution dérange un équilibre ancien.",
      "Une parole non dite empoisonne le lien.",
      "Je dois revenir avec un geste, pas des mots.",
      "Ma place dans la lignée demande à être renégociée.",
    ],
  },
  {
    id: "argent",
    emoji: "💰",
    label: "Argent",
    title: "L'offre du carrefour ?",
    persona: "Mawuli, 40 ans",
    quote:
      "Mawuli, 40 ans, entrepreneur à Abomey. Un investisseur lui propose une somme qui changerait sa vie, à condition de céder la moitié de son atelier hérité de son père.",
    situation: "Décision financière incertaine.",
    image: PROFILE_PHOTOS[3],
    narrative: [
      "Une décision financière se présente : un investissement, un engagement, un risque. Les chiffres sont là, mais ce qui te trouble se situe ailleurs — dans la tension entre la sécurité que tu connais et l'élan qui te pousse à oser.",
      "L'argent n'est jamais qu'un miroir : il révèle ton rapport à la confiance, à la peur, au mérite. Avant d'agir, écoute ce que cette situation te raconte de toi — la réponse juste émerge quand l'intention est claire.",
    ],
    options: [
      "L'opportunité est juste, mais le prix caché est lourd.",
      "Mon père me parle à travers ce doute.",
      "Sécuriser maintenant, c'est honorer la lignée.",
      "Oser, c'est répondre à un appel plus grand que la peur.",
    ],
  },
  {
    id: "travail",
    emoji: "💼",
    label: "Travail",
    title: "Le vide du dimanche soir ?",
    persona: "Folake, 29 ans",
    quote:
      "Folake, 29 ans, comptable à Cotonou. Salaire stable, équipe correcte, perspectives claires. Et pourtant, chaque dimanche soir, une boule au ventre qu'elle n'arrive plus à ignorer.",
    situation: "Stabilité mais vide intérieur.",
    image: PROFILE_PHOTOS[4],
    narrative: [
      "Ton travail tient debout : les fins de mois sont assurées, l'équipe est correcte, les missions se succèdent. Et pourtant, quelque chose en toi s'éteint doucement. Un vide discret, qui grandit chaque dimanche soir.",
      "Cette dissonance entre extérieur stable et intérieur en sourdine est un signal. Le Fâ t'invite à explorer ce vide comme un message : il pointe peut-être vers une vocation enfouie, ou simplement un besoin de sens à réintroduire dans ton quotidien.",
    ],
    options: [
      "Une vocation enfouie réclame son tour.",
      "Le vide vient d'un sens à réinjecter, pas d'un lieu à fuir.",
      "Partir vite serait fuir, pas répondre.",
      "Un proche bloque silencieusement mon élan.",
    ],
  },
];

/** Pick a random case */
export const pickRandomCase = (): LifeCase =>
  LIFE_CASES[Math.floor(Math.random() * LIFE_CASES.length)];
