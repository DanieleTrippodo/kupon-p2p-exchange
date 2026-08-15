import React, { useState } from 'react';
import { MASCOT } from '../theme/tokens';
import { useCouponStore } from '../store/couponStore';
import { sound } from '../services/soundService';

export const Header: React.FC = () => {
  const showToast = useCouponStore((state) => state.showToast);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);
  const userProfile = useCouponStore((state) => state.userProfile);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    showToast(muted ? '🔇 Effetti sonori disattivati' : '🔔 Effetti sonori attivati!', 'info');
  };

  const handleCreateQuick = () => {
    sound.playCuteTap();
    setActiveTab('create');
  };

  return (
    <header className="w-full max-w-lg mx-auto px-4 pt-4 pb-2 flex justify-between items-center bg-transparent z-20">
      {/* Brand & Mascot / Custom Avatar */}
      <div
        onClick={() => {
          sound.playCuteTap();
          setActiveTab('profile');
        }}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full border-2 border-on-background bg-primary-container p-0.5 shadow-tactile-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
          <img
            src={userProfile.avatar || MASCOT.avatarUrl}
            alt={userProfile.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight leading-none">
            Kupon
          </h1>
          <p className="font-headline text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            {userProfile.handle || 'P2P Exchange'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Sound FX Toggle */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Attiva suoni' : 'Disattiva suoni'}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-on-background transition-all active:scale-95 shadow-tactile-sm ${
            isMuted ? 'bg-surface-variant text-on-surface-variant' : 'bg-secondary-container text-on-background'
          }`}
          aria-label="Toggle Sound"
        >
          <span className="material-symbols-outlined text-xl">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Quick New Kupon Button */}
        <button
          onClick={handleCreateQuick}
          title="Crea nuovo Kupon"
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-on-background bg-primary-container text-on-background hover:bg-primary-fixed transition-all active:scale-95 shadow-tactile-sm"
          aria-label="Create Kupon"
        >
          <span className="material-symbols-outlined text-xl font-bold">add</span>
        </button>
      </div>
    </header>
  );
};
