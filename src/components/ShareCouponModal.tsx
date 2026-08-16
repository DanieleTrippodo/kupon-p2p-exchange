import React, { useState } from 'react';
import { Coupon, ColorTheme } from '../types/coupon';
import { THEME_CLASSES } from '../theme/tokens';
import { sound } from '../services/soundService';

import { useCouponStore } from '../store/couponStore';

interface ShareCouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onOpenQR?: (coupon: Coupon, mode?: 'redeem' | 'transfer') => void;
}

export const ShareCouponModal: React.FC<ShareCouponModalProps> = ({
  coupon,
  onClose,
  onOpenQR,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const rewardShareAction = useCouponStore((state) => state.rewardShareAction);

  if (!coupon) return null;

  const validTheme: ColorTheme = coupon.color_theme || 'peach';
  const theme = THEME_CLASSES[validTheme] || THEME_CLASSES.peach;

  // Build a universal claimable link with token & encoded payload
  const currentOrigin = window.location.origin;
  const encodedGift = encodeURIComponent(
    JSON.stringify({
      id: coupon.id,
      title: coupon.title,
      desc: coupon.description,
      icon: coupon.icon_name,
      theme: coupon.color_theme,
      token: coupon.qr_token,
      sender: coupon.sender_id || 'Un tuo amico',
      secret: coupon.secret_message || '',
      appliedStickers: coupon.appliedStickers,
    })
  );
  const shareUrl = `${currentOrigin}/?gift=${encodedGift}`;

  const shareText = `🎁 ${coupon.sender_id || 'Ti'} ho regalato un Kupon: "${coupon.title}"! ${
    coupon.description ? `(${coupon.description})` : ''
  }\n\nApri il tuo regalo su Kupon qui:\n${shareUrl}`;

  // Native Web Share API
  const handleNativeShare = async () => {
    sound.playCuteTap();
    rewardShareAction();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kupon: ${coupon.title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    sound.playCuteTap();
    rewardShareAction();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Telegram Share
  const handleTelegramShare = () => {
    sound.playCuteTap();
    rewardShareAction();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      `🎁 Ho un Kupon regalo per te: "${coupon.title}"!`
    )}`;
    window.open(tgUrl, '_blank');
  };

  // Copy Link
  const handleCopyLink = () => {
    sound.playCuteTap();
    rewardShareAction();
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy Token Only
  const handleCopyToken = () => {
    sound.playCuteTap();
    navigator.clipboard.writeText(coupon.qr_token);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-sm mx-auto animate-modal-enter bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile-modal overflow-hidden p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              send
            </span>
            <h3 className="font-headline text-lg font-extrabold text-on-background">
              Invia Kupon a {coupon.recipient_id || 'un amico'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-on-background/30 hover:bg-surface-container"
          >
            ✕
          </button>
        </div>

        {/* Mini Preview Ticket */}
        <div
          className={`p-3.5 rounded-2xl border-2 border-on-background shadow-tactile-sm ${theme.bg} flex items-center gap-3`}
        >
          <div className="w-12 h-12 rounded-full border-2 border-on-background bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-on-background">
              {coupon.icon_name}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-headline text-sm font-extrabold text-on-background truncate">
              {coupon.title}
            </h4>
            <p className="font-body text-xs text-on-surface-variant truncate">
              {coupon.description || 'Nessuna descrizione'}
            </p>
          </div>
        </div>

        {/* Share Options Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Scegli come inviarlo:
          </span>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-on-background font-headline text-xs font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm flex items-center justify-between transition-all active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm">
                💬
              </span>
              <span>Invia su WhatsApp</span>
            </div>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>

          {/* Telegram Button */}
          <button
            onClick={handleTelegramShare}
            className="w-full py-3 px-4 bg-[#0088CC]/20 hover:bg-[#0088CC]/30 text-on-background font-headline text-xs font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm flex items-center justify-between transition-all active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#0088CC] text-white flex items-center justify-center font-bold text-sm">
                ✈️
              </span>
              <span>Invia su Telegram</span>
            </div>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>

          {/* Native Share Sheet (SMS / Instagram / AirDrop) */}
          <button
            onClick={handleNativeShare}
            className="w-full py-3 px-4 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-xs font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm flex items-center justify-between transition-all active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-xl text-primary">
                share
              </span>
              <span>Altre App (SMS, Email, AirDrop...)</span>
            </div>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>

          {/* Show QR Code in person for TRANSFER */}
          {onOpenQR && (
            <button
              onClick={() => {
                onClose();
                onOpenQR(coupon, 'transfer');
              }}
              className="w-full py-3 px-4 bg-secondary-container hover:bg-secondary-fixed text-on-background font-headline text-xs font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm flex items-center justify-between transition-all active:translate-y-0.5 active:shadow-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-secondary">
                  qr_code_scanner
                </span>
                <span>Mostra QR Code dal vivo (Passaggio di Proprietà)</span>
              </div>
              <span className="material-symbols-outlined text-base">visibility</span>
            </button>
          )}
        </div>

        {/* Copy Link & Token Footer */}
        <div className="pt-2 border-t-2 border-on-background/10 flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-3 bg-surface-variant hover:bg-surface-container rounded-xl border border-on-background/30 text-[11px] font-headline font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copiedLink ? 'check' : 'link'}
            </span>
            <span>{copiedLink ? 'Link Copiato!' : 'Copia Link Regalo'}</span>
          </button>

          <button
            onClick={handleCopyToken}
            className="py-2.5 px-3 bg-surface-variant hover:bg-surface-container rounded-xl border border-on-background/30 text-[11px] font-headline font-bold flex items-center justify-center gap-1.5 transition-colors"
            title="Copia solo codice token"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copiedCode ? 'check' : 'vpn_key'}
            </span>
            <span>{copiedCode ? 'Codice Copiato!' : 'Copia Token'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
