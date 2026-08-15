import React, { useState } from 'react';
import { ColorTheme } from '../types/coupon';
import { useCouponStore, StarterPackType } from '../store/couponStore';
import { AVATARS, MASCOT, THEME_CLASSES } from '../theme/tokens';
import { sound } from '../services/soundService';
import { fireRedemptionConfetti } from './Confetti';

interface OnboardingModalProps {
  isOpen: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen }) => {
  const userProfile = useCouponStore((state) => state.userProfile);
  const completeSetup = useCouponStore((state) => state.completeSetup);
  const hasCompletedSetup = useCouponStore((state) => state.hasCompletedSetup);
  const closeOnboarding = useCouponStore((state) => state.closeOnboarding);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(userProfile.name || '');
  const [handle, setHandle] = useState(userProfile.handle || '');
  const [avatar, setAvatar] = useState(userProfile.avatar || MASCOT.avatarUrl);
  const [favoriteTheme, setFavoriteTheme] = useState<ColorTheme>(userProfile.favoriteTheme || 'peach');
  const [starterPack, setStarterPack] = useState<StarterPackType>('welcome_gift');

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playCuteTap();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        setName('Nuovo Amico');
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    sound.playCuteTap();
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCreateGift();
    setTimeout(() => sound.playSuccessChime(), 150);
    fireRedemptionConfetti();

    const finalName = name.trim() || 'Amico Kupon';
    const finalHandle = handle.trim() 
      ? (handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`)
      : `@${finalName.toLowerCase().replace(/\s+/g, '_')}`;

    completeSetup(
      {
        name: finalName,
        handle: finalHandle,
        avatar,
        favoriteTheme,
        defaultSenderName: finalName,
      },
      starterPack
    );
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playCuteTap();
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border-3 border-on-background shadow-tactile-lg p-5 sm:p-6 flex flex-col gap-4 relative animate-modal-enter my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Allow closing only if user has already completed setup in the past and reopened from Profile */}
        {hasCompletedSetup && (
          <button
            onClick={() => {
              sound.playCuteTap();
              closeOnboarding();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-on-background bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-background active:scale-90 transition-all shadow-tactile-sm"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}

        {/* Top Progress Steps */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-2 border-b border-on-background/10">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full border-2 border-on-background font-headline text-xs font-bold flex items-center justify-center transition-all ${
              step >= 1 ? 'bg-primary-container text-on-background' : 'bg-surface-variant text-on-surface-variant'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-on-background' : 'bg-on-background/20'}`} />
            <div className={`w-7 h-7 rounded-full border-2 border-on-background font-headline text-xs font-bold flex items-center justify-center transition-all ${
              step >= 2 ? 'bg-primary-container text-on-background' : 'bg-surface-variant text-on-surface-variant'
            }`}>
              2
            </div>
            <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-on-background' : 'bg-on-background/20'}`} />
            <div className={`w-7 h-7 rounded-full border-2 border-on-background font-headline text-xs font-bold flex items-center justify-center transition-all ${
              step === 3 ? 'bg-secondary-container text-on-background' : 'bg-surface-variant text-on-surface-variant'
            }`}>
              3
            </div>
          </div>

          <span className="font-headline text-xs font-bold text-on-surface-variant">
            Passo {step} di 3
          </span>
        </div>

        {/* STEP 1: WELCOME & OVERVIEW */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center gap-4 py-2 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl border-2 border-on-background bg-primary-container p-2 shadow-tactile flex items-center justify-center">
                <img
                  src={MASCOT.avatarUrl}
                  alt="Kupon Mascot"
                  className="w-full h-full object-contain animate-mascot-bounce"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-secondary-container border border-on-background text-[10px] font-headline font-extrabold shadow-tactile-sm">
                P2P ✨
              </span>
            </div>

            <div>
              <h2 className="font-headline text-2xl font-black text-on-background">
                Benvenuto in Kupon!
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed max-w-xs mx-auto">
                La tua app per creare, regalare e scambiare coupon ed esperienze indimenticabili con amici, partner e familiari.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="w-full flex flex-col gap-2.5 text-left mt-1">
              <div className="p-3 bg-surface-variant/40 rounded-2xl border border-on-background/15 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-primary shrink-0">
                  card_giftcard
                </span>
                <div>
                  <h4 className="font-headline text-xs font-bold text-on-background">
                    Crea Regali su Misura
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant">
                    Un caffè, una pizza, un abbraccio o un favore speciale.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-variant/40 rounded-2xl border border-on-background/15 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-tertiary shrink-0">
                  qr_code_2
                </span>
                <div>
                  <h4 className="font-headline text-xs font-bold text-on-background">
                    Scambio Peer-to-Peer Istantaneo
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant">
                    Invia tramite QR o link diretto, nessun account né cloud!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-variant/40 rounded-2xl border border-on-background/15 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-secondary shrink-0">
                  celebration
                </span>
                <div>
                  <h4 className="font-headline text-xs font-bold text-on-background">
                    Strappo Tattile & Coriandoli
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant">
                    Riscatta i biglietti con un'esperienza fisica e divertente.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full mt-2 py-3.5 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-sm font-black rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Iniziamo la Configurazione</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2: PROFILE SETUP */}
        {step === 2 && (
          <div className="flex flex-col gap-4 py-1 animate-fade-in">
            <div className="text-center">
              <h2 className="font-headline text-xl font-extrabold text-on-background">
                Personalizza la tua Identità
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Questo è il nome che i tuoi amici vedranno sui regali
              </p>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-bold text-on-background flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">badge</span>
                <span>Il tuo Nome / Nickname</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!handle || handle.startsWith('@')) {
                    setHandle(`@${e.target.value.toLowerCase().replace(/\s+/g, '_')}`);
                  }
                }}
                placeholder="Es. Daniele, Giulia, Alex..."
                className="w-full px-3.5 py-2.5 bg-surface-container rounded-2xl border-2 border-on-background font-body text-sm text-on-background placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-tactile-sm"
              />
            </div>

            {/* Handle Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-bold text-on-background flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
                <span>Handle Username</span>
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@tuo_username"
                className="w-full px-3.5 py-2.5 bg-surface-container rounded-2xl border-2 border-on-background font-mono text-xs text-on-background placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-tactile-sm"
              />
            </div>

            {/* Mascot / Avatar Picker */}
            <div className="flex flex-col gap-2">
              <label className="font-headline text-xs font-bold text-on-background flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">face</span>
                  <span>Scegli il tuo Avatar Mascotte</span>
                </span>
                <label className="font-headline text-[11px] text-primary underline cursor-pointer hover:opacity-80">
                  Carica foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
              </label>

              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playCuteTap();
                      setAvatar(av.url);
                    }}
                    className={`h-14 rounded-2xl border-2 p-1.5 flex items-center justify-center transition-all ${
                      avatar === av.url
                        ? 'border-on-background bg-primary-container scale-105 shadow-tactile-sm'
                        : 'border-on-background/20 bg-surface-container hover:border-on-background/50'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Favorite Theme Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-bold text-on-background flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">palette</span>
                <span>Tema Colore Preferito</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {(['peach', 'matcha', 'butter', 'lilac'] as ColorTheme[]).map((themeKey) => {
                  const themeConf = THEME_CLASSES[themeKey];
                  const labels: Record<ColorTheme, string> = {
                    peach: 'Peach 🍑',
                    matcha: 'Matcha 🍵',
                    butter: 'Butter 🧈',
                    lilac: 'Lilac 🪻',
                  };
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => {
                        sound.playCuteTap();
                        setFavoriteTheme(themeKey);
                      }}
                      className={`py-2 px-1 rounded-xl border-2 font-headline text-[11px] font-bold text-center transition-all ${
                        favoriteTheme === themeKey
                          ? `${themeConf.bg} ${themeConf.text} border-on-background shadow-tactile-sm scale-105`
                          : 'bg-surface-container text-on-surface-variant border-on-background/20'
                      }`}
                    >
                      {labels[themeKey]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-2xl border-2 border-on-background bg-surface-container text-on-background font-headline text-xs font-bold shadow-tactile-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Indietro</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-xs font-extrabold rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Avanti: Scegli Portafoglio</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: WALLET STARTER PACK */}
        {step === 3 && (
          <div className="flex flex-col gap-4 py-1 animate-fade-in">
            <div className="text-center">
              <h2 className="font-headline text-xl font-extrabold text-on-background">
                Come vuoi iniziare?
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Scegli il contenuto iniziale del tuo nuovo portafoglio
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Option 1: Welcome Gift */}
              <button
                type="button"
                onClick={() => {
                  sound.playCuteTap();
                  setStarterPack('welcome_gift');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 relative ${
                  starterPack === 'welcome_gift'
                    ? 'bg-secondary-container border-on-background shadow-tactile-sm scale-[1.02]'
                    : 'bg-surface-container border-on-background/20 hover:border-on-background/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-secondary mt-0.5">
                  auto_awesome
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-xs font-extrabold text-on-background">
                      Portafoglio Pulito + Kupon di Benvenuto
                    </h4>
                    <span className="bg-secondary text-white text-[9px] font-headline font-bold px-1.5 py-0.5 rounded-full">
                      Consigliato
                    </span>
                  </div>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5">
                    Parte con un solo Kupon regalo personalizzato per testare subito lo strappo e la riscossione!
                  </p>
                </div>
              </button>

              {/* Option 2: Clean / Empty */}
              <button
                type="button"
                onClick={() => {
                  sound.playCuteTap();
                  setStarterPack('empty');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                  starterPack === 'empty'
                    ? 'bg-primary-container border-on-background shadow-tactile-sm scale-[1.02]'
                    : 'bg-surface-container border-on-background/20 hover:border-on-background/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-primary mt-0.5">
                  cleaning_services
                </span>
                <div className="flex-1">
                  <h4 className="font-headline text-xs font-extrabold text-on-background">
                    Portafoglio Vuoto (Zero Ticket)
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5">
                    Nessun coupon precaricato. Pronto per inserire solo i tuoi regali reali.
                  </p>
                </div>
              </button>

              {/* Option 3: Demo Pack */}
              <button
                type="button"
                onClick={() => {
                  sound.playCuteTap();
                  setStarterPack('demo');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                  starterPack === 'demo'
                    ? 'bg-tertiary-container border-on-background shadow-tactile-sm scale-[1.02]'
                    : 'bg-surface-container border-on-background/20 hover:border-on-background/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl text-tertiary mt-0.5">
                  inventory_2
                </span>
                <div className="flex-1">
                  <h4 className="font-headline text-xs font-extrabold text-on-background">
                    Pacchetto Demo Completo (5 Coupon d'esempio)
                  </h4>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5">
                    Include i coupon d'esempio (Caffè, Pizza, Bus, Cinema, Abbraccio) per esplorare l'app.
                  </p>
                </div>
              </button>
            </div>

            {/* Profile Summary preview card */}
            <div className="p-3 bg-surface-variant/50 rounded-2xl border border-on-background/20 flex items-center gap-3">
              <img
                src={avatar}
                alt="Selected avatar"
                className="w-10 h-10 rounded-xl border border-on-background bg-white object-contain p-1 shrink-0"
              />
              <div className="text-left overflow-hidden">
                <div className="font-headline text-xs font-bold text-on-background truncate">
                  {name || 'Amico Kupon'}
                </div>
                <div className="font-mono text-[10px] text-on-surface-variant truncate">
                  {handle || '@kupon_user'} • Tema {favoriteTheme}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-2xl border-2 border-on-background bg-surface-container text-on-background font-headline text-xs font-bold shadow-tactile-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Indietro</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 bg-secondary-container hover:bg-secondary-container/90 text-on-background font-headline text-xs font-black rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Completa & Entra nel Portafoglio!</span>
                <span className="material-symbols-outlined text-base">rocket_launch</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
