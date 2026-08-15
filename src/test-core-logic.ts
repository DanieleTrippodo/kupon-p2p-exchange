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

console.log('✅ ALL CORE LOGIC & LIFECYCLE TESTS PASSED PERFECTLY!');
