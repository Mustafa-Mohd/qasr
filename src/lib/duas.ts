export interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export const DAILY_DUAS: Dua[] = [
  {
    id: "wake-up",
    category: "Morning & Evening",
    title: "Upon Waking Up",
    arabic: "الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-lathee ahyana ba'da ma amatana wa-ilayhin-nushoor.",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    reference: "Al-Bukhari 11/113, Muslim 4/2083"
  },
  {
    id: "sleep",
    category: "Morning & Evening",
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismikal-lahumma amootu wa-ahya.",
    translation: "In Your name O Allah, I live and die.",
    reference: "Al-Bukhari 11/113, Muslim 4/2083"
  },
  {
    id: "leaving-home",
    category: "Travel & Movement",
    title: "Leaving the Home",
    arabic: "بِسْمِ اللهِ ، تَوَكَّلْتُ عَلَى اللهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    transliteration: "Bismil-lah, tawakkaltu 'alal-lah, wa la hawla wa la quwwata illa billah.",
    translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    reference: "Abu Dawud 4/325, At-Tirmidhi 5/490"
  },
  {
    id: "travel",
    category: "Travel & Movement",
    title: "Starting a Journey",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ. وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen. Wa-inna ila rabbina lamunqaliboon.",
    translation: "Glory unto Him Who created this transportation, for us, though we were unable to create it on our own. And unto our Lord we shall return.",
    reference: "Surah Az-Zukhruf 43:13-14"
  },
  {
    id: "eating",
    category: "Food & Drink",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    reference: "Abu Dawud 3/347, At-Tirmidhi 4/288"
  },
  {
    id: "after-eating",
    category: "Food & Drink",
    title: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-lathee at'amanee hatha warazaqaneehi min ghayri hawlin minnee wala quwwah.",
    translation: "All praise is to Allah Who has fed me this and provided it for me without any strength or power on my part.",
    reference: "Abu Dawud, At-Tirmidhi, Ibn Majah"
  },
  {
    id: "distress",
    category: "Hardship & Emotions",
    title: "When in Distress",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka innee kuntu minath-thalimeen.",
    translation: "None has the right to be worshipped but You, glory is to You, indeed I have been of the wrongdoers.",
    reference: "Surah Al-Anbiya 21:87"
  }
];
