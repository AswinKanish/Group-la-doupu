export interface CharacterProfile {
  id: string;
  name: string;
}

export const ANIMATED_CHARACTERS: CharacterProfile[] = [
  { id: 'cyber-neon', name: 'Agent 1' },
  { id: 'cyber-oni', name: 'Agent 2' },
  { id: 'mecha-skull', name: 'Agent 3' },
  { id: 'shadow-assassin', name: 'Agent 4' },
  { id: 'cosmic-astral', name: 'Agent 5' },
  { id: 'quantum-bot', name: 'Agent 6' },
  { id: 'laser-cat', name: 'Agent 7' },
  { id: 'pixel-glitch', name: 'Agent 8' },
  { id: 'cyber-ninja', name: 'Agent 9' },
  { id: 'mecha-tiger', name: 'Agent 10' },
  { id: 'space-alien', name: 'Agent 11' },
  { id: 'retro-ghost', name: 'Agent 12' },
  { id: 'turbo-bunny', name: 'Agent 13' },
  { id: 'deep-diver', name: 'Agent 14' },
  { id: 'astro-bot', name: 'Agent 15' },
  { id: 'chili-demon', name: 'Agent 16' },
];

// Fallback legacy IDs mapping to prevent broken avatars
const LEGACY_MAP: Record<string, string> = {
  'kolly-hero': 'cyber-neon',
  'tamil-king': 'cyber-oni',
  'pulikesi': 'mecha-skull',
  'auto-driver': 'pixel-glitch',
  'detective-cat': 'laser-cat',
  'cyber-bunny': 'turbo-bunny',
  'disco-panda': 'quantum-bot',
  'retro-gamer': 'pixel-glitch',
  'super-hero': 'shadow-assassin',
  'magic-wizard': 'cosmic-astral',
  'pixel-dino': 'mecha-tiger',
  'speedy-fox': 'cyber-ninja',
  '🦊': 'cyber-ninja',
  '🐱': 'laser-cat',
  '🐶': 'astro-bot',
  '🐼': 'quantum-bot',
  '🦁': 'mecha-tiger',
  '🐸': 'space-alien',
  '🐨': 'chili-demon',
  '🐯': 'mecha-tiger',
  '🐰': 'turbo-bunny',
  '🐵': 'pixel-glitch',
  '🐙': 'deep-diver',
  '🦉': 'cosmic-astral',
  '🦄': 'shadow-assassin',
  '🦖': 'mecha-tiger',
  '🐧': 'retro-ghost',
  '🐻': 'cyber-oni',
};

export function normalizeCharacterId(avatar: string): string {
  if (ANIMATED_CHARACTERS.some((c) => c.id === avatar)) {
    return avatar;
  }
  if (LEGACY_MAP[avatar]) {
    return LEGACY_MAP[avatar];
  }
  return ANIMATED_CHARACTERS[0].id;
}

export function getCharacterDetails(avatar: string): CharacterProfile {
  const id = normalizeCharacterId(avatar);
  return ANIMATED_CHARACTERS.find((c) => c.id === id) || ANIMATED_CHARACTERS[0];
}
