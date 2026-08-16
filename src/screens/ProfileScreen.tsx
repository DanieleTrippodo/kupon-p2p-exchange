import React, { useState, useRef } from 'react';
import { ColorTheme } from '../types/coupon';
import { useCoupons } from '../hooks/useCoupons';
import { useCouponStore } from '../store/couponStore';
import { AVATARS, THEME_CLASSES } from '../theme/tokens';
import { sound } from '../services/soundService';
import { fireRedemptionConfetti } from '../components/Confetti';
import { StickerService } from '../services/stickerService';

export const ProfileScreen: React.FC = () => {
  const { activeCount, redeemedCount } = useCoupons();
  const coupons = useCouponStore((state) => state.coupons);
  const userProfile = useCouponStore((state) => state.userProfile);
  const progression = useCouponStore((state) => state.progression);
  const updateUserProfile = useCouponStore((state) => state.updateUserProfile);
  const showToast = useCouponStore((state) => state.showToast);
  const openOnboarding = useCouponStore((state) => state.openOnboarding);
  const loadDemoCoupons = useCouponStore((state) => state.loadDemoCoupons);
  const clearAllCoupons = useCouponStore((state) => state.clearAllCoupons);
  const clearRedeemedCoupons = useCouponStore((state) => state.clearRedeemedCoupons);
  const albumStats = StickerService.getAlbumStats();

  // Edit Mode state
  const resetStickerBook = useCouponStore((state) => state.resetStickerBook);

  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState(userProfile.name);
  const [handle, setHandle] = useState(userProfile.handle);
  const [bio, setBio] = useState(userProfile.bio);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [favoriteTheme, setFavoriteTheme] = useState<ColorTheme>(userProfile.favoriteTheme);
  const [defaultSenderName, setDefaultSenderName] = useState(userProfile.defaultSenderName);

  // Audio preference state
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeStyle = THEME_CLASSES[userProfile.favoriteTheme] || THEME_CLASSES.peach;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCreateGift();
    setTimeout(() => sound.playSuccessChime(), 150);
    fireRedemptionConfetti();

    updateUserProfile({
      name: name.trim() || 'Amico Kupon',
      handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      bio: bio.trim(),
      avatar,
      favoriteTheme,
      defaultSenderName: defaultSenderName.trim() || name.trim(),
    });

    setIsEditing(false);
  };

  // Custom Image Upload handler
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playCuteTap();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          showToast('📸 Foto caricata con successo!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    showToast(muted ? '🔇 Effetti sonori disattivati' : '🔔 Effetti sonori attivati!', 'info');
  };

  const handleExportWallet = () => {
    sound.playCuteTap();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(coupons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kupon_wallet_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('💾 Portafoglio esportato in formato JSON!', 'success');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col gap-5">
      {/* Title & Edit Toggle */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-2xl font-extrabold text-on-background">
            Profilo Utente
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Personalizza il tuo avatar, bio e preferenze di scambio
          </p>
        </div>

        <button
          onClick={() => {
            sound.playCuteTap();
            setIsEditing(!isEditing);
          }}
          className={`px-3.5 py-1.5 rounded-full border-2 border-on-background font-headline text-xs font-bold shadow-tactile-sm transition-all flex items-center gap-1.5 active:scale-95 ${
            isEditing
              ? 'bg-on-background text-white'
              : 'bg-primary-container text-on-background hover:bg-primary-fixed'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isEditing ? 'close' : 'edit'}
          </span>
          <span>{isEditing ? 'Annulla' : 'Modifica'}</span>
        </button>
      </div>

      {/* EDIT PROFILE FORM MODAL / PANEL */}
      {isEditing ? (
        <form
          onSubmit={handleSaveProfile}
          className="p-5 bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile flex flex-col gap-4 animate-modal-enter"
        >
          <div className="flex items-center gap-2 border-b-2 border-on-background/10 pb-3">
            <span className="material-symbols-outlined text-2xl text-primary">
              manage_accounts
            </span>
            <h3 className="font-headline text-lg font-extrabold text-on-background">
              Modifica Dati Profilo
            </h3>
          </div>

          {/* Avatar Selector */}
          <div>
            <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
              1. Scegli il tuo Avatar / Sticker:
            </span>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {AVATARS.map((av) => {
                const isSelected = avatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playCuteTap();
                      setAvatar(av.url);
                    }}
                    title={av.label}
                    className={`w-14 h-14 rounded-full border-2 border-on-background p-1 bg-surface-container-lowest shrink-0 transition-all ${
                      isSelected
                        ? 'bg-primary-container shadow-tactile scale-110 ring-2 ring-primary'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </button>
                );
              })}

              {/* Upload Custom Image Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-full border-2 border-dashed border-on-background bg-surface-variant flex flex-col items-center justify-center text-on-surface shrink-0 hover:bg-secondary-container transition-all"
                title="Carica foto personalizzata"
              >
                <span className="material-symbols-outlined text-lg">add_a_photo</span>
                <span className="text-[9px] font-bold">Foto</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomImageUpload}
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 bg-primary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
              Nome Visualizzato
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Alex Rossi"
              className="w-full px-4 py-3 bg-surface-variant text-on-background font-headline text-sm font-bold rounded-2xl border-2 border-on-background focus:outline-none shadow-tactile-sm"
            />
          </div>

          {/* Username / Handle Input */}
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 bg-secondary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
              Nickname / Handle
            </label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@alex_kupon"
              className="w-full px-4 py-3 bg-surface-variant text-on-background font-headline text-sm font-bold rounded-2xl border-2 border-on-background focus:outline-none shadow-tactile-sm"
            />
          </div>

          {/* Bio Input */}
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 bg-tertiary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
              Bio / Motto Personale
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Racconta cosa ti piace regalare o un messaggio carino..."
              className="w-full px-4 py-3 bg-surface-variant text-on-background font-body text-xs rounded-2xl border-2 border-on-background focus:outline-none shadow-tactile-sm resize-none"
            />
          </div>

          {/* Default Sender Signature */}
          <div className="relative mt-2">
            <label className="absolute -top-3 left-4 bg-lilac text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
              Firma Mittente di Default
            </label>
            <input
              type="text"
              value={defaultSenderName}
              onChange={(e) => setDefaultSenderName(e.target.value)}
              placeholder="es. Alex"
              className="w-full px-4 py-3 bg-surface-variant text-on-background font-headline text-sm font-bold rounded-2xl border-2 border-on-background focus:outline-none shadow-tactile-sm"
            />
          </div>

          {/* Favorite Theme Swatch */}
          <div>
            <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
              Colore Profilo Preferito:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {(['peach', 'matcha', 'butter', 'lilac'] as ColorTheme[]).map((themeKey) => {
                const th = THEME_CLASSES[themeKey];
                const isSelected = favoriteTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => {
                      sound.playCuteTap();
                      setFavoriteTheme(themeKey);
                    }}
                    className={`py-2 px-1 rounded-xl border-2 border-on-background flex flex-col items-center justify-center gap-1 transition-all ${
                      th.bg
                    } ${
                      isSelected
                        ? 'shadow-tactile scale-105 ring-2 ring-on-background ring-offset-2'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="font-headline text-[11px] font-extrabold capitalize text-on-background">
                      {themeKey}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px] text-on-background font-bold">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save CTA */}
          <button
            type="submit"
            className="mt-2 w-full py-3.5 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-sm font-extrabold rounded-full border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">check</span>
            <span>Salva Modifiche Profilo</span>
          </button>
        </form>
      ) : (
        /* HERO PROFILE CARD (View Mode) */
        <div
          className={`p-5 rounded-3xl border-2 border-on-background shadow-tactile ${themeStyle.bg} flex flex-col gap-4 relative overflow-hidden transition-all duration-300`}
        >
          {/* Top Row: Avatar & Badges */}
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 w-20 h-20 rounded-full border-2 border-on-background bg-surface-container-lowest p-1 shadow-tactile-sm flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={userProfile.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-headline text-xl font-extrabold text-on-background truncate">
                  {userProfile.name}
                </h3>
                <span className="font-headline text-[10px] font-bold text-secondary bg-surface-container-lowest px-2.5 py-0.5 rounded-full border border-on-background/30 shadow-none">
                  Verified P2P
                </span>
              </div>

              <p className="font-headline text-xs font-bold text-primary mt-0.5">
                {userProfile.handle}
              </p>

              <span className="inline-flex items-center gap-1 bg-surface-container-lowest/90 text-on-background px-2.5 py-0.5 rounded-full border border-on-background/20 text-[10px] font-headline font-bold mt-1.5 shadow-tactile-sm">
                <span className="material-symbols-outlined text-[13px] text-primary">
                  workspace_premium
                </span>
                <span>Livello {progression.level} ⭐ ({progression.xp}/{progression.xpToNextLevel} XP)</span>
              </span>
            </div>
          </div>

          {/* Bio Quote Card */}
          <div className="p-3 bg-surface-container-lowest/90 rounded-2xl border border-on-background/30 shadow-tactile-sm">
            <p className="font-body text-xs text-on-background italic leading-relaxed">
              "{userProfile.bio}"
            </p>
          </div>
        </div>
      )}

      {/* STICKERBOOK & LOOT SUMMARY CARD */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border-2 border-on-background shadow-tactile flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-400 to-amber-300 border-2 border-on-background flex items-center justify-center text-2xl shadow-tactile-sm shrink-0">
            📖
          </div>
          <div>
            <span className="font-headline text-xs font-extrabold text-on-background block">
              Album StickerBook
            </span>
            <span className="font-body text-[11px] text-on-surface-variant">
              {albumStats.discovered} / {albumStats.total} sbloccati ({albumStats.percentage}%) • {progression.unopenedPacks} bustine
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-headline text-sm font-extrabold text-primary block">
            {albumStats.totalAvailableCopies}
          </span>
          <span className="font-headline text-[9px] font-bold text-on-surface-variant uppercase">
            Nello Zaino
          </span>
        </div>
      </div>

      {/* WALLET ACTIVITY SCOREBOARD */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Active Gifts */}
        <div className="p-3.5 bg-primary-container rounded-2xl border-2 border-on-background shadow-tactile-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-2xl text-on-background mb-0.5">
            account_balance_wallet
          </span>
          <span className="font-headline text-xl font-extrabold text-on-background">
            {activeCount}
          </span>
          <span className="font-headline text-[10px] font-bold text-on-background/80 uppercase">
            Nel Wallet
          </span>
        </div>

        {/* Redeemed */}
        <div className="p-3.5 bg-secondary-container rounded-2xl border-2 border-on-background shadow-tactile-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-2xl text-on-background mb-0.5">
            content_cut
          </span>
          <span className="font-headline text-xl font-extrabold text-on-background">
            {redeemedCount}
          </span>
          <span className="font-headline text-[10px] font-bold text-on-background/80 uppercase">
            Riscattati
          </span>
        </div>

        {/* Total Registered */}
        <div className="p-3.5 bg-tertiary-container rounded-2xl border-2 border-on-background shadow-tactile-sm flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-2xl text-on-background mb-0.5">
            redeem
          </span>
          <span className="font-headline text-xl font-extrabold text-on-background">
            {coupons.length}
          </span>
          <span className="font-headline text-[10px] font-bold text-on-background/80 uppercase">
            Totali P2P
          </span>
        </div>
      </div>

      {/* PREFERENCES & APP CONTROLS */}
      <div className="bg-surface-container-lowest rounded-2xl border-2 border-on-background shadow-tactile overflow-hidden divide-y-2 divide-on-background/10">
        {/* Restart Onboarding / Setup */}
        <button
          onClick={() => {
            sound.playCuteTap();
            openOnboarding();
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-primary">
              tune
            </span>
            <div className="text-left">
              <span className="font-headline text-xs font-bold text-on-background block">
                Riavvia Setup / Guida Iniziale
              </span>
              <span className="font-body text-[10px] text-on-surface-variant">
                Riconfigura mascotte, nickname e guida introduttiva
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            chevron_right
          </span>
        </button>

        {/* Load Demo Pack */}
        <button
          onClick={() => {
            sound.playCuteTap();
            if (coupons.length > 0) {
              if (window.confirm('Vuoi caricare i 5 coupon dimostrativi (Caffè, Pizza, Bus, Cinema, Abbraccio)?')) {
                loadDemoCoupons();
              }
            } else {
              loadDemoCoupons();
            }
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-tertiary">
              inventory_2
            </span>
            <div className="text-left">
              <span className="font-headline text-xs font-bold text-on-background block">
                Carica Pacchetto Demo (5 Coupon)
              </span>
              <span className="font-body text-[10px] text-on-surface-variant">
                Aggiunge i coupon di test per esplorare l'app
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            chevron_right
          </span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-primary">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
            <div className="text-left">
              <span className="font-headline text-xs font-bold text-on-background block">
                Effetti Sonori Tattili
              </span>
              <span className="font-body text-[10px] text-on-surface-variant">
                {isMuted ? 'Disattivati' : 'Attivi (Strappo carta, campanellini)'}
              </span>
            </div>
          </div>
          <span
            className={`font-headline text-xs font-bold px-2.5 py-1 rounded-full border border-on-background/30 ${
              isMuted ? 'bg-surface-variant text-on-surface-variant' : 'bg-secondary-container text-on-background'
            }`}
          >
            {isMuted ? 'Off' : 'On'}
          </span>
        </button>

        {/* Export Wallet Data */}
        <button
          onClick={handleExportWallet}
          className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-on-surface">
              download
            </span>
            <span className="font-headline text-xs font-bold text-on-background">
              Esporta Backup Portafoglio (JSON)
            </span>
          </div>
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            chevron_right
          </span>
        </button>

        {/* Reset StickerBook & Inventario */}
        <button
          onClick={() => {
            if (
              window.confirm(
                'Sei sicuro di voler azzerare lo StickerBook? Questa azione resetterà tutte le scoperte e svuoterà l\'inventario degli sticker.'
              )
            ) {
              sound.playCuteTap();
              resetStickerBook();
            }
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-amber-100/50 transition-colors text-amber-900 border-b border-on-background/10"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-amber-700">
              restart_alt
            </span>
            <div className="text-left">
              <span className="font-headline text-xs font-bold block">
                Azzera Collezione StickerBook
              </span>
              <span className="font-body text-[10px] text-on-surface-variant">
                Cancella tutti gli sticker collezionati e le scoperte dell'album
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            chevron_right
          </span>
        </button>

        {/* Clear Redeemed / Expired Coupons */}
        <button
          onClick={() => {
            sound.playCuteTap();
            clearRedeemedCoupons();
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-on-surface">
              cleaning_services
            </span>
            <div className="text-left">
              <span className="font-headline text-xs font-bold text-on-background block">
                Pulisci Kupon Archiviati / Riscattati
              </span>
              <span className="font-body text-[10px] text-on-surface-variant">
                Rimuove i biglietti già utilizzati per liberare spazio
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            chevron_right
          </span>
        </button>

        {/* Clear All Wallet */}
        <button
          onClick={() => {
            if (window.confirm('Sei sicuro di voler svuotare il portafoglio? Questa azione cancellerà tutti i coupon salvati sul dispositivo.')) {
              sound.playCuteTap();
              clearAllCoupons();
            }
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-error-container/40 transition-colors text-error"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">delete_forever</span>
            <span className="font-headline text-xs font-bold">
              Svuota Tutto il Portafoglio
            </span>
          </div>
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] font-body text-on-surface-variant/70 mt-1">
        <p>Kupon Peer-to-Peer Exchange • developed by DDD</p>
        <p>Tutti i dati del profilo sono salvati localmente sul tuo dispositivo.</p>
      </div>
    </div>
  );
};
