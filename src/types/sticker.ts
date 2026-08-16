export type StickerRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type StickerCategory = 'food' | 'animals' | 'japan' | 'magic' | 'love' | 'badges';

export interface StickerDefinition {
  id: string;
  name: string;
  category: StickerCategory;
  rarity: StickerRarity;
  emoji: string;
  iconName?: string;
  description: string;
  glowColor: string;
  bgGradient: string;
}

export interface AppliedSticker {
  id: string; // unique placement instance ID (e.g. "app-stk-...")
  stickerId: string;
  x: number; // percentage (0 - 100) relative to ticket width
  y: number; // percentage (0 - 100) relative to ticket height
  scale: number; // multiplier, e.g. 0.6 to 2.0 (default 1.0)
  rotation: number; // degrees -180 to 180 (default 0)
}

export interface StickerInventoryState {
  [stickerId: string]: {
    discovered: boolean; // has been seen/unlocked in StickerBook
    count: number; // currently available copies to use on coupons
    discoveredAt?: string; // ISO date string
  };
}

export interface StickerPackResult {
  stickers: StickerDefinition[];
  newDiscoveries: string[]; // IDs of stickers discovered for the first time
}

export interface StickerProgression {
  level: number;
  xp: number;
  xpToNextLevel: number;
  unopenedPacks: number;
  totalPacksOpened: number;
  redeemedCount: number;
  sharedCount: number;
}
