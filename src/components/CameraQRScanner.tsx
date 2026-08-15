import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { sound } from '../services/soundService';

interface CameraQRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onError?: (errorMessage: string) => void;
  scannerId?: string;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  onScanSuccess,
  onError,
  scannerId = 'kupon-camera-reader',
}) => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraError(null);
        // Ensure element is ready in DOM
        const element = document.getElementById(scannerId);
        if (!element) return;

        // Check mediaDevices support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Il dispositivo non supporta l\'accesso alla fotocamera.');
        }

        // Initialize scanner instance
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerId, {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            verbose: false,
          });
        }

        const qrCode = scannerRef.current;

        // Check if already running
        if (qrCode.isScanning) {
          await qrCode.stop();
        }

        // 1. Request camera permission upfront so Android WebView triggers prompt if needed
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode } },
          });
          // Immediately stop preview stream to release camera hardware for Html5Qrcode
          stream.getTracks().forEach((track) => track.stop());
        } catch (permErr: unknown) {
          const pErr = permErr as { name?: string; message?: string };
          if (pErr?.name === 'NotAllowedError' || pErr?.name === 'PermissionDeniedError') {
            throw new Error('Permesso fotocamera negato. Consenti l\'accesso alla fotocamera per scannerizzare i QR code.');
          }
        }

        // 2. Query available video devices
        let cameraSelection: string | { facingMode: 'environment' | 'user' } = { facingMode };
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            if (facingMode === 'environment') {
              const backCam =
                devices.find(
                  (d) =>
                    d.label.toLowerCase().includes('back') ||
                    d.label.toLowerCase().includes('rear') ||
                    d.label.toLowerCase().includes('posteriore') ||
                    d.label.toLowerCase().includes('environment')
                ) || devices[devices.length - 1]; // On Android, back camera is often the last or labelled back
              cameraSelection = backCam.id;
            } else {
              const frontCam =
                devices.find(
                  (d) =>
                    d.label.toLowerCase().includes('front') ||
                    d.label.toLowerCase().includes('user') ||
                    d.label.toLowerCase().includes('anteriore')
                ) || devices[0];
              cameraSelection = frontCam.id;
            }
          }
        } catch (devErr) {
          console.warn('Error querying devices, falling back to facingMode constraint:', devErr);
          cameraSelection = { facingMode };
        }

        const config = {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await qrCode.start(
          cameraSelection,
          config,
          (decodedText) => {
            if (isMounted) {
              sound.playScanBeep();
              onScanSuccess(decodedText);
            }
          },
          (errorMessage) => {
            if (onError && !errorMessage.includes('No QR code found')) {
              onError(errorMessage);
            }
          }
        );

        if (isMounted) {
          setHasCamera(true);
          setIsScanning(true);
        }
      } catch (err: unknown) {
        console.warn('Camera start error:', err);
        if (isMounted) {
          setHasCamera(false);
          const errorMsg =
            err instanceof Error ? err.message : String(err);
          setCameraError(
            errorMsg.includes('Permesso') || errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')
              ? 'Permesso fotocamera negato. Consenti l\'accesso alla fotocamera nelle impostazioni dell\'app per inquadrare i QR code.'
              : errorMsg || 'Impossibile avviare la fotocamera.'
          );
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {
          // ignore cleanup error
        });
      }
    };
  }, [facingMode, onScanSuccess, onError, scannerId, retryKey]);

  // Switch between front & back camera
  const handleToggleFacingMode = () => {
    sound.playCuteTap();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Scan directly from an image file uploaded by user
  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && scannerRef.current) {
      sound.playCuteTap();
      try {
        const decoded = await scannerRef.current.scanFile(file, true);
        sound.playScanBeep();
        onScanSuccess(decoded);
      } catch (err) {
        console.warn('Scan from image failed:', err);
        setCameraError('Nessun QR Code valido trovato in questa immagine.');
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-black">
      {/* HTML5 QR Code Video Target Container */}
      <div
        id={scannerId}
        className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
      />

      {/* Laser Scanline when active */}
      {isScanning && (
        <div className="absolute w-[82%] h-1 bg-[#FFB5A7] rounded-full shadow-[0_0_15px_#FFB5A7] animate-laser-scan z-20 pointer-events-none" />
      )}

      {/* Stitch Corner Brackets Overlay */}
      <div className="absolute top-4 left-4 w-9 h-9 border-t-[6px] border-l-[6px] border-[#FFB5A7] rounded-tl-[20px] pointer-events-none z-10" />
      <div className="absolute top-4 right-4 w-9 h-9 border-t-[6px] border-r-[6px] border-[#FFB5A7] rounded-tr-[20px] pointer-events-none z-10" />
      <div className="absolute bottom-4 left-4 w-9 h-9 border-b-[6px] border-l-[6px] border-[#FFB5A7] rounded-bl-[20px] pointer-events-none z-10" />
      <div className="absolute bottom-4 right-4 w-9 h-9 border-b-[6px] border-r-[6px] border-[#FFB5A7] rounded-br-[20px] pointer-events-none z-10" />

      {/* Fallback & Permission Info Overlay */}
      {cameraError && (
        <div className="absolute inset-0 bg-[#171B2B]/90 backdrop-blur-sm z-30 p-5 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center border-2 border-on-background">
            <span className="material-symbols-outlined text-2xl">videocam_off</span>
          </div>
          <p className="font-headline text-xs font-bold text-white max-w-xs">
            {cameraError}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-container text-on-background font-headline text-xs font-extrabold rounded-full border-2 border-on-background shadow-tactile-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">photo_library</span>
              <span>Carica da Galleria</span>
            </button>
            <button
              onClick={() => {
                sound.playCuteTap();
                setRetryKey((k) => k + 1);
              }}
              className="px-4 py-2 bg-surface-variant text-on-background font-headline text-xs font-extrabold rounded-full border border-on-background/30 active:scale-95 transition-all"
            >
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* Floating Camera Control Badges */}
      {hasCamera && !cameraError && (
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
          {/* Switch Camera Button */}
          <button
            type="button"
            onClick={handleToggleFacingMode}
            className="w-10 h-10 rounded-full bg-surface-container-lowest/90 text-on-background border-2 border-on-background shadow-tactile-sm flex items-center justify-center active:scale-95 transition-transform"
            title="Cambia fotocamera (Frontale/Posteriore)"
          >
            <span className="material-symbols-outlined text-xl">cameraswitch</span>
          </button>
        </div>
      )}

      {/* Hidden File Input for scanning from photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileScan}
      />
    </div>
  );
};
