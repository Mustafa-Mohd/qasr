export type MadhabId = "hanafi" | "shafii" | "maliki" | "hanbali";

export interface MadhabRule {
  id: MadhabId;
  name: string;
  arabic: string;
  /** Minimum one-way travel distance in km to qualify as a traveler */
  distanceKm: number;
  /** Classical measure used */
  distanceNote: string;
  /** Max days you may stay and still shorten (null = scholars differ / indefinite) */
  stayDays: number | null;
  stayNote: string;
  jamakNote: string;
  summary: string;
  color: string;
}

export const MADHABS: Record<MadhabId, MadhabRule> = {
  hanafi: {
    id: "hanafi",
    name: "Hanafi",
    arabic: "حنفي",
    distanceKm: 77,
    distanceNote: "≈ 3 days' walking journey (approx. 77–88 km / 48 miles)",
    stayDays: 15,
    stayNote: "Intending to stay 15 days or more makes you a resident; shorten before that.",
    jamakNote:
      "The Hanafi school generally does not permit combining (Jamak) two prayers at one time except at Arafah and Muzdalifah during Hajj. Each prayer is offered in its own time.",
    summary:
      "A traveler shortens the 4-rakʿah prayers to 2. Combining prayers is not permitted outside Hajj.",
    color: "oklch(0.55 0.12 162)",
  },
  shafii: {
    id: "shafii",
    name: "Shafi'i",
    arabic: "شافعي",
    distanceKm: 81,
    distanceNote: "≈ 16 farsakh (approx. 81 km / ~50 miles)",
    stayDays: 4,
    stayNote: "Intending to stay 4 days or more (excluding arrival & departure days) ends Qasr.",
    jamakNote:
      "Combining Dhuhr–Asr and Maghrib–Isha is permitted for the traveler, either advanced (Jamʿ Taqdim) or delayed (Jamʿ Taʾkhir).",
    summary:
      "Shorten 4-rakʿah prayers to 2 and combine Dhuhr–Asr and Maghrib–Isha while traveling.",
    color: "oklch(0.6 0.12 200)",
  },
  maliki: {
    id: "maliki",
    name: "Maliki",
    arabic: "مالكي",
    distanceKm: 83,
    distanceNote: "≈ 48 miles / 4 burud (approx. 83 km)",
    stayDays: 4,
    stayNote: "Intending to stay 4 days (20 prayers) or more ends the traveler concession.",
    jamakNote:
      "Combining is permitted for the traveler, especially when actively on the move; combining at the time of the second prayer is preferred when stopping.",
    summary:
      "Shorten 4-rakʿah prayers to 2 and combine the two pairs when needed during travel.",
    color: "oklch(0.62 0.12 100)",
  },
  hanbali: {
    id: "hanbali",
    name: "Hanbali",
    arabic: "حنبلي",
    distanceKm: 80,
    distanceNote: "≈ 16 farsakh / 48 miles (approx. 80 km)",
    stayDays: 4,
    stayNote: "Intending more than 4 days (over 20 prayers) makes you a resident.",
    jamakNote:
      "Combining Dhuhr–Asr and Maghrib–Isha is permitted for the traveler; shortening is recommended though leaving it is allowed.",
    summary:
      "Shorten 4-rakʿah prayers to 2 and combine the two pairs as a travel concession.",
    color: "oklch(0.58 0.12 40)",
  },
};

export const MADHAB_LIST = Object.values(MADHABS);

export interface QuranRef {
  text: string;
  arabic?: string;
  ref: string;
}

export const QURAN_REFS: QuranRef[] = [
  {
    text:
      "And when you travel throughout the land, there is no blame upon you for shortening the prayer, if you fear that those who disbelieve may disrupt you.",
    arabic: "وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ",
    ref: "Surah An-Nisa 4:101",
  },
];

export const HADITH_REFS: QuranRef[] = [
  {
    text:
      "Ibn ʿUmar said: I accompanied the Prophet ﷺ and he would not pray more than two rakʿah while traveling; and likewise Abu Bakr, ʿUmar and ʿUthman.",
    ref: "Sahih al-Bukhari 1102",
  },
  {
    text:
      "Anas ﷺ reported: When the Messenger of Allah set out on a journey before the sun declined, he would delay the Dhuhr prayer to the time of Asr and combine them.",
    ref: "Sahih al-Bukhari 1111",
  },
  {
    text:
      "Allah likes that His concessions (rukhsah) be accepted just as He dislikes that His commands be disobeyed.",
    ref: "Sahih Ibn Khuzaymah 950",
  },
];
