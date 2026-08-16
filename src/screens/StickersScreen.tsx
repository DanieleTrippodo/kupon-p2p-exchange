import React, { useState } from 'react';
import { STICKERS_CATALOG, RARITY_LABELS, CATEGORY_LABELS } from '../data/stickersCatalog';
import { StickerCategory, StickerDefinition, StickerPackResult } from '../types/sticker';
import { useCouponStore } from '../store/couponStore';
import { sound } from '../services/soundService';
import { fireRedemptionConfetti } from '../components/Confetti';
import { StickerService } from '../services/stickerService';
import { StickerSvg } from '../components/StickerSvg';

export const StickersScreen: React.FC = () => {
  const stickerInventory = useCouponStore((state) => state.stickerInventory);
  const progression = useCouponStore((state) => state.progression);
  const openStickerPack = useCouponStore((state) => state.openStickerPack);
  const clearLastPackResult = useCouponStore((state) => state.clearLastPackResult);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStickerDetail, setSelectedStickerDetail] = useState<StickerDefinition | null>(null);

  // Unboxing Modal Animation States
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [packStep, setPackStep] = useState<'sealed' | 'revealing'>('sealed');
  const [currentDrawnPack, setCurrentDrawnPack] = useState<StickerPackResult | null>(null);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Stats calculation
  const albumStats = StickerService.getAlbumStats();

  const handleStartOpenPack = () => {
    if (progression.unopenedPacks <= 0) return;
    sound.playCuteTap();
    setPackStep('sealed');
    setFlippedCards([]);
    setIsOpeningPack(true);
  };

  const handleTearPack = () => {
    sound.playPaperTear();
    setTimeout(() => sound.playCuteTap(), 150);

    const result = openStickerPack();
    if (result) {
      setCurrentDrawnPack(result);
      setPackStep('revealing');
      setFlippedCards([]);
    }
  };

  const handleFlipCard = (index: number) => {
    if (flippedCards.includes(index) || !currentDrawnPack) return;
    sound.playCuteTap();
    const stk = currentDrawnPack.stickers[index];
    if (stk && (stk.rarity === 'epic' || stk.rarity === 'legendary')) {
      setTimeout(() => sound.playSuccessChime(), 100);
    }
    const nextFlipped = [...flippedCards, index];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 3) {
      setTimeout(() => {
        sound.playSuccessChime();
        fireRedemptionConfetti();
      }, 300);
    }
  };

  const handleRevealAllCards = () => {
    sound.playCuteTap();
    setTimeout(() => sound.playSuccessChime(), 150);
    fireRedemptionConfetti();
    setFlippedCards([0, 1, 2]);
  };

  const handleClosePackModal = () => {
    sound.playCuteTap();
    setIsOpeningPack(false);
    setCurrentDrawnPack(null);
    setFlippedCards([]);
    clearLastPackResult();
  };

  const filteredCatalog = STICKERS_CATALOG.filter((stk) => {
    if (selectedCategory === 'all') return true;
    return stk.category === (selectedCategory as StickerCategory);
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col gap-5">
      {/* Title */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-2xl font-extrabold text-on-background flex items-center gap-2">
            <span>StickerBook</span>
            <span className="text-xl">📖</span>
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Sblocca tutti i {STICKERS_CATALOG.length} sticker del tuo album e personalizza i coupon!
          </p>
        </div>

        {/* Level Badge */}
        <div className="flex flex-col items-end">
          <div className="px-3 py-1 rounded-full bg-primary-container border-2 border-on-background shadow-tactile-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">
              workspace_premium
            </span>
            <span className="font-headline text-xs font-extrabold text-on-background">
              Liv. {progression.level}
            </span>
          </div>
        </div>
      </div>

      {/* STICKERBOOK COMPLETION & LOOT BOOSTER PACK HERO BANNER */}
      <section className="p-4 bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile flex flex-col gap-3 relative overflow-hidden">
        {/* Top summary row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              stars
            </span>
            <div>
              <span className="font-headline text-xs font-extrabold text-on-background uppercase tracking-wider block">
                Album StickerBook
              </span>
              <span className="font-body text-[11px] text-on-surface-variant">
                {albumStats.discovered} di {albumStats.total} sbloccati ({albumStats.percentage}%)
              </span>
            </div>
          </div>

          <span className="font-headline text-lg font-extrabold text-primary">
            {albumStats.percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-surface-variant rounded-full border border-on-background/20 overflow-hidden relative p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${albumStats.percentage}%` }}
          />
        </div>

        {/* Booster Packs Callout */}
        <div className="mt-1 p-3 bg-secondary-container/60 rounded-2xl border-2 border-on-background shadow-tactile-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-secondary-container border-2 border-on-background flex items-center justify-center text-xl shadow-tactile-sm shrink-0 animate-bounce">
              🎁
            </div>
            <div className="min-w-0">
              <span className="font-headline text-xs font-extrabold text-on-background block truncate">
                {progression.unopenedPacks > 0
                  ? `${progression.unopenedPacks} Bustin${progression.unopenedPacks === 1 ? 'a' : 'e'} Misterios${progression.unopenedPacks === 1 ? 'a' : 'e'}!`
                  : 'Nessuna bustina disponibile'}
              </span>
              <span className="font-body text-[10px] text-on-surface-variant block">
                {progression.unopenedPacks > 0
                  ? '3 sticker rari o olografici all\'interno!'
                  : 'Riscatta o condividi coupon per riceverne!'}
              </span>
            </div>
          </div>

          {progression.unopenedPacks > 0 ? (
            <button
              onClick={handleStartOpenPack}
              className="px-4 py-2 rounded-xl bg-primary text-white font-headline text-xs font-extrabold border-2 border-on-background shadow-tactile active:scale-95 transition-all shrink-0 flex items-center gap-1.5 animate-pulse"
            >
              <span>Apri</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <span className="text-[10px] font-headline font-bold text-on-surface-variant/80 px-2 py-1 bg-surface-variant/50 rounded-lg">
              0 Bustine
            </span>
          )}
        </div>
      </section>

      {/* CATEGORY FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => {
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => {
                sound.playCuteTap();
                setSelectedCategory(catKey);
              }}
              className={`px-3 py-1.5 rounded-full border-2 border-on-background font-headline text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-primary-container text-on-background shadow-tactile-sm scale-105'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {catMeta.icon}
              </span>
              <span>{catMeta.label}</span>
            </button>
          );
        })}
      </div>

      {/* STICKERBOOK GRID (DISCOVERED vs SOLID BLACK MYSTERY) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {filteredCatalog.map((stk, index) => {
          const invItem = stickerInventory[stk.id];
          const isDiscovered = invItem && invItem.discovered;
          const count = invItem?.count || 0;
          const rarity = RARITY_LABELS[stk.rarity] || RARITY_LABELS.common;

          if (!isDiscovered) {
            // SOLID BLACK MYSTERY CARD (NO SHAPE OR ARTWORK REVEALED)
            return (
              <div
                key={stk.id}
                className="relative aspect-square p-2.5 rounded-2xl border-2 border-on-background/30 bg-[#171B2B] shadow-tactile-sm flex flex-col items-center justify-between text-center select-none"
              >
                <span className="text-[8px] font-headline font-extrabold text-white/40 uppercase tracking-wider">
                  #{index + 1}
                </span>

                {/* Pure mystery question mark badge */}
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-headline font-extrabold shadow-inner">
                  ?
                </div>

                <div className="w-full min-w-0">
                  <span className="font-headline text-[9px] font-extrabold text-white/60 block">
                    ???
                  </span>
                </div>
              </div>
            );
          }

          // DISCOVERED CARD
          return (
            <button
              key={stk.id}
              onClick={() => {
                sound.playCuteTap();
                setSelectedStickerDetail(stk);
              }}
              className={`relative aspect-square p-2 rounded-2xl border-2 border-on-background bg-gradient-to-b ${stk.bgGradient} shadow-tactile-sm hover:shadow-tactile hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-between text-center overflow-hidden group`}
            >
              {/* Rarity Pill Top */}
              <span
                className={`text-[8px] font-headline font-extrabold px-1.5 py-0.2 rounded-full border ${rarity.badgeBg}`}
              >
                {rarity.label}
              </span>

              {/* Kawaii Vector SVG Badge */}
              <div className="w-12 h-12 rounded-xl bg-white/90 border border-on-background/20 p-1 flex items-center justify-center filter drop-shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <StickerSvg id={stk.id} />
              </div>

              {/* Name & Count */}
              <div className="w-full min-w-0">
                <span className="font-headline text-[10px] font-extrabold text-on-background truncate block">
                  {stk.name}
                </span>
                <span className="font-body text-[9px] font-bold text-on-background/70 block">
                  x{count} nello zaino
                </span>
              </div>

              {/* Inventory availability indicator */}
              {count > 0 && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border border-on-background animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* STICKER DETAIL MODAL */}
      {selectedStickerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedStickerDetail(null)}
          />

          <div className="relative z-50 w-full max-w-xs mx-auto animate-modal-enter bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile-modal p-5 flex flex-col items-center text-center gap-3">
            {/* Big Illustrated Badge */}
            <div
              className={`w-24 h-24 rounded-3xl border-2 border-on-background bg-gradient-to-b ${selectedStickerDetail.bgGradient} shadow-tactile p-3 flex items-center justify-center`}
            >
              <StickerSvg id={selectedStickerDetail.id} />
            </div>

            <div>
              <span
                className={`text-[10px] font-headline font-extrabold px-2.5 py-0.5 rounded-full border inline-block mb-1 ${
                  RARITY_LABELS[selectedStickerDetail.rarity]?.badgeBg
                }`}
              >
                {RARITY_LABELS[selectedStickerDetail.rarity]?.label}
              </span>
              <h3 className="font-headline text-lg font-extrabold text-on-background">
                {selectedStickerDetail.name}
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1 px-2 leading-relaxed">
                "{selectedStickerDetail.description}"
              </p>
            </div>

            {/* Inventory Status Bar */}
            <div className="w-full p-2.5 bg-surface-variant rounded-xl border border-on-background/20 flex justify-between items-center text-xs font-headline font-bold">
              <span className="text-on-surface-variant">Copie disponibili:</span>
              <span className="text-primary font-extrabold text-sm">
                x{stickerInventory[selectedStickerDetail.id]?.count || 0}
              </span>
            </div>

            <button
              onClick={() => setSelectedStickerDetail(null)}
              className="w-full py-2.5 rounded-xl bg-primary-container text-on-background font-headline text-xs font-extrabold border-2 border-on-background shadow-tactile active:scale-95 transition-all"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* 3D BOOSTER PACK UNBOXING MODAL (3 STICKERS) */}
      {isOpeningPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={packStep === 'revealing' && flippedCards.length === 3 ? handleClosePackModal : undefined}
          />

          <div className="relative z-50 w-full max-w-sm mx-auto animate-modal-enter bg-surface-container-lowest rounded-3xl border-2 border-on-background shadow-tactile-modal p-6 flex flex-col items-center text-center gap-4 overflow-hidden">
            {packStep === 'sealed' ? (
              /* SEALED FOIL PACK VIEW */
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="font-headline text-xs font-extrabold text-primary uppercase tracking-widest">
                  Pacchetto Misterioso Kupon
                </span>

                {/* Animated Foil Pack Envelope */}
                <div className="w-48 h-64 rounded-3xl border-3 border-on-background bg-gradient-to-tr from-purple-500 via-pink-400 to-amber-300 shadow-tactile-lg flex flex-col items-center justify-between p-4 relative overflow-hidden group">
                  {/* Holographic Sheen Line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                  {/* Top Seal Perforation */}
                  <div className="w-full flex justify-between border-b-2 border-dashed border-white/60 pb-1">
                    <span className="text-[9px] font-headline font-bold text-white uppercase tracking-wider">
                      ★ 3 STICKERS ★
                    </span>
                    <span className="text-[9px] font-headline font-bold text-white uppercase">
                      TEAR HERE ✂️
                    </span>
                  </div>

                  {/* Pack Center Emblem */}
                  <div className="w-20 h-20 rounded-full bg-white/90 border-2 border-on-background shadow-tactile-sm flex items-center justify-center text-4xl">
                    <span>✨</span>
                  </div>

                  <div className="text-center text-white">
                    <h4 className="font-headline text-base font-extrabold drop-shadow">
                      Booster Pack
                    </h4>
                    <p className="font-headline text-[10px] font-bold opacity-90">
                      Rarità Garantita!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTearPack}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-amber-400 hover:from-primary-fixed hover:to-amber-300 text-on-background font-headline text-sm font-extrabold rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">content_cut</span>
                  <span>Strappa la Bustina!</span>
                </button>
              </div>
            ) : (
              /* REVEALING 3 INTERACTIVE STICKERS VIEW */
              <div className="flex flex-col items-center gap-3.5 w-full">
                <div>
                  <span className="font-headline text-xs font-extrabold text-primary uppercase tracking-wider">
                    🎉 Pacchetto Aperto!
                  </span>
                  <h3 className="font-headline text-base font-extrabold text-on-background">
                    {flippedCards.length < 3
                      ? `Tocca le carte per scoprirle (${flippedCards.length}/3)`
                      : 'Ecco i tuoi nuovi Sticker!'}
                  </h3>
                </div>

                {/* 3 Interactive Cards (Facedown / Flipped) */}
                <div className="grid grid-cols-3 gap-2.5 w-full">
                  {currentDrawnPack?.stickers.map((stk, idx) => {
                    const isFlipped = flippedCards.includes(idx);
                    const isNew = currentDrawnPack.newDiscoveries.includes(stk.id);
                    const rarity = RARITY_LABELS[stk.rarity] || RARITY_LABELS.common;

                    if (!isFlipped) {
                      /* FACE-DOWN MYSTERY CARD */
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFlipCard(idx)}
                          className="p-2 rounded-2xl border-2 border-on-background bg-gradient-to-tr from-indigo-900 via-purple-800 to-pink-700 shadow-tactile hover:shadow-tactile-lg hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-between text-center min-h-36 relative overflow-hidden group cursor-pointer"
                        >
                          {/* Holographic Sheen */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                          <span className="text-[9px] font-headline font-bold text-white/80 uppercase">
                            Carta #{idx + 1}
                          </span>

                          {/* Mystery Question Emblem */}
                          <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl text-white font-extrabold shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            ?
                          </div>

                          <span className="text-[9px] font-headline font-extrabold text-amber-300 animate-pulse">
                            Tocca! ✨
                          </span>
                        </button>
                      );
                    }

                    /* REVEALED STICKER CARD */
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-2xl border-2 border-on-background bg-gradient-to-b ${stk.bgGradient} shadow-tactile-sm flex flex-col items-center justify-between text-center min-h-36 relative animate-modal-enter`}
                      >
                        {/* New or Duplicate Badge */}
                        {isNew ? (
                          <span className="text-[8px] font-headline font-extrabold bg-primary text-white px-1.5 py-0.2 rounded-full border border-on-background shadow-tactile-sm animate-bounce">
                            NUOVO!
                          </span>
                        ) : (
                          <span className="text-[8px] font-headline font-bold bg-white/90 text-on-background px-1.5 py-0.2 rounded-full border border-on-background/30">
                            +1 Copia
                          </span>
                        )}

                        {/* Vector Die-cut Sticker */}
                        <div className="w-12 h-12 flex items-center justify-center p-0.5 my-0.5">
                          <StickerSvg id={stk.id} rarity={stk.rarity} />
                        </div>

                        <div className="w-full min-w-0">
                          <span className="font-headline text-[9px] font-extrabold text-on-background truncate block">
                            {stk.name}
                          </span>
                          <span
                            className={`text-[7px] font-headline font-bold block ${rarity.textClass}`}
                          >
                            {rarity.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                {flippedCards.length < 3 ? (
                  <button
                    type="button"
                    onClick={handleRevealAllCards}
                    className="font-headline text-xs font-bold text-primary hover:underline py-1"
                  >
                    ⚡ Scopri Tutte le Carte
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClosePackModal}
                    className="w-full py-3 bg-gradient-to-r from-primary to-amber-400 hover:from-primary-fixed hover:to-amber-300 text-on-background font-headline text-xs font-extrabold rounded-2xl border-2 border-on-background shadow-tactile active:scale-95 transition-all"
                  >
                    Metti nello Zaino ✨
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
