import React, { useState } from 'react';
import { useCouponStore } from '../store/couponStore';
import { fireRedemptionConfetti } from './Confetti';
import { Coupon } from '../types/coupon';
import { sound } from '../services/soundService';
import { CameraQRScanner } from './CameraQRScanner';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const processScannedCode = useCouponStore((state) => state.processScannedCode);
  const [manualToken, setManualToken] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    action: 'transferred' | 'redeemed';
    coupon: Coupon;
  } | null>(null);

  if (!isOpen) return null;

  const handleScanSuccess = (decodedText: string) => {
    const res = processScannedCode(decodedText);
    if (res.success && res.coupon) {
      if (res.action === 'transferred') {
        sound.playCreateGift();
        setTimeout(() => sound.playSuccessChime(), 150);
      } else {
        sound.playPaperTear();
        setTimeout(() => {
          sound.playSuccessChime();
          if (res.coupon?.secret_message) {
            setTimeout(() => sound.playSecretUnlocked(), 250);
          }
        }, 150);
      }

      fireRedemptionConfetti();
      setScannedResult({
        action: res.action || 'redeemed',
        coupon: res.coupon,
      });
    }
  };

  const handleManualRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    handleScanSuccess(manualToken);
    setManualToken('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171B2B] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar with Close Button */}
      <div className="relative z-30 p-4 flex justify-between items-center w-full max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-surface-container-lowest text-on-background border-2 border-on-background flex items-center justify-center shadow-tactile active:translate-y-0.5 transition-transform"
          aria-label="Close Scanner"
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>

        <span className="font-headline text-sm font-bold bg-[#2C3041] px-3.5 py-1.5 rounded-full border border-white/20 text-white tracking-wide">
          Scannerizza Kupon
        </span>

        <div className="w-11" />
      </div>

      {/* Viewfinder Center Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {scannedResult ? (
          /* Scanned Result Confirmation (Transfer vs Redemption) */
          <div className="w-full max-w-sm bg-surface-container-lowest text-on-background p-6 rounded-3xl border-2 border-on-background shadow-tactile-modal flex flex-col items-center text-center animate-tear-redeem">
            <div
              className={`w-16 h-16 rounded-full border-2 border-on-background p-2 flex items-center justify-center mb-2 ${
                scannedResult.action === 'transferred'
                  ? 'bg-primary-container'
                  : 'bg-secondary-container'
              }`}
            >
              <span className="material-symbols-outlined text-3xl text-on-background">
                {scannedResult.action === 'transferred' ? 'card_giftcard' : 'check_circle'}
              </span>
            </div>

            <span
              className={`font-headline text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border border-on-background/20 mb-1 ${
                scannedResult.action === 'transferred'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-secondary-container text-on-secondary-container'
              }`}
            >
              {scannedResult.action === 'transferred'
                ? '🎁 Kupon Aggiunto al Wallet!'
                : '🎟️ Riscattato con Successo!'}
            </span>

            <h3 className="font-headline text-xl font-extrabold text-on-background">
              {scannedResult.coupon.title}
            </h3>

            {scannedResult.action === 'transferred' ? (
              <p className="font-body text-xs text-on-surface-variant mt-1.5 px-2">
                Il Kupon inviato da <strong>{scannedResult.coupon.sender_id}</strong> è ora nel tuo portafoglio, pronto per essere utilizzato quando vuoi!
              </p>
            ) : scannedResult.coupon.secret_message ? (
              /* Secret Message Box for Redemption */
              <div className="w-full mt-3 p-3.5 bg-primary-container rounded-2xl border-2 border-on-background shadow-tactile-sm text-left">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <span className="material-symbols-outlined text-base">lock_open</span>
                  <span className="font-headline text-[11px] font-extrabold uppercase">
                    Messaggio Segreto da {scannedResult.coupon.sender_id}:
                  </span>
                </div>
                <p className="font-body text-xs font-bold text-on-background">
                  "{scannedResult.coupon.secret_message}"
                </p>
              </div>
            ) : (
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Il biglietto è stato strappato e completato.
              </p>
            )}

            <button
              onClick={() => {
                setScannedResult(null);
                onClose();
              }}
              className="mt-4 w-full py-3 bg-primary-container text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile active:scale-95 transition-all"
            >
              Fatto! Vai al Portafoglio
            </button>
          </div>
        ) : (
          <>
            {/* Instruction Headline */}
            <p className="font-headline text-xl font-extrabold text-white text-center mb-4 drop-shadow-md">
              Inquadra il QR code Kupon
            </p>

            {/* REAL CAMERA SCANNER FEED CONTAINER */}
            <div className="relative w-72 h-72 rounded-3xl border-2 border-[#FFB5A7] overflow-hidden shadow-[0_0_25px_rgba(255,181,167,0.2)]">
              <CameraQRScanner
                scannerId="modal-camera-stream"
                onScanSuccess={handleScanSuccess}
              />
            </div>

            <p className="font-body text-xs text-white/70 text-center mt-4 max-w-[260px]">
              Punta la fotocamera verso il QR code per ricevere o riscattare il biglietto.
            </p>
          </>
        )}
      </div>

      {/* Bottom Area: Manual Input & Gallery Upload */}
      {!scannedResult && (
        <div className="relative z-30 pb-8 pt-2 px-4 flex flex-col items-center bg-gradient-to-t from-black via-black/90 to-transparent w-full max-w-lg mx-auto">
          {/* Manual Token Input Bar */}
          <form onSubmit={handleManualRedeem} className="w-full mb-3 flex gap-2">
            <input
              type="text"
              placeholder="Incolla codice Kupon o link..."
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="flex-1 bg-surface-container-lowest text-on-background placeholder-gray-400 text-xs font-mono font-bold px-4 py-3 rounded-full border-2 border-on-background focus:outline-none shadow-tactile-sm"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary-container text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile-sm hover:bg-primary-fixed active:scale-95 transition-all"
            >
              Elabora
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
