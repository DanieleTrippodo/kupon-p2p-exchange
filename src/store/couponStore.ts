import { create } from 'zustand';
import { Coupon, CreateCouponInput, RedemptionResult, TabType, QRModalMode, UserProfile } from '../types/coupon';
import { CouponService, realtimeBus } from '../services/couponService';
import { MASCOT } from '../theme/tokens';

const USER_PROFILE_STORAGE_KEY = 'kupon_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Creator',
  handle: '@alex_kupon',
  avatar: MASCOT.avatarUrl,
  bio: 'Regalo caffè, sorrisi e buone pizze nel weekend! 🍕☕',
  favoriteTheme: 'peach',
  defaultSenderName: 'Alex',
  soundEnabled: true,
};

function loadStoredProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
}

interface CouponState {
  coupons: Coupon[];
  userProfile: UserProfile;
  activeTab: TabType;
  selectedCouponForQR: Coupon | null;
  qrModalMode: QRModalMode;
  selectedCouponForShare: Coupon | null;
  isScannerOpen: boolean;
  filterStatus: 'all' | 'active' | 'redeemed';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setFilterStatus: (status: 'all' | 'active' | 'redeemed') => void;
  openQRModal: (coupon: Coupon, mode?: QRModalMode) => void;
  closeQRModal: () => void;
  openShareModal: (coupon: Coupon) => void;
  closeShareModal: () => void;
  openScanner: () => void;
  closeScanner: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  // Profile actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Data actions
  loadCoupons: () => void;
  createCoupon: (input: CreateCouponInput) => Coupon;
  processScannedCode: (rawScannedText: string) => RedemptionResult;
  redeemCoupon: (tokenOrId: string) => RedemptionResult;
  removeCoupon: (couponId: string) => void;
  resetCoupons: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => {
  // Subscribe to real-time events to keep multi-tab / event store in sync
  realtimeBus.subscribe(({ type }) => {
    if (type === 'CREATED' || type === 'REDEEMED' || type === 'DELETED' || type === 'RESET') {
      set({ coupons: CouponService.getCoupons() });
    }
  });

  return {
    coupons: CouponService.getCoupons(),
    userProfile: loadStoredProfile(),
    activeTab: 'wallet',
    selectedCouponForQR: null,
    qrModalMode: 'redeem',
    selectedCouponForShare: null,
    isScannerOpen: false,
    filterStatus: 'all',
    toast: null,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setFilterStatus: (filterStatus) => set({ filterStatus }),
    openQRModal: (coupon, mode = 'redeem') =>
      set({ selectedCouponForQR: coupon, qrModalMode: mode }),
    closeQRModal: () => set({ selectedCouponForQR: null, qrModalMode: 'redeem' }),
    openShareModal: (coupon) => set({ selectedCouponForShare: coupon }),
    closeShareModal: () => set({ selectedCouponForShare: null }),
    openScanner: () => set({ isScannerOpen: true }),
    closeScanner: () => set({ isScannerOpen: false }),

    updateUserProfile: (updates) => {
      const updated = { ...get().userProfile, ...updates };
      set({ userProfile: updated });
      try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      get().showToast('✨ Profilo aggiornato con successo!', 'success');
    },

    showToast: (message, type = 'info') => {
      set({ toast: { message, type } });
      setTimeout(() => {
        if (get().toast?.message === message) {
          set({ toast: null });
        }
      }, 3500);
    },
    hideToast: () => set({ toast: null }),

    loadCoupons: () => {
      set({ coupons: CouponService.getCoupons() });
    },

    createCoupon: (input) => {
      const newCoupon = CouponService.createCoupon({
        ...input,
        sender_id: input.sender_id || get().userProfile.defaultSenderName || get().userProfile.name,
      });
      set({ coupons: CouponService.getCoupons(), activeTab: 'wallet' });
      get().showToast(`✨ Creato "${newCoupon.title}"!`, 'success');
      return newCoupon;
    },

    processScannedCode: (rawScannedText) => {
      const result = CouponService.processScannedCode(rawScannedText);
      if (result.success) {
        set({ coupons: CouponService.getCoupons() });
        get().showToast(result.message, 'success');
      } else {
        get().showToast(result.message, 'error');
      }
      return result;
    },

    redeemCoupon: (tokenOrId) => {
      return get().processScannedCode(tokenOrId);
    },

    removeCoupon: (couponId) => {
      CouponService.removeTransferredCoupon(couponId);
      set({ coupons: CouponService.getCoupons() });
      get().showToast('Kupon trasferito e rimosso dal tuo portafoglio.', 'info');
    },

    resetCoupons: () => {
      const initial = CouponService.resetToSeed();
      set({ coupons: initial });
      get().showToast('🔄 Portafoglio ripristinato ai ticket demo.', 'info');
    },
  };
});
