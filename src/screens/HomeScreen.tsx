import React from 'react';
import { useCoupons, CouponWithCleanup } from '../hooks/useCoupons';
import { useCouponStore } from '../store/couponStore';
import { TicketCard } from '../components/TicketCard';
import { MASCOT } from '../theme/tokens';
import { sound } from '../services/soundService';

export const HomeScreen: React.FC = () => {
  const { coupons, activeCount, redeemedCount } = useCoupons();
  const filterStatus = useCouponStore((state) => state.filterStatus);
  const setFilterStatus = useCouponStore((state) => state.setFilterStatus);
  const openQRModal = useCouponStore((state) => state.openQRModal);
  const openShareModal = useCouponStore((state) => state.openShareModal);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);

  const handleRedeemClick = (coupon: CouponWithCleanup) => {
    sound.playCuteTap();
    openQRModal(coupon, 'redeem');
  };

  const handleShareClick = (coupon: CouponWithCleanup) => {
    sound.playCuteTap();
    openShareModal(coupon);
  };

  const handleTabFilterChange = (status: 'all' | 'active' | 'redeemed') => {
    sound.playCuteTap();
    setFilterStatus(status);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col">
      {/* Title & Stats Section */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="font-headline text-2xl font-extrabold text-on-background">
            Il mio portafoglio
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Scambia, invia e riscatta i tuoi regali digitali
          </p>
        </div>

        {/* Active Pill Badge */}
        <span className="font-headline text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full border-2 border-on-background shadow-tactile-sm">
          {activeCount} {activeCount === 1 ? 'Attivo' : 'Attivi'}
        </span>
      </div>

      {/* Filter Tabs (All / Active / Redeemed) */}
      <div className="flex gap-2 mb-4 bg-surface-variant/40 p-1 rounded-2xl border border-on-background/20">
        <button
          onClick={() => handleTabFilterChange('all')}
          className={`flex-1 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-surface-container-lowest text-on-background shadow-tactile-sm border border-on-background'
              : 'text-on-surface-variant hover:text-on-background'
          }`}
        >
          Tutti ({coupons.length})
        </button>

        <button
          onClick={() => handleTabFilterChange('active')}
          className={`flex-1 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
            filterStatus === 'active'
              ? 'bg-surface-container-lowest text-on-background shadow-tactile-sm border border-on-background'
              : 'text-on-surface-variant hover:text-on-background'
          }`}
        >
          Attivi ({activeCount})
        </button>

        <button
          onClick={() => handleTabFilterChange('redeemed')}
          className={`flex-1 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
            filterStatus === 'redeemed'
              ? 'bg-surface-container-lowest text-on-background shadow-tactile-sm border border-on-background'
              : 'text-on-surface-variant hover:text-on-background'
          }`}
        >
          Riscattati ({redeemedCount})
        </button>
      </div>

      {/* List of Coupon Tickets */}
      {coupons.length > 0 ? (
        <div className="flex flex-col gap-4">
          {coupons.map((coupon, idx) => (
            <TicketCard
              key={coupon.id}
              coupon={coupon}
              index={idx}
              onRedeemClick={handleRedeemClick}
              onShareClick={handleShareClick}
            />
          ))}
        </div>
      ) : (
        /* GORGEOUS EMPTY STATE FOR CLEAN WALLET */
        <div className="flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile my-4 gap-4 animate-modal-enter">
          <div className="w-24 h-24 rounded-full border-2 border-on-background bg-primary-container p-2 shadow-tactile-sm flex items-center justify-center">
            <img
              src={MASCOT.avatarUrl}
              alt="Empty Wallet Mascot"
              className="w-full h-full object-contain animate-mascot-bounce"
            />
          </div>

          <div>
            <h3 className="font-headline text-xl font-extrabold text-on-background">
              {filterStatus === 'redeemed'
                ? 'Nessun Kupon riscattato'
                : 'Il tuo portafoglio è vuoto!'}
            </h3>
            <p className="font-body text-xs text-on-surface-variant mt-1 max-w-[260px] mx-auto">
              {filterStatus === 'redeemed'
                ? 'Quando strappi o ricevi un Kupon riscattato apparirà qui per 2 ore.'
                : 'Crea il tuo primo regalo digitale personalizzato da inviare a un amico o al tuo partner!'}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playCuteTap();
              setActiveTab('create');
            }}
            className="mt-1 px-6 py-3 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center gap-2"
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              add_circle
            </span>
            <span>Crea il tuo primo Kupon</span>
          </button>
        </div>
      )}
    </div>
  );
};
