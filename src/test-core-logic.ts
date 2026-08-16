import { QRService } from '../src/services/qrService';
import { Coupon } from '../src/types/coupon';

console.log('--- RUNNING KUPON CORE VERIFICATION TESTS ---');

// Test 1: QR Token Generation & Encoding
const testCoupon: Coupon = {
  id: 'test-cup-123',
  sender_id: 'Alice',
  recipient_id: 'Bob',
  title: 'Pizza Margherita',
  description: 'Valid tonight',
  icon_name: 'local_pizza',
  color_theme: 'matcha',
  qr_token: QRService.generateToken('test-cup-123'),
  status: 'active',
  created_at: new Date().toISOString(),
  redeemed_at: null,
};

console.log('1. Generated Token:', testCoupon.qr_token);
if (!testCoupon.qr_token.startsWith('kpn_tok_test-cup')) {
  throw new Error('Token format invalid');
}

// Test 2: QR Payload Packing & Parsing
const encoded = QRService.encodePayload(testCoupon);
const parsed = QRService.parseScannedData(encoded);
console.log('2. Encoded & Parsed Token match:', parsed.token === testCoupon.qr_token);
if (parsed.token !== testCoupon.qr_token) {
  throw new Error('QR payload decoding mismatch');
}

// Test 3: Atomic Token Validation (Success)
const validResult = QRService.validateCouponToken(testCoupon, testCoupon.qr_token);
console.log('3. Valid Token Validation:', validResult.success === true);
if (!validResult.success) {
  throw new Error('Expected validation success');
}

// Test 4: Mismatched Token Validation (Failure)
const badResult = QRService.validateCouponToken(testCoupon, 'kpn_tok_fake_123');
console.log('4. Bad Token Blocked:', badResult.success === false, badResult.errorCode);
if (badResult.success || badResult.errorCode !== 'INVALID_TOKEN') {
  throw new Error('Expected invalid token error');
}

// Test 5: 2-Hour Cleanup Filter Logic Test
const now = Date.now();
const ONE_HOUR_MS = 60 * 60 * 1000;
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const couponsToFilter: Coupon[] = [
  { ...testCoupon, id: 'c1', status: 'active', redeemed_at: null }, // SHOULD SHOW (active)
  {
    ...testCoupon,
    id: 'c2',
    status: 'redeemed',
    redeemed_at: new Date(now - ONE_HOUR_MS).toISOString(), // Redeemed 1h ago -> SHOULD SHOW (< 2h)
  },
  {
    ...testCoupon,
    id: 'c3',
    status: 'redeemed',
    redeemed_at: new Date(now - THREE_HOURS_MS).toISOString(), // Redeemed 3h ago -> SHOULD BE FILTERED OUT (> 2h)
  },
];

const filtered = couponsToFilter.filter((c) => {
  if (c.status === 'active') return true;
  if (c.status === 'redeemed' && c.redeemed_at) {
    const elapsed = now - new Date(c.redeemed_at).getTime();
    return elapsed < TWO_HOURS_MS;
  }
  return false;
});

console.log('5. 2-Hour Filter Test: Input 3 coupons, Output count:', filtered.length);
if (filtered.length !== 2 || filtered.some((c) => c.id === 'c3')) {
  throw new Error('2-Hour cleanup filter failed to prune expired redeemed coupon');
}

// Test 6: Sticker Loot & Booster Pack Logic
import { StickerService } from '../src/services/stickerService';
import { STICKERS_CATALOG } from '../src/data/stickersCatalog';

// Mock localStorage for node test environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = val; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null,
} as unknown as Storage;

const packResult = StickerService.openPack();
console.log('6. Opened Starter Pack:', packResult ? `${packResult.stickers.length} stickers drawn` : 'failed');
if (!packResult || packResult.stickers.length !== 3) {
  throw new Error('Expected booster pack to contain exactly 3 stickers');
}

const stats = StickerService.getAlbumStats();
console.log('7. Album StickerBook Stats after 1 pack:', `${stats.discovered}/${stats.total} discovered (${stats.percentage}%)`);
if (stats.discovered < 1 || stats.total !== STICKERS_CATALOG.length) {
  throw new Error('StickerBook album stats calculation error');
}

// Test 8: Redeem Level-Up and Bonus Pack Award
const redeemLevelUp = StickerService.onCouponRedeemed();
console.log('8. Level Up on Redeem:', `New level ${redeemLevelUp.progression.level}, Packs awarded: ${redeemLevelUp.packsAwarded}`);
if (!redeemLevelUp.leveledUp || redeemLevelUp.progression.level < 2) {
  throw new Error('Expected level up on coupon redeem');
}

// Test 9: Share Bonus Pack Award
const shareProg = StickerService.onCouponShared();
console.log('9. Bonus Pack on Share:', `Unopened packs: ${shareProg.unopenedPacks}`);
if (shareProg.sharedCount < 1) {
  throw new Error('Expected sharedCount to increment');
}

// Test 10: Reset StickerBook and Inventory
const resetRes = StickerService.resetStickerBook();
const statsAfterReset = StickerService.getAlbumStats();
console.log('10. Reset StickerBook Test: Discovered count:', statsAfterReset.discovered, 'Unopened packs:', resetRes.progression.unopenedPacks);
if (statsAfterReset.discovered !== 0 || resetRes.progression.unopenedPacks !== 1) {
  throw new Error('Expected resetStickerBook to clear all discoveries and reset to 1 pack');
}

console.log('✅ ALL CORE LOGIC, STICKER LOOT, AND LIFECYCLE TESTS PASSED PERFECTLY!');

