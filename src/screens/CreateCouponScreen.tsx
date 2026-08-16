import React, { useState } from 'react';
import { ColorTheme } from '../types/coupon';
import { AppliedSticker } from '../types/sticker';
import { useCouponStore } from '../store/couponStore';
import { ICON_CATEGORIES, THEME_CLASSES } from '../theme/tokens';
import { fireRedemptionConfetti } from '../components/Confetti';
import { sound } from '../services/soundService';
import { StickerDecorator } from '../components/StickerDecorator';

export const CreateCouponScreen: React.FC = () => {
  const createCoupon = useCouponStore((state) => state.createCoupon);
  const openShareModal = useCouponStore((state) => state.openShareModal);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);
  const userProfile = useCouponStore((state) => state.userProfile);

  // Form State
  const [title, setTitle] = useState('Pizza Margherita & Birra');
  const [description, setDescription] = useState('Offerta da me da Bella Napoli questo weekend!');
  const [secretMessage, setSecretMessage] = useState('Pago io anche il dolce e limoncello finale! 🍋🍰');
  const [recipient, setRecipient] = useState('');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('peach');
  const [iconName, setIconName] = useState<string>('local_pizza');
  const [appliedStickers, setAppliedStickers] = useState<AppliedSticker[]>([]);

  // Icon category / search state
  const [selectedCategory, setSelectedCategory] = useState<string>(ICON_CATEGORIES[0].name);
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  const activeTheme = THEME_CLASSES[colorTheme] || THEME_CLASSES.peach;

  const currentCategory = ICON_CATEGORIES.find((c) => c.name === selectedCategory) || ICON_CATEGORIES[0];

  const filteredIcons = iconSearchQuery.trim()
    ? ICON_CATEGORIES.flatMap((c) => c.icons).filter(
        (ic) =>
          ic.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
          ic.id.toLowerCase().includes(iconSearchQuery.toLowerCase())
      )
    : currentCategory.icons;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playCreateGift();

    const created = createCoupon({
      title: title.trim(),
      description: description.trim(),
      secret_message: secretMessage.trim() || undefined,
      recipient_id: recipient.trim() || 'Amico/a',
      color_theme: colorTheme,
      icon_name: iconName,
      sender_id: userProfile.defaultSenderName || userProfile.name || 'You',
      appliedStickers: appliedStickers.length > 0 ? appliedStickers : undefined,
    });

    fireRedemptionConfetti();
    setActiveTab('wallet');
    openShareModal(created);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col gap-5">
      {/* Title */}
      <div>
        <h2 className="font-headline text-2xl font-extrabold text-on-background">
          Crea Kupon Personalizzato
        </h2>
        <p className="font-body text-xs text-on-surface-variant">
          Personalizza ogni dettaglio: icona, palette, messaggi e applica i tuoi sticker preferiti!
        </p>
      </div>

      {/* Live Preview Ticket Section with Interactive Sticker Decorator */}
      <section className="flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-1.5 px-1">
          <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Anteprima Biglietto & Decorazione
          </span>
          <span className="font-headline text-[10px] font-bold text-primary bg-primary-container/60 px-2 py-0.5 rounded-full border border-on-background/20">
            Live Preview
          </span>
        </div>

        <StickerDecorator
          appliedStickers={appliedStickers}
          onChange={setAppliedStickers}
        >
          <div className="w-full bg-surface-container-lowest rounded-2xl border-2 border-on-background shadow-tactile overflow-hidden transition-all duration-200">
            {/* Top Section */}
            <div
              className={`p-4 ${activeTheme.bg} flex flex-col items-center gap-1.5 relative transition-colors duration-200`}
            >
              {/* Center Icon Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-on-background bg-surface-container-lowest p-1 shadow-tactile-sm flex items-center justify-center -mt-2">
                <span className="material-symbols-outlined text-3xl text-on-background">
                  {iconName}
                </span>
              </div>

              <div className="text-center w-full px-2 mt-1">
                <h3 className="font-headline text-xl font-extrabold text-on-background truncate">
                  {title || 'Nome del Kupon'}
                </h3>
                <p className="font-body text-xs text-on-surface-variant truncate mt-0.5">
                  {description || 'Descrizione o commento...'}
                </p>
              </div>

              {/* Secret Message Preview Tag (Hidden state) */}
              {secretMessage && (
                <div className="mt-1 inline-flex items-center gap-1.5 bg-surface-container-lowest/90 text-on-background px-3 py-1 rounded-full border border-on-background/30 text-[11px] font-headline font-bold shadow-tactile-sm">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    lock
                  </span>
                  <span>Messaggio Segreto:</span>
                  <span className="italic font-mono text-on-surface-variant blur-[2px] hover:blur-none transition-all select-none">
                    {secretMessage}
                  </span>
                </div>
              )}
            </div>

            {/* Perforation Line with Punch Holes */}
            <div className="relative w-full h-3 bg-surface-container-lowest flex items-center justify-center">
              <div className="absolute -left-2.5 w-5 h-5 bg-background border-r-2 border-on-background rounded-full" />
              <div className="w-[88%] border-t-2 border-dashed border-on-background opacity-60" />
              <div className="absolute -right-2.5 w-5 h-5 bg-background border-l-2 border-on-background rounded-full" />
            </div>

            {/* Bottom Section */}
            <div className="p-3 bg-surface-container-lowest flex justify-between items-center px-4">
              <div className="flex items-center gap-1.5 text-primary font-headline text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">{iconName}</span>
                <span>Kupon Gift</span>
              </div>

              <div className="flex items-center gap-1.5 text-secondary font-headline text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                <span>Per: {recipient || 'Tutti'}</span>
              </div>
            </div>
          </div>
        </StickerDecorator>
      </section>

      {/* Builder Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 1. Title Input */}
        <div className="relative mt-2">
          <label className="absolute -top-3 left-4 bg-primary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
            1. Nome del Kupon (Titolo) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">edit</span>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="es. Pizza Insieme, 1h Massaggio, Serata Cinema..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-background font-headline text-sm font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm focus:outline-none focus:shadow-tactile transition-all"
            />
          </div>
        </div>

        {/* 2. Description / Comment Input */}
        <div className="relative mt-2">
          <label className="absolute -top-3 left-4 bg-secondary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
            2. Commento / Descrizione visibile
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">notes</span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Aggiungi una descrizione, luogo, condizioni o un commento carino..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-background font-body text-xs rounded-2xl border-2 border-on-background shadow-tactile-sm focus:outline-none focus:shadow-tactile transition-all resize-none"
            />
          </div>
        </div>

        {/* 3. SECRET MESSAGE INPUT (Only shown after redemption) */}
        <div className="relative mt-2">
          <label className="absolute -top-3 left-4 bg-[#FFDAD3] text-primary font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">lock_open</span>
            <span>3. Messaggio Segreto (Si sblocca solo al riscatto!)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none text-primary">
              <span className="material-symbols-outlined text-lg">vpn_key</span>
            </div>
            <textarea
              rows={2}
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              placeholder="Inserisci una sorpresa, dedica segreta o un bonus che il destinatario scoprirà solo quando strappa il biglietto!"
              className="w-full pl-11 pr-4 py-3 bg-primary-fixed/20 text-on-background font-body text-xs rounded-2xl border-2 border-on-background shadow-tactile-sm focus:outline-none focus:shadow-tactile transition-all resize-none"
            />
          </div>
        </div>

        {/* 4. Recipient Input */}
        <div className="relative mt-2">
          <label className="absolute -top-3 left-4 bg-tertiary-container text-on-background font-headline text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-on-background z-10">
            4. Destinatario (A Chi)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="es. Sarah, Marco, Mamma, Amore Mio..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest text-on-background font-headline text-sm font-bold rounded-2xl border-2 border-on-background shadow-tactile-sm focus:outline-none focus:shadow-tactile transition-all"
            />
          </div>
        </div>

        {/* 5. Color Palette Theme Picker */}
        <div className="mt-1">
          <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
            5. Scegli il colore del ticket:
          </span>
          <div className="grid grid-cols-4 gap-2.5">
            {(['peach', 'matcha', 'butter', 'lilac'] as ColorTheme[]).map((themeKey) => {
              const th = THEME_CLASSES[themeKey];
              const isSelected = colorTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => {
                    sound.playCuteTap();
                    setColorTheme(themeKey);
                  }}
                  className={`py-2 px-1 rounded-xl border-2 border-on-background flex flex-col items-center justify-center gap-1 transition-all ${
                    th.bg
                  } ${
                    isSelected
                      ? 'shadow-tactile scale-105 ring-2 ring-on-background ring-offset-2'
                      : 'opacity-80 hover:opacity-100'
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

        {/* 6. RICH ICON SELECTOR WITH CATEGORIES & SEARCH */}
        <div className="mt-2 bg-surface-container-lowest p-3.5 rounded-2xl border-2 border-on-background shadow-tactile-sm flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="font-headline text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              6. Scegli l'icona perfetta ({ICON_CATEGORIES.flatMap((c) => c.icons).length}+ disponibili):
            </span>
            <div className="flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded-full border border-on-background/20">
              <span className="material-symbols-outlined text-[14px] text-primary">{iconName}</span>
              <span className="font-headline text-[10px] font-bold">Selezionata</span>
            </div>
          </div>

          {/* Search filter input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca icona (es. caffè, pizza, regalo, massaggio, auto...)"
              value={iconSearchQuery}
              onChange={(e) => setIconSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-variant text-on-background text-xs font-bold rounded-xl border border-on-background/30 focus:outline-none"
            />
            <span className="material-symbols-outlined text-sm absolute left-2.5 top-2 text-on-surface-variant">
              search
            </span>
            {iconSearchQuery && (
              <button
                type="button"
                onClick={() => setIconSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs font-bold text-on-surface-variant hover:text-on-background"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          {!iconSearchQuery && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    sound.playCuteTap();
                    setSelectedCategory(cat.name);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-headline font-bold whitespace-nowrap border transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-primary-container text-on-background border-on-background shadow-tactile-sm'
                      : 'bg-surface-variant text-on-surface-variant border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Icon Grid */}
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-surface-variant/40 rounded-xl border border-on-background/10">
            {filteredIcons.map((item) => {
              const isSelected = iconName === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playCuteTap();
                    setIconName(item.id);
                  }}
                  title={item.label}
                  className={`h-11 rounded-xl border-2 border-on-background flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary-container shadow-tactile-sm scale-110 ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl text-on-background">
                    {item.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="mt-2 w-full py-4 px-6 bg-primary-container text-on-background font-headline text-base font-extrabold rounded-full border-2 border-on-background shadow-tactile hover:shadow-tactile-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex justify-center items-center gap-2"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            add_circle
          </span>
          <span>Crea e Aggiungi al Portafoglio</span>
        </button>
      </form>
    </div>
  );
};
