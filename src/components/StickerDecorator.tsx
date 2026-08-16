import React, { useState, useRef } from 'react';
import { AppliedSticker } from '../types/sticker';
import { STICKERS_CATALOG, RARITY_LABELS } from '../data/stickersCatalog';
import { useCouponStore } from '../store/couponStore';
import { sound } from '../services/soundService';
import { StickerSvg } from './StickerSvg';

interface StickerDecoratorProps {
  appliedStickers: AppliedSticker[];
  onChange: (updated: AppliedSticker[]) => void;
  children: React.ReactNode;
}

export const StickerDecorator: React.FC<StickerDecoratorProps> = ({
  appliedStickers,
  onChange,
  children,
}) => {
  const stickerInventory = useCouponStore((state) => state.stickerInventory);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    startStickerX: number;
    startStickerY: number;
    rect: DOMRect;
  } | null>(null);

  // Available stickers in inventory (count > 0 after subtracting already placed stickers)
  const placedCountMap = appliedStickers.reduce<Record<string, number>>((acc, s) => {
    acc[s.stickerId] = (acc[s.stickerId] || 0) + 1;
    return acc;
  }, {});

  const availableStickers = STICKERS_CATALOG.filter((stk) => {
    const totalOwned = stickerInventory[stk.id]?.count || 0;
    const placed = placedCountMap[stk.id] || 0;
    return totalOwned - placed > 0;
  });

  const handleAddSticker = (stickerId: string) => {
    sound.playCuteTap();
    const newApplied: AppliedSticker = {
      id: `app-stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stickerId,
      x: 35 + Math.random() * 25,
      y: 35 + Math.random() * 25,
      scale: 1,
      rotation: Math.floor(Math.random() * 20) - 10,
    };
    const updated = [...appliedStickers, newApplied];
    onChange(updated);
    setSelectedPlacementId(newApplied.id);
    setIsPickerOpen(false);
  };

  const handleRemoveSticker = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playCuteTap();
    const updated = appliedStickers.filter((s) => s.id !== id);
    onChange(updated);
    if (selectedPlacementId === id) {
      setSelectedPlacementId(null);
    }
  };

  const handleRotateSticker = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playCuteTap();
    const updated = appliedStickers.map((s) =>
      s.id === id ? { ...s, rotation: (s.rotation + 45) % 360 } : s
    );
    onChange(updated);
  };

  const handleCycleScale = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playCuteTap();
    const scales = [0.8, 1.0, 1.35];
    const updated = appliedStickers.map((s) => {
      if (s.id !== id) return s;
      const currentIdx = scales.findIndex((sc) => Math.abs(sc - s.scale) < 0.1);
      const nextScale = scales[(currentIdx + 1) % scales.length] || 1.0;
      return { ...s, scale: nextScale };
    });
    onChange(updated);
  };

  // Robust Drag Handlers with Pointer Capture
  const handlePointerDown = (placementId: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedPlacementId(placementId);

    const container = containerRef.current;
    if (!container) return;

    const currentSticker = appliedStickers.find((s) => s.id === placementId);
    if (!currentSticker) return;

    // Capture pointer events so dragging is rock solid
    e.currentTarget.setPointerCapture(e.pointerId);

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startStickerX: currentSticker.x,
      startStickerY: currentSticker.y,
      rect: container.getBoundingClientRect(),
    };
  };

  const handlePointerMove = (placementId: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current) return;
    const { startX, startY, startStickerX, startStickerY, rect } = dragInfoRef.current;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const deltaPercentX = (deltaX / rect.width) * 100;
    const deltaPercentY = (deltaY / rect.height) * 100;

    const newX = Math.max(8, Math.min(92, startStickerX + deltaPercentX));
    const newY = Math.max(8, Math.min(92, startStickerY + deltaPercentY));

    const updated = appliedStickers.map((s) =>
      s.id === placementId ? { ...s, x: newX, y: newY } : s
    );
    onChange(updated);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragInfoRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      dragInfoRef.current = null;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Ticket Canvas Wrapper */}
      <div
        ref={containerRef}
        onClick={() => setSelectedPlacementId(null)}
        className="relative w-full rounded-2xl select-none overflow-visible touch-none"
      >
        {children}

        {/* Applied Stickers Layer */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {appliedStickers.map((app) => {
            const def = STICKERS_CATALOG.find((d) => d.id === app.stickerId);
            if (!def) return null;
            const isSelected = app.id === selectedPlacementId;

            return (
              <div
                key={app.id}
                onPointerDown={(e) => handlePointerDown(app.id, e)}
                onPointerMove={(e) => handlePointerMove(app.id, e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  left: `${app.x}%`,
                  top: `${app.y}%`,
                  transform: `translate(-50%, -50%) rotate(${app.rotation}deg) scale(${app.scale})`,
                  touchAction: 'none',
                }}
                className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing p-1 transition-all ${
                  isSelected ? 'z-40' : 'hover:scale-105'
                }`}
              >
                {/* Real Physical Die-Cut Sticker SVG */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-1 relative ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-2xl bg-white/30 backdrop-blur-xs' : ''
                  }`}
                >
                  <StickerSvg id={def.id} rarity={def.rarity} />
                </div>

                {/* Floating Quick Action Mini-Pill (When selected) */}
                {isSelected && (
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-lowest border-2 border-on-background shadow-tactile rounded-full px-2 py-1 flex items-center gap-1.5 z-50 animate-modal-enter whitespace-nowrap"
                  >
                    {/* Rotate button */}
                    <button
                      type="button"
                      onClick={(e) => handleRotateSticker(app.id, e)}
                      title="Ruota di 45°"
                      className="p-1 rounded-full hover:bg-secondary-container text-on-background active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px] block">
                        rotate_right
                      </span>
                    </button>

                    {/* Scale cycle button */}
                    <button
                      type="button"
                      onClick={(e) => handleCycleScale(app.id, e)}
                      title="Cambia dimensione"
                      className="p-1 rounded-full hover:bg-secondary-container text-on-background font-headline text-[10px] font-extrabold active:scale-90 transition-all"
                    >
                      {app.scale <= 0.85 ? 'S' : app.scale >= 1.25 ? 'L' : 'M'}
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSticker(app.id, e)}
                      title="Rimuovi"
                      className="p-1 rounded-full bg-error-container text-error hover:bg-error hover:text-white active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px] block">
                        delete
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean, Simple Sticker Add CTA Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => {
            sound.playCuteTap();
            setIsPickerOpen(true);
          }}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-surface-container-lowest border-2 border-on-background shadow-tactile hover:shadow-tactile-lg active:scale-98 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-headline text-xs font-extrabold text-on-background">
              {appliedStickers.length === 0
                ? 'Applica uno Sticker al Coupon'
                : `${appliedStickers.length} Sticker applicat${appliedStickers.length === 1 ? 'o' : 'i'} (Trascina per spostare)`}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-primary-container font-headline text-[11px] font-extrabold text-on-background border border-on-background/30 flex items-center gap-1">
            <span>+ Aggiungi</span>
            <span className="material-symbols-outlined text-xs">add</span>
          </span>
        </button>
      </div>

      {/* ELEGANT STICKER PICKER MODAL / SHEET */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsPickerOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-on-background shadow-tactile-modal p-5 flex flex-col gap-4 animate-modal-enter max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-on-background/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <div>
                  <h3 className="font-headline text-base font-extrabold text-on-background">
                    I Tuoi Sticker Disponibili
                  </h3>
                  <p className="font-body text-[11px] text-on-surface-variant">
                    Tocca uno sticker dal tuo zaino per applicarlo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Grid of available stickers */}
            {availableStickers.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 overflow-y-auto max-h-72 p-1 no-scrollbar">
                {availableStickers.map((stk) => {
                  const totalOwned = stickerInventory[stk.id]?.count || 0;
                  const placed = placedCountMap[stk.id] || 0;
                  const remaining = totalOwned - placed;
                  const rarity = RARITY_LABELS[stk.rarity] || RARITY_LABELS.common;

                  return (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => handleAddSticker(stk.id)}
                      className="relative p-2 rounded-2xl border-2 border-on-background bg-gradient-to-b from-white to-surface-variant shadow-tactile-sm hover:shadow-tactile hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-between text-center min-h-24 group"
                    >
                      {/* Count badge */}
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-on-background shadow-tactile-sm">
                        x{remaining}
                      </span>

                      {/* Vector Die-Cut SVG */}
                      <div className="w-12 h-12 flex items-center justify-center p-0.5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <StickerSvg id={stk.id} rarity={stk.rarity} />
                      </div>

                      <div className="w-full min-w-0 mt-1">
                        <span className="font-headline text-[9px] font-bold text-on-background truncate block">
                          {stk.name}
                        </span>
                        <span className={`text-[7px] font-headline font-bold block ${rarity.textClass}`}>
                          {rarity.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-surface-variant/40 rounded-2xl border-2 border-dashed border-on-background/20 text-center flex flex-col items-center gap-2 my-2">
                <span className="text-3xl">🎁</span>
                <h4 className="font-headline text-xs font-bold text-on-background">
                  Nessuno sticker disponibile nello zaino
                </h4>
                <p className="font-body text-[11px] text-on-surface-variant max-w-xs">
                  Apri le bustine misteriose nello StickerBook per trovare nuovi sticker rari e leggendari!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
