import React, { useState } from 'react';
import { useCouponStore } from '../store/couponStore';
import { MASCOT } from '../theme/tokens';
import { fireRedemptionConfetti } from '../components/Confetti';
import { Coupon } from '../types/coupon';
import { sound } from '../services/soundService';
import { CameraQRScanner } from '../components/CameraQRScanner';

export const ScanScreen: React.FC = () => {
  const processScannedCode = useCouponStore((state) => state.processScannedCode);
  const setActiveTab = useCouponStore((state) => state.setActiveTab);
  const [tokenInput, setTokenInput] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    action: 'transferred' | 'redeemed';
    coupon: Coupon;
  } | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    if (!decodedText.trim()) return;
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    handleScanSuccess(tokenInput);
    setTokenInput('');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-2 flex flex-col gap-5">
      <div>
        <h2 className="font-headline text-2xl font-extrabold text-on-background">
          Scannerizza Kupon
        </h2>
        <p className="font-body text-xs text-on-surface-variant">
          Inquadra il QR code con la fotocamera per ricevere o riscattare
        </p>
      </div>

      {/* REAL CAMERA SCANNER SECTION */}
      <div className="relative w-full aspect-square max-h-80 bg-[#171B2B] rounded-3xl border-2 border-on-background shadow-tactile flex flex-col items-center justify-center overflow-hidden p-2">
        {scannedResult ? (
          <div className="z-30 bg-surface-container-lowest text-on-background p-5 rounded-2xl border-2 border-on-background shadow-tactile text-center animate-tear-redeem max-w-xs">
            <span className="material-symbols-outlined text-4xl text-secondary">
              {scannedResult.action === 'transferred' ? 'card_giftcard' : 'check_circle'}
            </span>
            <h4 className="font-headline text-base font-extrabold mt-1">
              {scannedResult.action === 'transferred'
                ? '🎁 Kupon Aggiunto al Wallet!'
                : '🎟️ Strappato & Riscattato!'}
            </h4>
            <p className="font-headline text-sm font-bold text-primary mt-0.5">
              {scannedResult.coupon.title}
            </p>

            {scannedResult.action === 'transferred' ? (
              <p className="font-body text-xs text-on-surface-variant mt-1 px-1">
                Ricevuto da <strong>{scannedResult.coupon.sender_id}</strong> e salvato nel tuo portafoglio.
              </p>
            ) : scannedResult.coupon.secret_message ? (
              <div className="mt-2 p-2 bg-primary-container rounded-xl border border-on-background/30 text-left">
                <span className="font-headline text-[10px] font-extrabold uppercase text-primary block">
                  🎁 Messaggio Segreto:
                </span>
                <p className="font-body text-xs font-bold text-on-background mt-0.5">
                  "{scannedResult.coupon.secret_message}"
                </p>
              </div>
            ) : null}

            <button
              onClick={() => {
                sound.playCuteTap();
                setScannedResult(null);
                setActiveTab('wallet');
              }}
              className="mt-3 px-5 py-2 bg-primary-container text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile-sm"
            >
              Vai al Portafoglio
            </button>
          </div>
        ) : (
          <CameraQRScanner
            scannerId="screen-camera-stream"
            onScanSuccess={handleScanSuccess}
          />
        )}
      </div>

      {/* Manual Input Form */}
      <form
        onSubmit={handleManualSubmit}
        className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-on-background shadow-tactile flex flex-col gap-2.5"
      >
        <label className="font-headline text-xs font-bold text-on-background flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">key</span>
          <span>Hai un codice promo o token manuale?</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="es. kpn_tok_... o incolla link regalo"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-surface-variant font-mono text-xs font-bold text-on-background rounded-xl border-2 border-on-background focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary-container text-on-background font-headline text-xs font-extrabold rounded-xl border-2 border-on-background shadow-tactile-sm active:scale-95 transition-all"
          >
            Riscatta
          </button>
        </div>
      </form>

      {/* Real Help Card */}
      <div className="flex items-center gap-3 p-3.5 bg-secondary-container rounded-2xl border-2 border-on-background shadow-tactile-sm">
        <div className="w-12 h-12 rounded-full border-2 border-on-background bg-surface-container-lowest p-0.5 shadow-tactile-sm shrink-0 flex items-center justify-center">
          <img
            src={MASCOT.avatarUrl}
            alt="Mascot Helper"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <p className="font-headline text-xs font-extrabold text-on-secondary-container">
            Scansione Intelligente in Tempo Reale
          </p>
          <p className="font-body text-[11px] text-on-secondary-container/80 mt-0.5">
            Lo scanner riconosce sia i QR di trasferimento per salvare un regalo nel tuo wallet, sia i QR di riscatto per strappare il biglietto!
          </p>
        </div>
      </div>
    </div>
  );
};
