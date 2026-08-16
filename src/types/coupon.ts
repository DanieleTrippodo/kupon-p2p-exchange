import { AppliedSticker } from './sticker';

export type CouponStatus = 'active' | 'redeemed';

export type ColorTheme = 'peach' | 'matcha' | 'butter' | 'lilac';

export type IconName = string;

export type QRModalMode = 'redeem' | 'transfer';

export interface Coupon {
  id: string;
  sender_id: string;
  recipient_id: string;
  title: string;
  description: string;
  icon_name: IconName;
  color_theme: ColorTheme;
  qr_token: string; // single-use validation payload: e.g. "kpn_tok_..."
  status: CouponStatus;
  secret_message?: string; // Secret message revealed only after redemption!
  appliedStickers?: AppliedSticker[]; // Decorated stickers placed by user
  created_at: string; // ISO timestamp
  redeemed_at: string | null; // ISO timestamp or null
}

export interface CreateCouponInput {
  title: string;
  description: string;
  icon_name: IconName;
  color_theme: ColorTheme;
  recipient_id: string;
  sender_id?: string;
  secret_message?: string;
  appliedStickers?: AppliedSticker[];
}

export interface QRPayload {
  app: 'kupon-p2p';
  version: '1.0';
  action: 'transfer' | 'redeem';
  couponId: string;
  token: string;
  title?: string;
  description?: string;
  icon_name?: string;
  color_theme?: ColorTheme;
  sender?: string;
  recipient?: string;
  secret_message?: string;
  appliedStickers?: AppliedSticker[];
  timestamp: string;
}

export interface RedemptionResult {
  success: boolean;
  action?: 'transferred' | 'redeemed';
  coupon?: Coupon;
  message: string;
  errorCode?: 'ALREADY_REDEEMED' | 'INVALID_TOKEN' | 'EXPIRED' | 'NOT_FOUND';
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  favoriteTheme: ColorTheme;
  defaultSenderName: string;
  soundEnabled: boolean;
}

export type TabType = 'wallet' | 'create' | 'scan' | 'stickers' | 'profile';



