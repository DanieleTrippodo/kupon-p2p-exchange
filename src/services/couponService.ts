import { Coupon, CreateCouponInput, RedemptionResult } from '../types/coupon';
import { QRService } from './qrService';

const STORAGE_KEY = 'kupon_p2p_wallet_v1';

// Initial seed data mirroring Google Stitch project demo
export const SEED_COUPONS: Coupon[] = [
  {
    id: 'kpn-caffe-01',
    sender_id: 'Sarah',
    recipient_id: 'You',
    title: 'Caffè Gratis',
    description: "Da Luigi's Bar - Un caffè pagato al bar preferito!",
    icon_name: 'local_cafe',
    color_theme: 'peach',
    qr_token: 'kpn_tok_caffe01_99182a',
    status: 'active',
    secret_message: 'Ti offro anche una brioche al pistacchio! 🥐✨',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    redeemed_at: null,
  },
  {
    id: 'kpn-pizza-02',
    sender_id: 'Leo',
    recipient_id: 'You',
    title: '-20% Pizzeria',
    description: 'Bella Napoli - Valido per una pizza margherita con birra.',
    icon_name: 'local_pizza',
    color_theme: 'matcha',
    qr_token: 'kpn_tok_pizza02_88319f',
    status: 'active',
    secret_message: 'Pago io anche il dolce e limoncello finale! 🍕🍋',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    redeemed_at: null,
  },
  {
    id: 'kpn-bus-03',
    sender_id: 'Anna',
    recipient_id: 'You',
    title: 'Biglietto Bus',
    description: 'Corsa Singola Metropolitana & Bus urbano.',
    icon_name: 'directions_bus',
    color_theme: 'butter',
    qr_token: 'kpn_tok_bus03_77218d',
    status: 'active',
    secret_message: 'Buon viaggio! Ricordati di mandarmi un messaggio all\'arrivo ❤️',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    redeemed_at: null,
  },
  {
    id: 'kpn-cinema-04',
    sender_id: 'Marco',
    recipient_id: 'You',
    title: 'Cinema 2x1',
    description: 'Multisala Astra - Entrata doppia per il prossimo film.',
    icon_name: 'movie',
    color_theme: 'lilac',
    qr_token: 'kpn_tok_cine04_66190c',
    status: 'active',
    secret_message: 'I popcorn maxi al burro li offro io! 🍿🎬',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    redeemed_at: null,
  },
  {
    id: 'kpn-abbraccio-05',
    sender_id: 'Elena',
    recipient_id: 'You',
    title: 'Un Abbraccio Gratis',
    description: 'Valido in qualsiasi momento senza scadenza!',
    icon_name: 'favorite',
    color_theme: 'peach',
    qr_token: 'kpn_tok_hug05_120938',
    status: 'redeemed',
    secret_message: 'Sei la persona migliore del mondo! Ti voglio bene tantissimo! 🥰✨',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    redeemed_at: new Date(Date.now() - 3600000 * 0.5).toISOString(), // Redeemed 30 mins ago
  },
];

type CouponEventListener = (event: { type: 'CREATED' | 'REDEEMED' | 'DELETED' | 'RESET'; coupon?: Coupon }) => void;

class RealtimeEventBus {
  private listeners: Set<CouponEventListener> = new Set();

  public subscribe(listener: CouponEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(type: 'CREATED' | 'REDEEMED' | 'DELETED' | 'RESET', coupon?: Coupon) {
    this.listeners.forEach((listener) => {
      try {
        listener({ type, coupon });
      } catch (err) {
        console.error('Error in realtime listener:', err);
      }
    });
  }
}

export const realtimeBus = new RealtimeEventBus();

/**
 * Coupon CRUD & Persistence Service
 */
export class CouponService {
  /**
   * Check if user completed first run onboarding
   */
  public static hasCompletedSetup(): boolean {
    try {
      return localStorage.getItem('kupon_setup_completed_v1') === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Set onboarding completed status
   */
  public static setSetupCompleted(completed: boolean): void {
    try {
      localStorage.setItem('kupon_setup_completed_v1', completed ? 'true' : 'false');
    } catch {
      // ignore
    }
  }

  /**
   * Create a welcome coupon specifically customized for the new user
   */
  public static createWelcomeCoupon(userName: string): Coupon {
    return {
      id: 'kpn-welcome-01',
      sender_id: 'Kupon Team 🎟️',
      recipient_id: userName || 'Te',
      title: 'Kupon di Benvenuto ✨',
      description: 'Benvenuto su Kupon! Prova a cliccare "Riscatta" per scoprire il messaggio segreto!',
      icon_name: 'auto_awesome',
      color_theme: 'peach',
      qr_token: 'kpn_tok_welcome_9901',
      status: 'active',
      secret_message: 'Congratulazioni per aver completato la configurazione iniziale! Ora puoi creare, regalare e scambiare coupon reali con amici e familiari! 🎉🍕☕',
      created_at: new Date().toISOString(),
      redeemed_at: null,
    };
  }

  /**
   * Fetch all coupons from storage or seed defaults
   */
  public static getCoupons(): Coupon[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage not available
    }

    // Default to empty array if no storage exists
    return [];
  }

  /**
   * Save coupons to local storage
   */
  public static saveCoupons(coupons: Coupon[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    } catch (err) {
      console.warn('Failed to persist to localStorage:', err);
    }
  }

  /**
   * Create a new coupon
   */
  public static createCoupon(input: CreateCouponInput): Coupon {
    const coupons = this.getCoupons();
    const id = `kpn-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const qr_token = QRService.generateToken(id);

    const newCoupon: Coupon = {
      id,
      sender_id: input.sender_id || 'You',
      recipient_id: input.recipient_id || 'Friend',
      title: input.title,
      description: input.description,
      icon_name: input.icon_name,
      color_theme: input.color_theme,
      qr_token,
      status: 'active',
      secret_message: input.secret_message?.trim() || undefined,
      appliedStickers: input.appliedStickers,
      created_at: new Date().toISOString(),
      redeemed_at: null,
    };

    const updated = [newCoupon, ...coupons];
    this.saveCoupons(updated);
    realtimeBus.emit('CREATED', newCoupon);
    return newCoupon;
  }

  /**
   * Process a scanned QR code or token: supports both Transfer (adding to wallet) and Redeem (tearing ticket)
   */
  public static processScannedCode(rawScannedText: string): RedemptionResult {
    const parsed = QRService.parseScannedData(rawScannedText);
    const coupons = this.getCoupons();

    // 1. TRANSFER ACTION (Moving Kupon from sender into recipient's wallet)
    if (parsed.action === 'transfer' && parsed.fullCouponData && parsed.fullCouponData.title) {
      const giftData = parsed.fullCouponData;
      
      // Check if already in wallet
      const existing = coupons.find(
        (c) => c.qr_token === parsed.token || (parsed.couponId && c.id === parsed.couponId)
      );

      if (existing) {
        return {
          success: true,
          action: 'transferred',
          coupon: existing,
          message: `Questo Kupon "${existing.title}" è già presente nel tuo portafoglio!`,
        };
      }

      const newTransferredCoupon: Coupon = {
        id: giftData.id || `kpn-${Date.now().toString(36)}`,
        title: giftData.title || 'Kupon Regalo',
        description: giftData.description || '',
        icon_name: giftData.icon_name || 'redeem',
        color_theme: giftData.color_theme || 'peach',
        sender_id: giftData.sender_id || 'Un amico',
        recipient_id: 'You',
        secret_message: giftData.secret_message,
        appliedStickers: giftData.appliedStickers,
        qr_token: giftData.qr_token || parsed.token,
        status: 'active',
        created_at: giftData.created_at || new Date().toISOString(),
        redeemed_at: null,
      };

      const updated = [newTransferredCoupon, ...coupons];
      this.saveCoupons(updated);
      realtimeBus.emit('CREATED', newTransferredCoupon);

      return {
        success: true,
        action: 'transferred',
        coupon: newTransferredCoupon,
        message: `🎁 Evviva! "${newTransferredCoupon.title}" aggiunto al tuo Portafoglio da ${newTransferredCoupon.sender_id}!`,
      };
    }

    // 2. REDEEM ACTION (Tearing and consuming ticket)
    return this.redeemByToken(rawScannedText);
  }

  /**
   * Remove a coupon from sender's wallet when successfully handed over to a friend
   */
  public static removeTransferredCoupon(couponId: string): void {
    const coupons = this.getCoupons();
    const updated = coupons.filter((c) => c.id !== couponId && c.qr_token !== couponId);
    this.saveCoupons(updated);
    realtimeBus.emit('DELETED');
  }

  /**
   * Redeem a coupon atomically by token or ID (supports both local wallet and peer-presented coupons)
   */
  public static redeemByToken(tokenOrId: string): RedemptionResult {
    const parsed = QRService.parseScannedData(tokenOrId);
    const { token, couponId } = parsed;
    const coupons = this.getCoupons();

    // 1. Check if the coupon exists in our local wallet
    const target = coupons.find(
      (c) => c.qr_token === token || c.id === token || (couponId && c.id === couponId)
    );

    if (target) {
      if (target.status === 'redeemed') {
        return {
          success: false,
          coupon: target,
          message: `Il Kupon "${target.title}" è già stato strappato e riscattato alle ${new Date(
            target.redeemed_at || ''
          ).toLocaleTimeString()}!`,
          errorCode: 'ALREADY_REDEEMED',
        };
      }

      // Atomic update in local wallet
      const updatedCoupon: Coupon = {
        ...target,
        status: 'redeemed',
        redeemed_at: new Date().toISOString(),
      };

      const updatedList = coupons.map((c) => (c.id === target.id ? updatedCoupon : c));
      this.saveCoupons(updatedList);
      realtimeBus.emit('REDEEMED', updatedCoupon);

      return {
        success: true,
        action: 'redeemed',
        coupon: updatedCoupon,
        message: `🎉 Biglietto strappato! "${updatedCoupon.title}" riscattato con successo!`,
      };
    }

    // 2. PEER REDEMPTION: The coupon is presented by a friend to you to validate/honor
    if (parsed.fullCouponData && parsed.fullCouponData.title) {
      const peerCoupon: Coupon = {
        id: parsed.couponId || `kpn-${Date.now().toString(36)}`,
        title: parsed.fullCouponData.title || 'Kupon',
        description: parsed.fullCouponData.description || '',
        icon_name: parsed.fullCouponData.icon_name || 'redeem',
        color_theme: parsed.fullCouponData.color_theme || 'peach',
        sender_id: parsed.fullCouponData.sender_id || 'Amico',
        recipient_id: 'You',
        secret_message: parsed.fullCouponData.secret_message,
        appliedStickers: parsed.fullCouponData.appliedStickers,
        qr_token: parsed.token,
        status: 'redeemed',
        created_at: parsed.fullCouponData.created_at || new Date().toISOString(),
        redeemed_at: new Date().toISOString(),
      };

      return {
        success: true,
        action: 'redeemed',
        coupon: peerCoupon,
        message: `🎉 Biglietto convalidato! "${peerCoupon.title}" riscattato con successo!`,
      };
    }

    return {
      success: false,
      message: 'Kupon non trovato! Verifica il codice QR o il token ID.',
      errorCode: 'NOT_FOUND',
    };
  }

  /**
   * Reset store to initial seed data
   */
  public static resetToSeed(): Coupon[] {
    this.saveCoupons(SEED_COUPONS);
    realtimeBus.emit('RESET');
    return SEED_COUPONS;
  }

  /**
   * Clear all coupons from wallet
   */
  public static clearWallet(): void {
    this.saveCoupons([]);
    realtimeBus.emit('RESET');
  }

  /**
   * Clear only redeemed coupons
   */
  public static clearRedeemed(): void {
    const coupons = this.getCoupons();
    const active = coupons.filter((c) => c.status === 'active');
    this.saveCoupons(active);
    realtimeBus.emit('RESET');
  }
}
