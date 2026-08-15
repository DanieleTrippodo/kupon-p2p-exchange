import React, { useState } from 'react';
import { useCouponStore } from '../store/couponStore';
import { MASCOT, THEME_CLASSES } from '../theme/tokens';
import { sound } from '../services/soundService';
import { ColorTheme } from '../types/coupon';

export const DealsScreen: React.FC = () => {
  const createCoupon = useCouponStore((state) => state.createCoupon);
  const openShareModal = useCouponStore((state) => state.openShareModal);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);
  const userProfile = useCouponStore((state) => state.userProfile);

  const [selectedFilter, setSelectedFilter] = useState<string>('Tutti');

  const GIFT_TEMPLATES: {
    category: string;
    title: string;
    desc: string;
    secret: string;
    theme: ColorTheme;
    icon: string;
  }[] = [
    {
      category: 'Cibo & Drink',
      title: 'Caffè & Cornetto Caldo',
      desc: 'Offerto al bar sotto casa quando vuoi fare una pausa',
      secret: 'Prendi pure anche una spremuta d\'arancia fresca! 🥐☕',
      theme: 'peach',
      icon: 'local_cafe',
    },
    {
      category: 'Cibo & Drink',
      title: 'Pizza Margherita & Birra',
      desc: 'Serata pizzeria insieme questo weekend',
      secret: 'Offro io anche il dolce e limoncello finale! 🍕🍺',
      theme: 'matcha',
      icon: 'local_pizza',
    },
    {
      category: 'Amore & Favori',
      title: '1h Massaggio Rilassante',
      desc: 'Massaggio schiena o piedi con oli profumati dopo una lunga giornata',
      secret: 'Con musica relax e tisana calda inclusa! 💆✨',
      theme: 'lilac',
      icon: 'spa',
    },
    {
      category: 'Amore & Favori',
      title: 'Cucino Io Stasera!',
      desc: 'Ti preparo il tuo piatto preferito e lavo anche i piatti',
      secret: 'Menu completo a lume di candela! 🍝🕯️',
      theme: 'butter',
      icon: 'soup_kitchen',
    },
    {
      category: 'Svago & Giochi',
      title: 'Biglietto Cinema + Popcorn XXL',
      desc: 'Valido per la prossima prima visione a tua scelta',
      secret: 'I posti migliori al centro della sala sono assicurati! 🍿🎬',
      theme: 'peach',
      icon: 'movie',
    },
    {
      category: 'Viaggi & Aiuto',
      title: 'Passaggio Taxi Amico',
      desc: 'Un passaggio in auto gratuito quando hai bisogno o torni tardi',
      secret: 'Con playlist musicale preferita a tutto volume! 🚗🎵',
      theme: 'matcha',
      icon: 'directions_car',
    },
  ];

  const categories = ['Tutti', 'Cibo & Drink', 'Amore & Favori', 'Svago & Giochi', 'Viaggi & Aiuto'];

  const filteredTemplates =
    selectedFilter === 'Tutti'
      ? GIFT_TEMPLATES
      : GIFT_TEMPLATES.filter((t) => t.category === selectedFilter);

  const handleUseTemplate = (tpl: typeof GIFT_TEMPLATES[0]) => {
    sound.playCreateGift();
    const created = createCoupon({
      title: tpl.title,
      description: tpl.desc,
      secret_message: tpl.secret,
      color_theme: tpl.theme,
      icon_name: tpl.icon,
      recipient_id: 'Amico/a',
      sender_id: userProfile.defaultSenderName || userProfile.name,
    });

    openShareModal(created);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col gap-4">
      <div>
        <h2 className="font-headline text-2xl font-extrabold text-on-background">
          Modelli & Idee Regalo
        </h2>
        <p className="font-body text-xs text-on-surface-variant">
          Scegli un'idea pronta all'uso e inviala istantaneamente a un amico
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playCuteTap();
              setSelectedFilter(cat);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-headline font-bold whitespace-nowrap border-2 transition-all ${
              selectedFilter === cat
                ? 'bg-primary-container text-on-background border-on-background shadow-tactile-sm'
                : 'bg-surface-container-lowest text-on-surface-variant border-on-background/20 hover:bg-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards List */}
      <div className="flex flex-col gap-3">
        {filteredTemplates.map((tpl, i) => {
          const theme = THEME_CLASSES[tpl.theme];
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 border-on-background shadow-tactile ${theme.bg} flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full border-2 border-on-background bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-tactile-sm">
                  <span className="material-symbols-outlined text-2xl text-on-background">
                    {tpl.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-headline text-sm font-extrabold text-on-background truncate">
                    {tpl.title}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant truncate">
                    {tpl.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold text-primary mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    <span>Include messaggio segreto bonus</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(tpl)}
                className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile-sm active:scale-95 transition-all shrink-0 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Invia</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Coupon Banner */}
      <div className="mt-1 p-4 bg-secondary-container rounded-2xl border-2 border-on-background shadow-tactile flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-on-background bg-surface-container-lowest p-0.5 shadow-tactile-sm flex items-center justify-center shrink-0">
          <img
            src={MASCOT.avatarUrl}
            alt="Kupon Mascot"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-headline text-xs font-extrabold text-on-secondary-container">
            Vuoi creare un regalo personalizzato?
          </h4>
          <p className="font-body text-[11px] text-on-secondary-container/80 mt-0.5">
            Scegli tra 50+ icone, palette e scrivi la tua dedica segreta da zero!
          </p>
        </div>
        <button
          onClick={() => {
            sound.playCuteTap();
            setActiveTab('create');
          }}
          className="px-3.5 py-2 bg-primary-container hover:bg-primary-fixed text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile-sm shrink-0 active:scale-95 transition-all"
        >
          Crea
        </button>
      </div>
    </div>
  );
};
