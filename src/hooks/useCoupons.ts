import { useState, useEffect, useMemo } from 'react';
import { Coupon } from '../types/coupon';
import { useCouponStore } from '../store/couponStore';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export interface CouponWithCleanup extends Coupon {
  timeRemainingMs: number | null; // Milliseconds until 2-hour removal if redeemed
  timeRemainingFormatted: string | null;
}

/**
 * Custom hook that listens to the coupon store and enforces the 2-Hour Cleanup Filter Rule:
 * `status === 'active' || (status === 'redeemed' && now - redeemed_at < 2 hours)`
 */
export function useCoupons() {
  const coupons = useCouponStore((state) => state.coupons);
  const filterStatus = useCouponStore((state) => state.filterStatus);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Keep a 5-second interval to dynamically compute time-to-removal and auto-clean
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute filtered list and remaining time
  const processedCoupons: CouponWithCleanup[] = useMemo(() => {
    return coupons
      .map((c) => {
        let timeRemainingMs: number | null = null;
        let timeRemainingFormatted: string | null = null;

        if (c.status === 'redeemed' && c.redeemed_at) {
          const redeemedTime = new Date(c.redeemed_at).getTime();
          const elapsed = currentTime - redeemedTime;
          const remaining = TWO_HOURS_MS - elapsed;

          if (remaining > 0) {
            timeRemainingMs = remaining;
            const minutesLeft = Math.ceil(remaining / (60 * 1000));
            if (minutesLeft >= 60) {
              const hours = Math.floor(minutesLeft / 60);
              const mins = minutesLeft % 60;
              timeRemainingFormatted = `${hours}h ${mins}m left`;
            } else {
              timeRemainingFormatted = `${minutesLeft}m left`;
            }
          } else {
            timeRemainingMs = 0;
            timeRemainingFormatted = 'Expiring now';
          }
        }

        return {
          ...c,
          timeRemainingMs,
          timeRemainingFormatted,
        };
      })
      .filter((c) => {
        // Core 2-Hour Cleanup Filter Rule:
        // Show if active OR (if redeemed AND within 2 hours of redeemed_at)
        if (c.status === 'active') return true;
        if (c.status === 'redeemed' && c.redeemed_at) {
          const redeemedTime = new Date(c.redeemed_at).getTime();
          return currentTime - redeemedTime < TWO_HOURS_MS;
        }
        return false;
      });
  }, [coupons, currentTime]);

  // Apply user-selected tab filter ('all' | 'active' | 'redeemed')
  const visibleCoupons = useMemo(() => {
    if (filterStatus === 'active') {
      return processedCoupons.filter((c) => c.status === 'active');
    }
    if (filterStatus === 'redeemed') {
      return processedCoupons.filter((c) => c.status === 'redeemed');
    }
    return processedCoupons;
  }, [processedCoupons, filterStatus]);

  const activeCount = useMemo(() => {
    return processedCoupons.filter((c) => c.status === 'active').length;
  }, [processedCoupons]);

  const redeemedCount = useMemo(() => {
    return processedCoupons.filter((c) => c.status === 'redeemed').length;
  }, [processedCoupons]);

  return {
    coupons: visibleCoupons,
    activeCount,
    redeemedCount,
    totalVisibleCount: visibleCoupons.length,
  };
}
