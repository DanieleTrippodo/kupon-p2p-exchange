import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Coupon, QRModalMode } from '../types/coupon';
import { THEME_CLASSES, MASCOT } from '../theme/tokens';
import { QRService } from '../services/qrService';
import { sound } from '../services/soundService';

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

  if (!coupon) return null;

  const isTransfer = mode === 'transfer';
  const theme = THEME_CLASSES[coupon.color_theme] || THEME_CLASSES.peach;

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
            <p className="font-body text-xs text-center text-on-surface-variant max-w-[270px]">
              {isTransfer
                ? 'Fai inquadrare questo QR code dal tuo amico: il Kupon si salverà nel suo wallet.'
                : 'Fai inquadrare questo QR code per strappare e riscuotere il regalo!'}
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
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-surface-container-lowest border-2 border-on-background text-on-background font-headline text-sm font-bold py-2.5 px-8 rounded-full shadow-tactile hover:shadow-tactile-sm active:translate-y-0.5 active:shadow-none transition-all"
        >
          Chiudi Biglietto
        </button>
      </div>
    </div>
  );
};
