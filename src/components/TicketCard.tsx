import React from 'react';
import { THEME_CLASSES } from '../theme/tokens';
import { CouponWithCleanup } from '../hooks/useCoupons';

interface TicketCardProps {
  coupon: CouponWithCleanup;
  onRedeemClick?: (coupon: CouponWithCleanup) => void;
  onShareClick?: (coupon: CouponWithCleanup) => void;
  index?: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  coupon,
  onRedeemClick,
  onShareClick,
  index = 0,
}) => {
  const theme = THEME_CLASSES[coupon.color_theme] || THEME_CLASSES.peach;
  const isRedeemed = coupon.status === 'redeemed';
  const floatClass = isRedeemed ? '' : `float-anim-${(index % 4) + 1}`;

  return (
    <article
      className={`relative w-full flex min-h-32 md:min-h-36 rounded-2xl border-2 border-on-background bg-surface-container-lowest transition-all duration-300 ${floatClass} ${
        isRedeemed
          ? 'opacity-90 bg-gray-50 border-dashed'
          : 'shadow-tactile hover:shadow-tactile-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Main Body (Left) */}
      <div
        className={`relative flex-1 ${theme.bg} rounded-l-[14px] border-r-0 flex items-center p-3.5 md:p-4 overflow-hidden select-none`}
      >
        {/* Decorative Background Watermark Icon */}
        <span
          className="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl md:text-8xl opacity-20 pointer-events-none rotate-12 select-none"
          aria-hidden="true"
        >
          {coupon.icon_name}
        </span>

        {/* Content Container */}
        <div className="z-10 flex gap-3 md:gap-4 items-start w-full min-w-0">
          {/* Round Icon Badge */}
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-on-background bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-tactile-sm ${
              isRedeemed ? 'bg-gray-200' : ''
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl md:text-3xl ${theme.text}`}
            >
              {coupon.icon_name}
            </span>
          </div>

          {/* Text Information */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {/* Sender Pill */}
              <span className="font-headline text-[11px] font-bold text-on-background bg-surface-container-lowest/80 px-2.5 py-0.5 rounded-full border border-on-background/30 shadow-none tracking-wide">
                From: {coupon.sender_id}
              </span>

              {/* Status Stamp if Redeemed */}
              {isRedeemed && (
                <span className="font-headline text-[10px] font-extrabold uppercase tracking-wider bg-error text-white px-2 py-0.5 rounded-full border border-on-background shadow-tactile-sm animate-pulse">
                  Strappato & Riscattato
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className={`font-headline text-lg md:text-xl font-bold truncate leading-tight ${
                isRedeemed ? 'line-through text-on-background/80' : theme.text
              }`}
            >
              {coupon.title}
            </h3>

            {/* Description */}
            <p className="font-body text-xs md:text-sm text-on-background/80 truncate mt-0.5">
              {coupon.description || 'Valido in qualsiasi momento!'}
            </p>

            {/* REVEALED SECRET MESSAGE (Unlocked on redemption!) */}
            {isRedeemed && coupon.secret_message && (
              <div className="mt-2 p-2.5 bg-surface-container-lowest/95 rounded-xl border-2 border-on-background shadow-tactile-sm flex items-start gap-2 animate-modal-enter">
                <span className="material-symbols-outlined text-lg text-primary shrink-0 animate-bounce">
                  lock_open
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-headline text-[10px] font-extrabold uppercase tracking-wider text-primary block leading-none">
                    Messaggio Segreto Rivelato:
                  </span>
                  <p className="font-body text-xs font-bold text-on-background mt-1 leading-snug">
                    "{coupon.secret_message}"
                  </p>
                </div>
              </div>
            )}

            {/* 2-Hour Cleanup Countdown Pill for Redeemed Tickets */}
            {isRedeemed && coupon.timeRemainingFormatted && (
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-error bg-error-container/90 px-2 py-0.5 rounded-md w-fit border border-error/30">
                <span className="material-symbols-outlined text-[13px]">
                  timer
                </span>
                <span>Rimozione automatica tra {coupon.timeRemainingFormatted}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Perforated Center Line with Kupon Punch-Hole Cutouts */}
      <div className="relative w-0 flex flex-col justify-between items-center z-20">
        {/* Top Punch Hole */}
        <div className="w-5 h-5 bg-background border-b-2 border-r-2 border-on-background rounded-full absolute -top-2.5 -left-2.5 rotate-45 z-30" />
        {/* Dashed Perforation Line */}
        <div className="h-full border-l-2 border-dashed border-on-background absolute left-0 top-0 opacity-70" />
        {/* Bottom Punch Hole */}
        <div className="w-5 h-5 bg-background border-t-2 border-l-2 border-on-background rounded-full absolute -bottom-2.5 -left-2.5 rotate-45 z-30" />
      </div>

      {/* Ticket Action Stub (Right) */}
      <div
        className={`w-24 md:w-28 bg-surface-container-lowest rounded-r-[14px] flex flex-col items-center justify-center p-2 z-10 transition-colors gap-1.5 ${
          isRedeemed ? 'bg-gray-100/90' : 'hover:bg-surface-container-low'
        }`}
      >
        {isRedeemed ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-400 bg-gray-200 flex items-center justify-center text-gray-500 mb-1">
              <span className="material-symbols-outlined text-xl">
                content_cut
              </span>
            </div>
            <span className="font-headline text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Torn
            </span>
          </div>
        ) : (
          <>
            {/* Redeem Action */}
            <button
              onClick={() => onRedeemClick && onRedeemClick(coupon)}
              className="flex flex-col items-center justify-center group focus:outline-none"
              aria-label={`Redeem ${coupon.title}`}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 bg-secondary-container hover:bg-secondary-fixed active:scale-95 rounded-full border-2 border-on-background flex items-center justify-center shadow-tactile-sm transition-all duration-150 group-hover:rotate-6">
                <span className="material-symbols-outlined text-on-background text-xl">
                  qr_code_scanner
                </span>
              </div>
              <span className="font-headline text-[11px] font-bold text-on-background mt-0.5 tracking-tight group-hover:text-primary transition-colors">
                Redeem
              </span>
            </button>

            {/* Quick Share Action */}
            {onShareClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShareClick(coupon);
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/70 hover:bg-primary-container text-on-background border border-on-background/40 text-[10px] font-headline font-bold shadow-tactile-sm active:scale-95 transition-all"
                title="Invia a un amico via WhatsApp o Link"
              >
                <span className="material-symbols-outlined text-[12px]">send</span>
                <span>Invia</span>
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};
