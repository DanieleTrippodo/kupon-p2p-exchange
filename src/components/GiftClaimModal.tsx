import React, { useEffect, useState } from 'react';
import { Coupon, ColorTheme } from '../types/coupon';
import { useCouponStore } from '../store/couponStore';
import { THEME_CLASSES, MASCOT } from '../theme/tokens';
import { fireRedemptionConfetti } from './Confetti';
import { sound } from '../services/soundService';

export const GiftClaimModal: React.FC = () => {
  const [incomingGift, setIncomingGift] = useState<Partial<Coupon> | null>(null);
  const createCoupon = useCouponStore((state) => state.createCoupon);
  const coupons = useCouponStore((state) => state.coupons);
  const showToast = useCouponStore((state) => state.showToast);

  useEffect(() => {
    // Parse URL query parameter: ?gift={json} or ?claim={token}
    const params = new URLSearchParams(window.location.search);
    const giftData = params.get('gift');

    if (giftData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(giftData));
        // Check if already in wallet
        const exists = coupons.some((c) => c.qr_token === parsed.token || c.id === parsed.id);
        if (!exists && parsed.title) {
          sound.playSecretUnlocked();
          setIncomingGift({
            id: parsed.id,
            title: parsed.title,
            description: parsed.desc,
            icon_name: parsed.icon || 'redeem',
            color_theme: parsed.theme || 'peach',
            sender_id: parsed.sender || 'Un amico',
            recipient_id: 'You',
            secret_message: parsed.secret,
            qr_token: parsed.token,
          });
        }
      } catch (err) {
        console.warn('Failed to parse gift from URL:', err);
      }
    }
  }, [coupons]);

  if (!incomingGift) return null;

  const validTheme: ColorTheme = (incomingGift.color_theme as ColorTheme) || 'peach';
  const theme = THEME_CLASSES[validTheme] || THEME_CLASSES.peach;

  const handleAcceptGift = () => {
    sound.playCreateGift();
    setTimeout(() => sound.playSuccessChime(), 150);

    createCoupon({
      title: incomingGift.title || 'Kupon Regalo',
      description: incomingGift.description || '',
      icon_name: incomingGift.icon_name || 'redeem',
      color_theme: validTheme,
      recipient_id: 'You',
      sender_id: incomingGift.sender_id || 'Amico',
      secret_message: incomingGift.secret_message,
    });

    fireRedemptionConfetti();
    showToast(`🎁 Kupon "${incomingGift.title}" aggiunto al tuo Portafoglio!`, 'success');

    // Clean URL without reloading
    window.history.replaceState({}, document.title, window.location.pathname);
    setIncomingGift(null);
  };

  const handleDismiss = () => {
    sound.playCuteTap();
    window.history.replaceState({}, document.title, window.location.pathname);
    setIncomingGift(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-sm mx-auto animate-modal-enter bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile-modal overflow-hidden p-6 flex flex-col items-center text-center gap-4">
        {/* Mascot Animation */}
        <div className="w-20 h-20 rounded-full border-2 border-on-background bg-primary-container p-1 shadow-tactile-sm flex items-center justify-center -mt-2">
          <img
            src={MASCOT.mascotCheer}
            alt="Mascot Gift"
            className="w-full h-full object-contain animate-mascot-bounce"
          />
        </div>

        <div>
          <span className="font-headline text-[11px] font-extrabold uppercase tracking-wider bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full border border-on-background/30 shadow-tactile-sm">
            🎁 Regalo in Arrivo!
          </span>
          <h2 className="font-headline text-2xl font-extrabold text-on-background mt-2">
            {incomingGift.sender_id} ti ha regalato un Kupon!
          </h2>
        </div>

        {/* Gift Ticket Card */}
        <div
          className={`w-full p-4 rounded-2xl border-2 border-on-background shadow-tactile ${theme.bg} text-left flex items-center gap-3`}
        >
          <div className="w-14 h-14 rounded-full border-2 border-on-background bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-3xl text-on-background">
              {incomingGift.icon_name}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-headline text-base font-extrabold text-on-background truncate">
              {incomingGift.title}
            </h3>
            <p className="font-body text-xs text-on-surface-variant truncate">
              {incomingGift.description || 'Valido in qualsiasi momento'}
            </p>
            {incomingGift.secret_message && (
              <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold text-primary mt-0.5">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                <span>Contiene un messaggio segreto!</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={handleAcceptGift}
            className="w-full py-3.5 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-sm font-extrabold rounded-full border-2 border-on-background shadow-tactile hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">
              account_balance_wallet
            </span>
            <span>Accetta & Salva nel Portafoglio</span>
          </button>

          <button
            onClick={handleDismiss}
            className="text-on-surface-variant text-xs font-headline font-bold hover:underline py-1"
          >
            Ignora per ora
          </button>
        </div>
      </div>
    </div>
  );
};
