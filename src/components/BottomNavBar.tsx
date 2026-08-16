import React from 'react';
import { useCouponStore } from '../store/couponStore';
import { sound } from '../services/soundService';

export const BottomNavBar: React.FC = () => {
  const activeTab = useCouponStore((state) => state.activeTab);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);
  const openScanner = useCouponStore((state) => state.openScanner);
  const progression = useCouponStore((state) => state.progression);

  const handleTabClick = (tab: typeof activeTab) => {
    sound.playCuteTap();
    setActiveTab(tab);
  };

  const handleScanClick = () => {
    sound.playScanBeep();
    openScanner();
  };

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-2xl border-2 border-on-background bg-surface-container-lowest shadow-tactile z-40 flex justify-around items-center py-2 px-3">
      {/* Wallet Tab */}
      <button
        onClick={() => handleTabClick('wallet')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
          activeTab === 'wallet'
            ? 'bg-primary-container text-on-primary-container font-bold shadow-tactile-sm'
            : 'text-on-surface-variant hover:bg-secondary-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'wallet' ? '"FILL" 1' : '"FILL" 0' }}
        >
          account_balance_wallet
        </span>
        <span className="font-headline text-[11px] mt-0.5 font-bold">Wallet</span>
      </button>

      {/* QR Scanner Direct Action */}
      <button
        onClick={handleScanClick}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-on-surface-variant hover:bg-secondary-container transition-all"
        title="Open QR Scanner"
      >
        <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
        <span className="font-headline text-[11px] mt-0.5 font-bold">Scan</span>
      </button>

      {/* Floating Center Create Button */}
      <button
        onClick={() => handleTabClick('create')}
        className={`flex flex-col items-center justify-center relative -top-6 rounded-full w-14 h-14 border-2 border-on-background shadow-tactile transition-all active:scale-95 ${
          activeTab === 'create'
            ? 'bg-primary-container text-on-background scale-105'
            : 'bg-secondary-container text-on-background hover:bg-secondary-fixed'
        }`}
        title="Create Kupon"
      >
        <span
          className="material-symbols-outlined text-3xl text-on-background"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          add_circle
        </span>
      </button>

      {/* Stickers Pokédex Tab */}
      <button
        onClick={() => handleTabClick('stickers')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
          activeTab === 'stickers'
            ? 'bg-tertiary-container text-on-tertiary-container font-bold shadow-tactile-sm'
            : 'text-on-surface-variant hover:bg-secondary-container'
        }`}
      >
        {/* Unopened pack indicator badge */}
        {progression.unopenedPacks > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center border border-on-background shadow-tactile-sm animate-bounce">
            {progression.unopenedPacks}
          </span>
        )}

        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'stickers' ? '"FILL" 1' : '"FILL" 0' }}
        >
          auto_awesome
        </span>
        <span className="font-headline text-[11px] mt-0.5 font-bold">Stickers</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => handleTabClick('profile')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
          activeTab === 'profile'
            ? 'bg-lilac text-on-background font-bold shadow-tactile-sm'
            : 'text-on-surface-variant hover:bg-secondary-container'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'profile' ? '"FILL" 1' : '"FILL" 0' }}
        >
          person
        </span>
        <span className="font-headline text-[11px] mt-0.5 font-bold">Profile</span>
      </button>
    </nav>
  );
};
