import { STICKERS_CATALOG } from '../data/stickersCatalog';
import {
  AppliedSticker,
  StickerDefinition,
  StickerInventoryState,
  StickerPackResult,
  StickerProgression,
  StickerRarity,
} from '../types/sticker';

const INVENTORY_STORAGE_KEY = 'kupon_sticker_inventory_v2';
const PROGRESSION_STORAGE_KEY = 'kupon_sticker_progression_v2';

export const DEFAULT_PROGRESSION: StickerProgression = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  unopenedPacks: 1, // 1 Starter Pack ready to open!
  totalPacksOpened: 0,
  redeemedCount: 0,
  sharedCount: 0,
};

export class StickerService {
  /**
   * Load current sticker inventory from storage
   */
  public static getInventory(): StickerInventoryState {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage error
    }

    // Default empty inventory (all undiscovered, 0 copies)
    const initial: StickerInventoryState = {};
    STICKERS_CATALOG.forEach((stk) => {
      initial[stk.id] = {
        discovered: false,
        count: 0,
      };
    });
    return initial;
  }

  /**
   * Save inventory to storage
   */
  public static saveInventory(inventory: StickerInventoryState): void {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
    } catch (err) {
      console.warn('Failed to save sticker inventory:', err);
    }
  }

  /**
   * Load progression state (level, XP, unopened packs)
   */
  public static getProgression(): StickerProgression {
    try {
      const stored = localStorage.getItem(PROGRESSION_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROGRESSION, ...JSON.parse(stored) };
      }
    } catch {
      // LocalStorage error
    }
    return DEFAULT_PROGRESSION;
  }

  /**
   * Save progression state
   */
  public static saveProgression(progression: StickerProgression): void {
    try {
      localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(progression));
    } catch (err) {
      console.warn('Failed to save progression:', err);
    }
  }

  /**
   * Pick a random sticker based on rarity weights
   */
  public static rollRandomSticker(): StickerDefinition {
    const roll = Math.random() * 100;
    let targetRarity: StickerRarity = 'common';

    if (roll < 4) {
      targetRarity = 'legendary'; // 4%
    } else if (roll < 18) {
      targetRarity = 'epic'; // 14%
    } else if (roll < 45) {
      targetRarity = 'rare'; // 27%
    } else {
      targetRarity = 'common'; // 55%
    }

    const pool = STICKERS_CATALOG.filter((s) => s.rarity === targetRarity);
    const candidatePool = pool.length > 0 ? pool : STICKERS_CATALOG;
    const randomIndex = Math.floor(Math.random() * candidatePool.length);
    return candidatePool[randomIndex];
  }

  /**
   * Open a Booster Pack: exactly 3 stickers with weighted probabilities!
   */
  public static openPack(): StickerPackResult | null {
    const progression = this.getProgression();
    if (progression.unopenedPacks <= 0) {
      return null;
    }

    const inventory = this.getInventory();
    const drawnStickers: StickerDefinition[] = [];
    const newDiscoveries: string[] = [];

    // Draw exactly 3 stickers
    for (let i = 0; i < 3; i++) {
      const drawn = this.rollRandomSticker();
      drawnStickers.push(drawn);

      const currentItem = inventory[drawn.id] || { discovered: false, count: 0 };
      if (!currentItem.discovered) {
        newDiscoveries.push(drawn.id);
        currentItem.discovered = true;
        currentItem.discoveredAt = new Date().toISOString();
      }
      currentItem.count = (currentItem.count || 0) + 1;
      inventory[drawn.id] = currentItem;
    }

    // Save updated inventory
    this.saveInventory(inventory);

    // Update progression
    const updatedProgression: StickerProgression = {
      ...progression,
      unopenedPacks: Math.max(0, progression.unopenedPacks - 1),
      totalPacksOpened: progression.totalPacksOpened + 1,
    };
    this.saveProgression(updatedProgression);

    return {
      stickers: drawnStickers,
      newDiscoveries,
    };
  }

  /**
   * Grant bonus mystery packs directly
   */
  public static grantPacks(count: number = 1): StickerProgression {
    const progression = this.getProgression();
    const updated: StickerProgression = {
      ...progression,
      unopenedPacks: progression.unopenedPacks + count,
    };
    this.saveProgression(updated);
    return updated;
  }

  /**
   * Add XP and process level ups
   */
  public static addXP(amount: number): {
    progression: StickerProgression;
    leveledUp: boolean;
    packsAwarded: number;
  } {
    const current = this.getProgression();
    let { level, xp, unopenedPacks } = current;
    let packsAwarded = 0;
    let leveledUp = false;

    xp += amount;
    let xpNeeded = level * 100;

    while (xp >= xpNeeded) {
      xp -= xpNeeded;
      level += 1;
      unopenedPacks += 1; // 1 pack per level up!
      packsAwarded += 1;
      leveledUp = true;
      xpNeeded = level * 100;
    }

    const updated: StickerProgression = {
      ...current,
      level,
      xp,
      xpToNextLevel: xpNeeded,
      unopenedPacks,
    };

    this.saveProgression(updated);
    return { progression: updated, leveledUp, packsAwarded };
  }

  /**
   * Called when a coupon is redeemed: increases profile XP, triggers level-up and grants mystery pack
   */
  public static onCouponRedeemed(): {
    progression: StickerProgression;
    leveledUp: boolean;
    packsAwarded: number;
  } {
    const current = this.getProgression();
    const updatedWithRedeemCount: StickerProgression = {
      ...current,
      redeemedCount: current.redeemedCount + 1,
    };
    this.saveProgression(updatedWithRedeemCount);

    // 100 XP per redeemed coupon -> causes immediate level up!
    return this.addXP(100);
  }

  /**
   * Called when a coupon is shared: gives direct mystery booster pack reward!
   */
  public static onCouponShared(): StickerProgression {
    const current = this.getProgression();
    const updated: StickerProgression = {
      ...current,
      sharedCount: current.sharedCount + 1,
      unopenedPacks: current.unopenedPacks + 1,
    };
    this.saveProgression(updated);
    return updated;
  }

  /**
   * Consume applied stickers from inventory when coupon is finalized
   */
  public static consumeStickers(appliedList: AppliedSticker[]): StickerInventoryState {
    const inventory = this.getInventory();
    appliedList.forEach((applied) => {
      if (inventory[applied.stickerId] && inventory[applied.stickerId].count > 0) {
        inventory[applied.stickerId].count -= 1;
      }
    });
    this.saveInventory(inventory);
    return inventory;
  }

  /**
   * Calculate StickerBook completion statistics
   */
  public static getAlbumStats(): {
    total: number;
    discovered: number;
    percentage: number;
    totalAvailableCopies: number;
  } {
    const inventory = this.getInventory();
    const total = STICKERS_CATALOG.length;
    let discovered = 0;
    let totalAvailableCopies = 0;

    STICKERS_CATALOG.forEach((stk) => {
      const item = inventory[stk.id];
      if (item && item.discovered) {
        discovered += 1;
      }
      if (item && item.count) {
        totalAvailableCopies += item.count;
      }
    });

    const percentage = total > 0 ? Math.round((discovered / total) * 100) : 0;
    return {
      total,
      discovered,
      percentage,
      totalAvailableCopies,
    };
  }

  /**
   * Reset all sticker discoveries, zero out all copies, and restore starter progression
   */
  public static resetStickerBook(): {
    inventory: StickerInventoryState;
    progression: StickerProgression;
  } {
    const freshInventory: StickerInventoryState = {};
    STICKERS_CATALOG.forEach((stk) => {
      freshInventory[stk.id] = {
        discovered: false,
        count: 0,
      };
    });
    this.saveInventory(freshInventory);

    const freshProgression: StickerProgression = {
      ...DEFAULT_PROGRESSION,
      unopenedPacks: 1, // 1 Starter pack ready to open
    };
    this.saveProgression(freshProgression);

    return { inventory: freshInventory, progression: freshProgression };
  }
}
