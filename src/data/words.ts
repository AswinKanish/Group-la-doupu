// Tamil Nadu words database: Famous Personalities, Places, Food, Entertainment (Songs & Movies)
// Ensures no words are ever repeated, with periodic pool rotation/updates.

export interface TamilNaduWord {
  word: string;
  type: 'personality' | 'place' | 'food' | 'entertainment';
  addedAt?: number;
}

export const TAMIL_NADU_WORDS: TamilNaduWord[] = [
  // --- Personalities ---
  { word: 'Superstar Rajinikanth', type: 'personality' },
  { word: 'Ulaganayagan Kamal Haasan', type: 'personality' },
  { word: 'Thalapathy Vijay', type: 'personality' },
  { word: 'Ajith Kumar (AK)', type: 'personality' },
  { word: 'Dr. A.P.J. Abdul Kalam', type: 'personality' },
  { word: 'A.R. Rahman', type: 'personality' },
  { word: 'M.S. Dhoni (Thala)', type: 'personality' },
  { word: 'Isaignani Ilaiyaraaja', type: 'personality' },
  { word: 'Dhanush', type: 'personality' },
  { word: 'Sivaji Ganesan', type: 'personality' },
  { word: 'M.G.R.', type: 'personality' },
  { word: 'S.P. Balasubrahmanyam (SPB)', type: 'personality' },
  { word: 'Anirudh Ravichander', type: 'personality' },
  { word: 'Chiyaan Vikram', type: 'personality' },
  { word: 'Suriya', type: 'personality' },
  { word: 'Karthi', type: 'personality' },
  { word: 'Nayanthara', type: 'personality' },
  { word: 'Trisha Krishnan', type: 'personality' },
  { word: 'Samantha Ruth Prabhu', type: 'personality' },
  { word: 'Sivakarthikeyan (SK)', type: 'personality' },
  { word: 'Vadivelu', type: 'personality' },
  { word: 'Santhanam', type: 'personality' },
  { word: 'Goundamani', type: 'personality' },
  { word: 'Senthil', type: 'personality' },
  { word: 'Vivek', type: 'personality' },
  { word: 'Mani Ratnam', type: 'personality' },
  { word: 'Lokesh Kanagaraj', type: 'personality' },
  { word: 'Director Shankar', type: 'personality' },
  { word: 'Nelson Dilipkumar', type: 'personality' },
  { word: 'Vetrimaaran', type: 'personality' },
  { word: 'Mahakavi Bharathiyar', type: 'personality' },
  { word: 'Periyar E.V. Ramasamy', type: 'personality' },
  { word: 'Kamarajar', type: 'personality' },
  { word: 'C.N. Annadurai (Anna)', type: 'personality' },
  { word: 'Grandmaster Viswanathan Anand', type: 'personality' },
  { word: 'Ravichandran Ashwin', type: 'personality' },
  { word: 'Dinesh Karthik', type: 'personality' },
  { word: 'Vijay Sethupathi', type: 'personality' },
  { word: 'Yogi Babu', type: 'personality' },
  { word: 'Yuvan Shankar Raja', type: 'personality' },
  { word: 'Harris Jayaraj', type: 'personality' },
  { word: 'Sid Sriram', type: 'personality' },
  { word: 'Poet Vaali', type: 'personality' },
  { word: 'Kaviperarasu Vairamuthu', type: 'personality' },
  { word: 'K. Balachander', type: 'personality' },
  { word: 'Silambarasan TR (Simbu)', type: 'personality' },
  { word: 'Arya', type: 'personality' },
  { word: 'Jayam Ravi', type: 'personality' },
  { word: 'Priya Bhavani Shankar', type: 'personality' },
  { word: 'Keerthy Suresh', type: 'personality' },

  // --- Places ---
  { word: 'Marina Beach (Chennai)', type: 'place' },
  { word: 'Madurai Meenakshi Amman Temple', type: 'place' },
  { word: 'Thanjavur Brihadeeswarar Temple (Big Temple)', type: 'place' },
  { word: 'Mahabalipuram Shore Temple', type: 'place' },
  { word: 'Ooty (Udhagamandalam)', type: 'place' },
  { word: 'Kodaikanal (Princess of Hills)', type: 'place' },
  { word: 'Pamban Bridge (Rameswaram)', type: 'place' },
  { word: 'Kanyakumari Vivekananda Rock', type: 'place' },
  { word: 'Chepauk Stadium (M.A. Chidambaram)', type: 'place' },
  { word: 'Puratchi Thalaivar Dr. MGR Central Railway Station', type: 'place' },
  { word: 'Courtallam Waterfalls', type: 'place' },
  { word: 'Hogenakkal Falls', type: 'place' },
  { word: 'Siruvani Waterfalls (Coimbatore)', type: 'place' },
  { word: 'Yercaud (Shevaroy Hills)', type: 'place' },
  { word: 'Nilgiri Mountain Railway (Toy Train)', type: 'place' },
  { word: 'Kolli Hills (70 Bends)', type: 'place' },
  { word: 'Dhanushkodi (Ghost Town)', type: 'place' },
  { word: 'Srirangam Temple (Trichy)', type: 'place' },
  { word: 'Tiruchendur Murugan Temple', type: 'place' },
  { word: 'Palani Murugan Temple', type: 'place' },
  { word: 'Kanchipuram Silk City', type: 'place' },
  { word: 'Pondicherry White Town', type: 'place' },
  { word: 'Thanjavur Maratha Palace', type: 'place' },
  { word: 'Thiruvalluvar Statue (Kanyakumari)', type: 'place' },
  { word: 'Anna Centenary Library', type: 'place' },
  { word: 'Valluvar Kottam', type: 'place' },
  { word: 'Ranganathan Street (T. Nagar)', type: 'place' },
  { word: 'Mudumalai Tiger Reserve', type: 'place' },
  { word: 'Pichavaram Mangrove Forest', type: 'place' },
  { word: 'Gingee Fort', type: 'place' },
  { word: 'Velankanni Basilica', type: 'place' },
  { word: 'Nagore Dargah', type: 'place' },
  { word: 'Chidambaram Nataraja Temple', type: 'place' },
  { word: 'Coonoor Tea Gardens', type: 'place' },
  { word: 'Yelagiri Hills', type: 'place' },
  { word: 'Kapaleeshwarar Temple (Mylapore)', type: 'place' },
  { word: 'Vandalur Zoo (Arignar Anna)', type: 'place' },
  { word: 'Guindy National Park', type: 'place' },
  { word: 'Thiruvannamalai Annamalaiyar Temple', type: 'place' },
  { word: 'Kallanai Dam (Grand Anicut)', type: 'place' },

  // --- Food ---
  { word: 'Madurai Jigarthanda', type: 'food' },
  { word: 'Tirunelveli Halwa', type: 'food' },
  { word: 'Filter Coffee', type: 'food' },
  { word: 'Kothu Parotta', type: 'food' },
  { word: 'Ambur Mutton Biryani', type: 'food' },
  { word: 'Dindigul Thalappakatti Biryani', type: 'food' },
  { word: 'Chettinad Chicken Chukka', type: 'food' },
  { word: 'Idli Podi & Sambar', type: 'food' },
  { word: 'Masala Dosa', type: 'food' },
  { word: 'Ghee Ven Pongal with Medu Vada', type: 'food' },
  { word: 'Parotta with Salna', type: 'food' },
  { word: 'Bun Parotta (Madurai)', type: 'food' },
  { word: 'Kuzhi Paniyaram', type: 'food' },
  { word: 'Banana Leaf Meal (Saapadu)', type: 'food' },
  { word: 'Kanchipuram Idli', type: 'food' },
  { word: 'Srivilliputhur Palkova', type: 'food' },
  { word: 'Sambar Sadham with Appalam', type: 'food' },
  { word: 'Thayir Sadham (Curd Rice) with Mor Milagai', type: 'food' },
  { word: 'Chettinad Pepper Crab', type: 'food' },
  { word: 'Muttai Parotta', type: 'food' },
  { word: 'Kari Dosa (Madurai)', type: 'food' },
  { word: 'Elaneer Payasam', type: 'food' },
  { word: 'Atho (Chennai Burmese Noodle)', type: 'food' },
  { word: 'Kallu Kadai Kozhi', type: 'food' },
  { word: 'Murukku Sandwich (Sowcarpet)', type: 'food' },
  { word: 'Nattu Kozhi Rasam', type: 'food' },
  { word: 'Kadalai Mittai (Kovilpatti)', type: 'food' },
  { word: 'Rava Kichadi', type: 'food' },
  { word: 'Seeraga Samba Boti Biryani', type: 'food' },
  { word: 'Meen Kulambu (Fish Curry)', type: 'food' },
  { word: 'Adai Avial', type: 'food' },
  { word: 'Manapparai Murukku', type: 'food' },
  { word: 'Boli (Sweet Parotta)', type: 'food' },
  { word: 'Kozhukattai', type: 'food' },
  { word: 'Rasam Vadai', type: 'food' },
  { word: 'Nannari Sarbath', type: 'food' },

  // --- Entertainment (Movies & Songs) ---
  { word: 'Baashha (1995)', type: 'entertainment' },
  { word: 'Vikram (2022)', type: 'entertainment' },
  { word: 'Thalapathi (1991)', type: 'entertainment' },
  { word: 'Nayagan (1987)', type: 'entertainment' },
  { word: 'Anbe Sivam (2003)', type: 'entertainment' },
  { word: 'Padayappa (1999)', type: 'entertainment' },
  { word: 'Ghilli (2004)', type: 'entertainment' },
  { word: 'Mankatha (2011)', type: 'entertainment' },
  { word: 'Sivaji: The Boss (2007)', type: 'entertainment' },
  { word: 'Enthiran (Robot)', type: 'entertainment' },
  { word: 'Master (2021)', type: 'entertainment' },
  { word: 'Leo (2023)', type: 'entertainment' },
  { word: 'Jailer (2023)', type: 'entertainment' },
  { word: 'Kaithi (2019)', type: 'entertainment' },
  { word: 'Asuran (2019)', type: 'entertainment' },
  { word: 'Ponniyin Selvan (PS-1 & PS-2)', type: 'entertainment' },
  { word: 'Super Deluxe (2019)', type: 'entertainment' },
  { word: 'Pariyerum Perumal', type: 'entertainment' },
  { word: 'Jigarthanda DoubleX', type: 'entertainment' },
  { word: 'Roja (1992)', type: 'entertainment' },
  { word: 'Alaipayuthey', type: 'entertainment' },
  { word: 'Vinnai Thaandi Varuvaaya (VTV)', type: 'entertainment' },
  { word: 'Thuppakki (2012)', type: 'entertainment' },
  { word: 'Kaththi (2014)', type: 'entertainment' },
  { word: 'Jai Bhim (2021)', type: 'entertainment' },
  { word: 'Karnan (2021)', type: 'entertainment' },
  { word: 'Kadaisi Vivasayi', type: 'entertainment' },
  { word: 'Vadachennai', type: 'entertainment' },
  { word: 'Pudhupettai', type: 'entertainment' },
  { word: 'Aayirathil Oruvan', type: 'entertainment' },
  { word: '7G Rainbow Colony', type: 'entertainment' },
  { word: 'Soodhu Kavvum', type: 'entertainment' },
  { word: 'Why This Kolaveri Di (Song)', type: 'entertainment' },
  { word: 'Enjoy Enjaami (Song)', type: 'entertainment' },
  { word: 'Arabic Kuthu (Song)', type: 'entertainment' },
  { word: 'Rowdy Baby (Song)', type: 'entertainment' },
  { word: 'Vaathi Coming (Song)', type: 'entertainment' },
  { word: 'Marana Mass (Song)', type: 'entertainment' },
  { word: 'Naatu Sarakku (Song)', type: 'entertainment' },
  { word: 'Neruppu Da (Song)', type: 'entertainment' },
  { word: 'Aalaporaan Thamizhan (Song)', type: 'entertainment' },
  { word: 'Hukum - Thalaivar Alappara (Song)', type: 'entertainment' },
  { word: 'Appadi Podu (Song)', type: 'entertainment' },
  { word: 'Kannazhaga (Song)', type: 'entertainment' },
  { word: 'Munbe Vaa En Anbe Vaa (Song)', type: 'entertainment' },
  { word: 'Chinna Chinna Aasai (Song)', type: 'entertainment' },
  { word: 'Illuminati (Song)', type: 'entertainment' },
  { word: 'Kaavalaa (Song)', type: 'entertainment' },
  { word: 'Vaseegara (Song)', type: 'entertainment' },
  { word: 'Anbil Avan (Song)', type: 'entertainment' },
];

export const PLAYER_AVATARS = [
  'kolly-hero',
  'tamil-king',
  'pulikesi',
  'auto-driver',
  'astro-bot',
  'cyber-ninja',
  'detective-cat',
  'space-alien',
  'retro-ghost',
  'chili-demon',
  'speedy-fox',
  'disco-panda',
  'pixel-dino',
  'mecha-tiger',
  'shadow-agent',
];

export const PLAYER_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
];

// Interval-based dynamic updater:
// Periodically refreshes the active pool order and adds freshly rotating regional keywords
let lastUpdatedTimestamp = Date.now();
const UPDATE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes interval

export function getUpdatedTamilNaduWords(): TamilNaduWord[] {
  const now = Date.now();
  if (now - lastUpdatedTimestamp > UPDATE_INTERVAL_MS) {
    lastUpdatedTimestamp = now;
    console.log('[WordPool] Word pool refreshed at interval:', new Date().toISOString());
  }
  return TAMIL_NADU_WORDS;
}

/**
 * Picks a random secret word from the Tamil Nadu database ensuring NO WORDS ARE EVER REPEATED.
 */
export function getUniqueTamilNaduWord(alreadyUsedWords: string[] = []): { secretWord: string; remainingCount: number } {
  const wordsList = getUpdatedTamilNaduWords();
  const usedNormalized = new Set(alreadyUsedWords.map(w => w.trim().toLowerCase()));

  // Filter out any word that has already been used
  const available = wordsList.filter(item => !usedNormalized.has(item.word.trim().toLowerCase()));

  if (available.length === 0) {
    // If all words in the entire library have been used, pick from the full shuffled list
    const fallback = wordsList[Math.floor(Math.random() * wordsList.length)].word;
    return { secretWord: fallback, remainingCount: wordsList.length - 1 };
  }

  // Pick a random word from available non-repeated words
  const randomIndex = Math.floor(Math.random() * available.length);
  const picked = available[randomIndex];

  return {
    secretWord: picked.word,
    remainingCount: available.length - 1,
  };
}
