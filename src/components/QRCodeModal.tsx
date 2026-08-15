import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Coupon, QRModalMode } from '../types/coupon';
import { THEME_CLASSES, MASCOT } from '../theme/tokens';
import { QRService } from '../services/qrService';
import { sound } from '../services/soundService';
import { useCouponStore } from '../store/couponStore';
import { P2PSyncService, P2PClaimEvent } from '../services/p2pSyncService';
import { fireRedemptionConfetti } from './Confetti';

interface QRCodeModalProps {
  coupon: Coupon | null;
  mode?: QRModalMode;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  coupon,
  mode = 'redeem',
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [claimEvent, setClaimEvent] = useState<P2PClaimEvent | null>(null);
  const removeCoupon = useCouponStore((state) => state.removeCoupon);
  const redeemCoupon = useCouponStore((state) => state.redeemCoupon);

  const isTransfer = mode === 'transfer';
  const theme = coupon ? THEME_CLASSES[coupon.color_theme] || THEME_CLASSES.peach : THEME_CLASSES.peach;

  // Real-time P2P Listen for peer scanning
  useEffect(() => {
    if (!coupon) return;
    setClaimEvent(null);

    const unsubscribe = P2PSyncService.listenForClaim(coupon.qr_token, (event) => {
      console.log('P2P Claim signal received:', event);
      setClaimEvent(event);

      if (event.action === 'transferred') {
        sound.playCreateGift();
        setTimeout(() => sound.playSuccessChime(), 150);
        fireRedemptionConfetti();
        // Remove from sender's wallet
        removeCoupon(coupon.id);
      } else {
        sound.playPaperTear();
        setTimeout(() => sound.playSuccessChime(), 150);
        fireRedemptionConfetti();
        // Mark as redeemed
        redeemCoupon(coupon.id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [coupon, removeCoupon, redeemCoupon]);

  if (!coupon) return null;

  // Choose payload based on mode
  const qrData = isTransfer
    ? QRService.encodeTransferPayload(coupon)
    : QRService.encodeRedeemPayload(coupon);

  const handleCopyToken = () => {
    sound.playCuteTap();
    navigator.clipboard.writeText(coupon.qr_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualTransferConfirm = () => {
    sound.playCuteTap();
    if (window.confirm('Vuoi confermare la consegna e rimuovere questo Kupon dal tuo portafoglio?')) {
      sound.playCreateGift();
      fireRedemptionConfetti();
      removeCoupon(coupon.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-50 w-full max-w-sm mx-auto animate-modal-enter flex flex-col items-center">
        {/* Ticket Outer Container */}
        <div className="w-full bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile-modal overflow-hidden">
          
              {/* REAL-TIME CLAIM CONFIRMATION OVERLAY */}
          {claimEvent ? (
            <div className="p-6 text-center flex flex-col items-center gap-3 bg-surface-container-lowest animate-modal-enter">
              <div className={`w-16 h-16 rounded-full border-2 border-on-background p-2 flex items-center justify-center ${
                claimEvent.action === 'transferred' ? 'bg-secondary-container' : 'bg-primary-container'
              }`}>
                <span className="material-symbols-outlined text-3xl text-on-background">
                  {claimEvent.action === 'transferred' ? 'card_giftcard' : 'check_circle'}
                </span>
              </div>

              <span className={`font-headline text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border border-on-background shadow-tactile-sm ${
                claimEvent.action === 'transferred' ? 'bg-secondary-container text-on-background' : 'bg-primary-container text-on-background'
              }`}>
                {claimEvent.action === 'transferred' ? '🎁 Trasferimento Completato!' : '🎟️ Biglietto Riscattato!'}
              </span>

              <h2 className="font-headline text-xl font-extrabold text-on-background">
                {claimEvent.action === 'transferred'
                  ? 'Kupon Consegnato con Successo!'
                  : 'Kupon Riscattato con Successo!'}
              </h2>

              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {claimEvent.action === 'transferred' ? (
                  <>
                    <strong>{claimEvent.claimerName || 'Il tuo amico'}</strong> ha appena inquadrato il QR code. Il biglietto è stato trasferito nel suo portafoglio ed è stato rimosso dal tuo.
                  </>
                ) : (
                  <>
                    <strong>{claimEvent.claimerName || 'Il tuo amico'}</strong> ha appena strappato e riscosso questo biglietto!
                  </>
                )}
              </p>

              {/* Secret Message Unlocked on Redemption */}
              {claimEvent.action === 'redeemed' && coupon.secret_message && (
                <div className="w-full mt-1 p-3.5 bg-primary-container rounded-2xl border-2 border-on-background shadow-tactile-sm text-left animate-modal-enter">
                  <div className="flex items-center gap-1.5 text-primary mb-1">
                    <span className="material-symbols-outlined text-base">lock_open</span>
                    <span className="font-headline text-[10px] font-extrabold uppercase">
                      Messaggio Segreto da {coupon.sender_id}:
                    </span>
                  </div>
                  <p className="font-body text-xs font-bold text-on-background">
                    "{coupon.secret_message}"
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  sound.playCuteTap();
                  onClose();
                }}
                className="mt-2 w-full py-3 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-xs font-black rounded-full border-2 border-on-background shadow-tactile active:scale-95 transition-all"
              >
                Fantastico! Chiudi
              </button>
            </div>
          ) : (
            <>
              {/* Top Section: Header & Mascot */}
              <div className={`p-5 text-center flex flex-col items-center gap-2 ${theme.bg}`}>
                {/* Mode Pill Indicator */}
                <span
                  className={`font-headline text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border border-on-background shadow-tactile-sm ${
                    isTransfer
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  {isTransfer ? '🎁 Invia Kupon (Passaggio di Proprietà)' : '🎟️ Mostra per Riscatto'}
                </span>

                <div className="w-16 h-16 rounded-full border-2 border-on-background bg-surface-container-lowest p-1 shadow-tactile-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-background">
                    {coupon.icon_name}
                  </span>
                </div>

                <h2 className="font-headline text-xl font-extrabold text-on-background tracking-tight">
                  {coupon.title}
                </h2>

                <p className="font-body text-xs text-on-background/80 px-4 line-clamp-2">
                  {coupon.description || 'Nessuna descrizione'}
                </p>
              </div>

              {/* Perforated Divider with Punch Holes */}
              <div className="relative w-full h-4 bg-surface-container-lowest flex items-center justify-center my-1">
                <div className="absolute -left-3 w-6 h-6 bg-background border-r-2 border-on-background rounded-full" />
                <div className="w-[85%] border-t-2 border-dashed border-on-background opacity-60" />
                <div className="absolute -right-3 w-6 h-6 bg-background border-l-2 border-on-background rounded-full" />
              </div>

              {/* Bottom Section: Real QR Code & Token */}
              <div className="p-5 flex flex-col items-center gap-3 bg-surface-container-lowest">
                {/* Real-Time Live Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/80 border border-on-background/20 text-[11px] font-headline font-bold text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>In attesa di scansione dal vivo... 📡</span>
                </div>

                <p className="font-body text-xs text-center text-on-surface-variant max-w-[270px]">
                  {isTransfer
                    ? 'Fai inquadrare questo QR code dal tuo amico: il Kupon si salverà istantaneamente nel suo wallet e sparirà dal tuo!'
                    : 'Fai inquadrare questo QR code dal tuo amico per riscuotere, oppure usa il pulsante qui sotto!'}
                </p>

                {/* High Contrast QR Code Frame */}
                <div className="p-3.5 bg-white rounded-2xl border-2 border-on-background shadow-tactile-sm flex flex-col items-center">
                  <QRCodeSVG
                    value={qrData}
                    size={185}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: MASCOT.avatarUrl,
                      x: undefined,
                      y: undefined,
                      height: 38,
                      width: 38,
                      excavate: true,
                    }}
                  />
                </div>

                {/* Token Badge with Copy */}
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-variant rounded-full border border-on-background/30 text-[11px] font-mono font-bold text-on-surface hover:bg-secondary-container transition-colors"
                  title="Copia codice token"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copiato negli appunti!' : coupon.qr_token.slice(0, 20) + '...'}</span>
                </button>

                {/* Direct Self-Redeem / Tear Button */}
                {!isTransfer && coupon.status !== 'redeemed' && (
                  <button
                    onClick={() => {
                      sound.playPaperTear();
                      setTimeout(() => sound.playSuccessChime(), 150);
                      fireRedemptionConfetti();
                      redeemCoupon(coupon.id);
                      setClaimEvent({
                        action: 'redeemed',
                        token: coupon.qr_token,
                        couponId: coupon.id,
                        senderName: coupon.sender_id,
                        claimerName: 'Te',
                        timestamp: new Date().toISOString(),
                      });
                    }}
                    className="w-full mt-1 py-3 bg-secondary-container hover:bg-secondary-fixed text-on-background font-headline text-xs font-black rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">content_cut</span>
                    <span>Strappa e Riscatta Ora ✂️</span>
                  </button>
                )}

                {/* Manual Transfer Fallback Button (useful in offline / low-signal areas) */}
                {isTransfer && (
                  <button
                    onClick={handleManualTransferConfirm}
                    className="mt-1 text-[11px] font-headline font-bold text-on-surface-variant hover:text-error underline cursor-pointer transition-colors"
                  >
                    Hai già consegnato? Rimuovi dal mio wallet
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Dismiss Button */}
        {!claimEvent && (
          <button
            onClick={onClose}
            className="mt-4 bg-surface-container-lowest border-2 border-on-background text-on-background font-headline text-sm font-bold py-2.5 px-8 rounded-full shadow-tactile hover:shadow-tactile-sm active:translate-y-0.5 active:shadow-none transition-all"
          >
            Chiudi Biglietto
          </button>
        )}
      </div>
    </div>
  );
};

