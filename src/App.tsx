import React, { useEffect } from 'react';
import { useCouponStore } from './store/couponStore';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { QRCodeModal } from './components/QRCodeModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ShareCouponModal } from './components/ShareCouponModal';
import { GiftClaimModal } from './components/GiftClaimModal';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './screens/HomeScreen';
import { CreateCouponScreen } from './screens/CreateCouponScreen';
import { ScanScreen } from './screens/ScanScreen';
import { DealsScreen } from './screens/DealsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const App: React.FC = () => {
  const activeTab = useCouponStore((state) => state.activeTab);
  const selectedCouponForQR = useCouponStore((state) => state.selectedCouponForQR);
  const closeQRModal = useCouponStore((state) => state.closeQRModal);
  const selectedCouponForShare = useCouponStore((state) => state.selectedCouponForShare);
  const closeShareModal = useCouponStore((state) => state.closeShareModal);
  const openQRModal = useCouponStore((state) => state.openQRModal);
  const isScannerOpen = useCouponStore((state) => state.isScannerOpen);
  const closeScanner = useCouponStore((state) => state.closeScanner);
  const toast = useCouponStore((state) => state.toast);
  const hideToast = useCouponStore((state) => state.hideToast);
  const loadCoupons = useCouponStore((state) => state.loadCoupons);
  const hasCompletedSetup = useCouponStore((state) => state.hasCompletedSetup);
  const isOnboardingOpen = useCouponStore((state) => state.isOnboardingOpen);

  const qrModalMode = useCouponStore((state) => state.qrModalMode);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <Header />

      {/* Main Tab Screen Content */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {activeTab === 'wallet' && <HomeScreen />}
        {activeTab === 'create' && <CreateCouponScreen />}
        {activeTab === 'scan' && <ScanScreen />}
        {activeTab === 'deals' && <DealsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNavBar />

      {/* QR Code Presentation Modal (Supports both Transfer and Redeem) */}
      <QRCodeModal
        coupon={selectedCouponForQR}
        mode={qrModalMode}
        onClose={closeQRModal}
      />

      {/* Share & Send Modal */}
      <ShareCouponModal
        coupon={selectedCouponForShare}
        onClose={closeShareModal}
        onOpenQR={openQRModal}
      />

      {/* Gift Claim Modal for Incoming Shared Links */}
      <GiftClaimModal />

      {/* Fullscreen Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={closeScanner}
      />

      {/* First Run Onboarding & Setup Wizard */}
      <OnboardingModal
        isOpen={!hasCompletedSetup || isOnboardingOpen}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div
          onClick={hideToast}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl border-2 border-on-background shadow-tactile font-headline text-xs font-bold flex items-center gap-2 cursor-pointer transition-all animate-modal-enter max-w-[90%] ${
            toast.type === 'success'
              ? 'bg-secondary-container text-on-background'
              : toast.type === 'error'
              ? 'bg-error-container text-error'
              : 'bg-primary-container text-on-background'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
