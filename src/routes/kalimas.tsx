import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/kalimas")({
  head: () => ({
    meta: [
      { title: "The Six Kalimas — Arabic, Translation & Explanation | Qasr Companion" },
      {
        name: "description",
        content:
          "Learn all the Kalimas of Islam with Arabic text, transliteration, English translation and a clear explanation of the meaning and importance of each.",
      },
      { property: "og:title", content: "The Kalimas of Islam — Qasr Companion" },
      {
        property: "og:description",
        content: "Arabic, transliteration, translation and explanation for every Kalima.",
      },
    ],
  }),
  component: Kalimas,
});

interface Kalima {
  no: number;
  name: string;
  arabicName: string;
  arabic: string;
  transliteration: string;
  translation: string;
  explanation: string;
}

const KALIMAS: Kalima[] = [
  {
    no: 1,
    name: "First Kalima — Tayyab (The Word of Purity)",
    arabicName: "كَلِمَة طَيِّب",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُولُ اللهِ",
    transliteration: "Lā ilāha illā Allāh, Muḥammadur Rasūlullāh",
    translation: "There is none worthy of worship except Allah, Muhammad is the Messenger of Allah.",
    explanation:
      "This is the foundation of Islam — the declaration of Tawhid (the Oneness of Allah) and the prophethood of Muhammad ﷺ. By sincerely affirming it, a person enters Islam. It purifies the heart of all false objects of worship and establishes complete devotion to Allah alone.",
  },
  {
    no: 2,
    name: "Second Kalima — Shahadat (The Testimony)",
    arabicName: "كَلِمَة شَهَادَت",
    arabic:
      "أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "Ash-hadu an lā ilāha illā Allāh waḥdahū lā sharīka lah, wa ash-hadu anna Muḥammadan ʿabduhū wa rasūluh",
    translation:
      "I bear witness that there is none worthy of worship except Allah, alone without any partner, and I bear witness that Muhammad is His servant and Messenger.",
    explanation:
      "The Kalima of testimony is the verbal witness a Muslim gives before Allah and creation. It emphasises that Allah has no partner and that Muhammad ﷺ is both His servant (ʿabd) and His Messenger (rasūl) — balancing love and reverence with the truth that he was human.",
  },
  {
    no: 3,
    name: "Third Kalima — Tamjeed (The Glorification)",
    arabicName: "كَلِمَة تَمْجِيد",
    arabic:
      "سُبْحَانَ اللهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration:
      "Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar, wa lā ḥawla wa lā quwwata illā billāhil-ʿaliyyil-ʿaẓīm",
    translation:
      "Glory be to Allah, and all praise is for Allah, and there is none worthy of worship except Allah, and Allah is the Greatest. There is no power and no strength except with Allah, the Most High, the Most Great.",
    explanation:
      "This Kalima glorifies Allah through tasbīḥ (purity), taḥmīd (praise), tahlīl (oneness) and takbīr (greatness). Reciting it abundantly is a means of immense reward and reminds the believer that all ability and strength comes only from Allah.",
  },
  {
    no: 4,
    name: "Fourth Kalima — Tawheed (The Unity)",
    arabicName: "كَلِمَة تَوْحِيد",
    arabic:
      "لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَّا يَمُوتُ أَبَدًا أَبَدًا ذُو الْجَلَالِ وَالْإِكْرَامِ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu yuḥyī wa yumītu wa huwa ḥayyul-lā yamūtu abadan abadā, dhul-jalāli wal-ikrām, biyadihil-khayr, wa huwa ʿalā kulli shay’in qadīr",
    translation:
      "There is none worthy of worship except Allah, alone, without partner. To Him belongs the dominion and to Him belongs all praise. He gives life and causes death. He is the Ever-Living who never dies. In His hand is all good, and He has power over all things.",
    explanation:
      "The Kalima of Tawhid affirms Allah's absolute sovereignty: He owns everything, controls life and death, never dies, and holds all good in His hand. It deepens the believer's reliance on Allah and trust in His complete authority over creation.",
  },
  {
    no: 5,
    name: "Fifth Kalima — Astaghfar (Seeking Forgiveness)",
    arabicName: "كَلِمَة اسْتِغْفَار",
    arabic:
      "أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمَدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration:
      "Astaghfirullāha rabbī min kulli dhambin adhnabtuhū ʿamadan aw khaṭa’an sirran aw ʿalāniyatan wa atūbu ilayhi minadh-dhambil-ladhī aʿlamu wa minadh-dhambil-ladhī lā aʿlamu, innaka anta ʿallāmul-ghuyūbi wa sattārul-ʿuyūbi wa ghaffārudh-dhunūbi, wa lā ḥawla wa lā quwwata illā billāhil-ʿaliyyil-ʿaẓīm",
    translation:
      "I seek forgiveness from Allah, my Lord, for every sin I committed knowingly or unknowingly, secretly or openly, and I turn to Him in repentance from the sin that I know and from the sin that I do not know. Indeed You are the Knower of the unseen, the Concealer of faults, and the Forgiver of sins, and there is no power and no strength except with Allah, the Most High, the Most Great.",
    explanation:
      "This Kalima is a comprehensive prayer of repentance (istighfār). It covers every kind of sin — intentional or accidental, hidden or open, known or unknown — and acknowledges Allah as the One who knows all secrets, conceals faults and forgives. It teaches humility and constant return to Allah.",
  },
];

function Kalimas() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl">The Kalimas of Islam</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        The Kalimas are the core declarations of faith every Muslim cherishes. Below are the five
        Kalimas with Arabic text, transliteration, translation and an explanation of each.
      </p>

      <div className="mt-8 space-y-5">
        {KALIMAS.map((k) => (
          <article
            key={k.no}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-secondary/40 px-4 py-3 sm:px-6">
              <h2 className="font-display text-lg sm:text-xl">{k.name}</h2>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                {k.no}
              </span>
            </header>
            <div className="p-4 sm:p-6">
              <p className="text-right font-arabic text-2xl leading-loose text-primary sm:text-3xl">
                {k.arabic}
              </p>
              <p className="mt-4 text-sm italic text-muted-foreground sm:text-base">
                {k.transliteration}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-card-foreground sm:text-base">
                <span className="font-semibold text-gold-foreground">Translation: </span>
                {k.translation}
              </p>
              <div className="mt-4 flex gap-2 rounded-xl border border-border bg-secondary/30 p-3 sm:p-4">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Explanation: </span>
                  {k.explanation}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}