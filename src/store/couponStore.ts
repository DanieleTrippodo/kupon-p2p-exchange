import { create } from 'zustand';
import { Coupon, CreateCouponInput, RedemptionResult, TabType, QRModalMode, UserProfile } from '../types/coupon';
import { CouponService, realtimeBus } from '../services/couponService';
import { MASCOT } from '../theme/tokens';

const USER_PROFILE_STORAGE_KEY = 'kupon_user_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  handle: '',
  avatar: MASCOT.avatarUrl,
  bio: 'Regalo caffè, sorrisi e momenti speciali! 🎟️✨',
  favoriteTheme: 'peach',
  defaultSenderName: '',
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

export type StarterPackType = 'welcome_gift' | 'empty' | 'demo';

interface CouponState {
  coupons: Coupon[];
  userProfile: UserProfile;
  hasCompletedSetup: boolean;
  isOnboardingOpen: boolean;
  activeTab: TabType;
  selectedCouponForQR: Coupon | null;
  qrModalMode: QRModalMode;
  selectedCouponForShare: Coupon | null;
  isScannerOpen: boolean;
  filterStatus: 'all' | 'active' | 'redeemed';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Navigation & UI Actions
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
  
  // Setup & Profile actions
  openOnboarding: () => void;
  closeOnboarding: () => void;
  completeSetup: (profileUpdates: Partial<UserProfile>, starterPack: StarterPackType) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Data actions
  loadCoupons: () => void;
  loadDemoCoupons: () => void;
  clearAllCoupons: () => void;
  clearRedeemedCoupons: () => void;
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
    hasCompletedSetup: CouponService.hasCompletedSetup(),
    isOnboardingOpen: false,
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

    openOnboarding: () => set({ isOnboardingOpen: true }),
    closeOnboarding: () => set({ isOnboardingOpen: false }),

    completeSetup: (profileUpdates, starterPack) => {
      const cleanName = profileUpdates.name?.trim() || 'Amico Kupon';
      const cleanHandle = profileUpdates.handle?.trim() 
        ? (profileUpdates.handle.startsWith('@') ? profileUpdates.handle : `@${profileUpdates.handle}`)
        : `@${cleanName.toLowerCase().replace(/\s+/g, '_')}`;

      const updatedProfile: UserProfile = {
        ...get().userProfile,
        ...profileUpdates,
        name: cleanName,
        handle: cleanHandle,
        defaultSenderName: profileUpdates.defaultSenderName?.trim() || cleanName,
      };

      // 1. Save Profile
      set({ userProfile: updatedProfile });
      try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      } catch {
        // ignore
      }

      // 2. Initialize Starter Pack
      if (starterPack === 'welcome_gift') {
        const welcome = CouponService.createWelcomeCoupon(cleanName);
        CouponService.saveCoupons([welcome]);
      } else if (starterPack === 'demo') {
        CouponService.resetToSeed();
      } else {
        // Empty
        CouponService.saveCoupons([]);
      }

      // 3. Mark setup as completed
      CouponService.setSetupCompleted(true);

      set({
        coupons: CouponService.getCoupons(),
        hasCompletedSetup: true,
        isOnboardingOpen: false,
        activeTab: 'wallet',
      });

      get().showToast(`✨ Benvenuto su Kupon, ${cleanName}!`, 'success');
    },

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

    loadDemoCoupons: () => {
      const demoCoupons = CouponService.resetToSeed();
      set({ coupons: demoCoupons, activeTab: 'wallet' });
      get().showToast('📦 Pacchetto Demo caricato con successo!', 'success');
    },

    clearAllCoupons: () => {
      CouponService.clearWallet();
      set({ coupons: [] });
      get().showToast('🗑️ Portafoglio svuotato.', 'info');
    },

    clearRedeemedCoupons: () => {
      CouponService.clearRedeemed();
      set({ coupons: CouponService.getCoupons() });
      get().showToast('🧹 Biglietti riscattati rimossi dalla cronologia!', 'info');
    },

    createCoupon: (input) => {
      const newCoupon = CouponService.createCoupon({
        ...input,
        sender_id: input.sender_id || get().userProfile.defaultSenderName || get().userProfile.name || 'You',
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
