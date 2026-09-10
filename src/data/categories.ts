export interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  description: string;
  words: string[];
}

export const CATEGORIES: CategoryData[] = [
  {
    id: 'food',
    name: 'Food & Drinks',
    emoji: '🍕',
    description: 'Delicious snacks, gourmet dishes, and beverages',
    words: [
      'Pizza', 'Sushi', 'Burger', 'Taco', 'Pasta', 'Pancake',
      'Ice Cream', 'Steak', 'Coffee', 'Burrito', 'Donut', 'Hotdog',
      'Ramen', 'Salad', 'Sandwich', 'Chocolate', 'Cheesecake', 'Smoothie',
      'Croissant', 'Popcorn', 'French Fries', 'Dim Sum', 'Curry', 'Waffles',
    ],
  },
  {
    id: 'animals',
    name: 'Animals & Nature',
    emoji: '🦁',
    description: 'Creatures from the wild jungle, ocean, and skies',
    words: [
      'Lion', 'Penguin', 'Elephant', 'Dolphin', 'Kangaroo', 'Tiger',
      'Koala', 'Panda', 'Wolf', 'Cheetah', 'Eagle', 'Octopus',
      'Zebra', 'Giraffe', 'Grizzly Bear', 'Owl', 'Chameleon', 'Flamingo',
      'Crocodile', 'Shark', 'Gorilla', 'Otter', 'Rhinoceros', 'Falcon',
    ],
  },
  {
    id: 'scifi',
    name: 'Space & Sci-Fi',
    emoji: '🚀',
    description: 'Cosmic phenomena, futuristic tech, and universe marvels',
    words: [
      'Astronaut', 'Alien', 'Black Hole', 'Spaceship', 'Laser', 'Teleporter',
      'Cyberpunk', 'Mars Colony', 'Supernova', 'Robot', 'Wormhole', 'Satellite',
      'Galaxy', 'Asteroid', 'Time Machine', 'Raygun', 'Cosmic Dust', 'Orbital Station',
      'Android', 'Light Speed', 'Nebula', 'Forcefield', 'Exoplanet', 'Starship',
    ],
  },
  {
    id: 'movies',
    name: 'Movies & Cinema',
    emoji: '🎬',
    description: 'Films, genres, production, and red carpet stardom',
    words: [
      'Hollywood', 'Oscar Award', 'Popcorn', 'Superhero', 'Director', 'Horror',
      'Comedy', 'Animation', 'Soundtrack', 'Red Carpet', 'Supervillain', 'Sequel',
      'Blockbuster', 'Stuntman', 'Premiere', 'Screenplay', 'Camera Crew', 'Special Effects',
      'Cliffhanger', 'Trailer', 'Cinema', 'Costume', 'Producer', 'Actor',
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    emoji: '📱',
    description: 'Modern devices, electronics, and digital tools',
    words: [
      'Smartphone', 'Smartwatch', 'Drone', 'Virtual Reality', 'Laptop', 'Headphones',
      'Tablet', 'Microchip', 'Bluetooth', '3D Printer', 'Game Console', 'Digital Camera',
      'Mechanical Keyboard', 'Wi-Fi Router', 'Cloud Server', 'Monitor', 'Smart Speaker', 'Power Bank',
      'Microphone', 'Webcam', 'USB Drive', 'Smart Glasses', 'Touchscreen', 'Graphics Card',
    ],
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    emoji: '🌍',
    description: 'Wonders of the world, destinations, and adventures',
    words: [
      'Paris', 'Airport', 'Tropical Beach', 'Snowy Mountain', 'Ancient Pyramid', 'Rainforest',
      'Medieval Castle', 'Private Island', 'Cruise Ship', 'Sahara Desert', 'Tokyo', 'Museum',
      'Glacier', 'Waterfall', 'Luxury Hotel', 'African Safari', 'Lighthouse', 'Subway',
      'National Park', 'Canyon', 'Volcano', 'Temple', 'Skyscraper', 'Backpacking',
    ],
  },
  {
    id: 'games',
    name: 'Video Games',
    emoji: '🎮',
    description: 'Iconic franchises, gamer culture, and legendary titles',
    words: [
      'Minecraft', 'Super Mario', 'Zelda', 'Pokemon', 'Fortnite', 'Among Us',
      'Tetris', 'Pac-Man', 'Sonic', 'Portal', 'Skyrim', 'Halo',
      'GTA', 'Roblox', 'The Witcher', 'Cyberpunk', 'Doom', 'Overwatch',
      'Dark Souls', 'Elden Ring', 'League of Legends', 'Call of Duty', 'Animal Crossing', 'Street Fighter',
    ],
  },
  {
    id: 'objects',
    name: 'Everyday Objects',
    emoji: '📦',
    description: 'Household items, tools, and personal belongings',
    words: [
      'Toothbrush', 'Umbrella', 'Backpack', 'Pillow', 'Sunglasses', 'Alarm Clock',
      'Leather Wallet', 'Scented Candle', 'Mirror', 'Wool Blanket', 'Keyring', 'Coffee Mug',
      'Scissors', 'Flashlight', 'Acoustic Guitar', 'Running Shoes', 'Notebook', 'Wristwatch',
      'Water Bottle', 'Hammer', 'Bicycle', 'Headphones', 'Passport', 'Tape Measure',
    ],
  },
];

export const PLAYER_AVATARS = [
  '🦊', '🐱', '🐶', '🐼', '🦁', '🐸', '🐨', '🐯',
  '🐰', '🐵', '🐙', '🦉', '🦄', '🦖', '🐧', '🐻',
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

export function getRandomWordPair(categoryId: string, customWords?: string[]): { categoryName: string; secretWord: string; wordGrid: string[] } {
  if (categoryId === 'custom' && customWords && customWords.length >= 16) {
    const shuffled = [...customWords].sort(() => 0.5 - Math.random());
    const wordGrid = shuffled.slice(0, 16);
    const secretWord = wordGrid[Math.floor(Math.random() * wordGrid.length)];
    return { categoryName: 'Custom Words', secretWord, wordGrid };
  }

  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const shuffledWords = [...cat.words].sort(() => 0.5 - Math.random());
  const wordGrid = shuffledWords.slice(0, 16);
  const secretWord = wordGrid[Math.floor(Math.random() * wordGrid.length)];

  return {
    categoryName: cat.name,
    secretWord,
    wordGrid,
  };
}
