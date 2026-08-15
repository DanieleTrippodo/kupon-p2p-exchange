export interface P2PClaimEvent {
  action: 'transferred' | 'redeemed';
  token: string;
  couponId?: string;
  senderName?: string;
  claimerName?: string;
  timestamp: string;
}

/**
 * P2P Real-Time Sync Service: Provides zero-configuration, instant cross-device
 * synchronization when a QR code is presented and scanned.
 */
export class P2PSyncService {
  private static sanitizeTopic(token: string): string {
    // Create a safe, unique topic name from the coupon token
    const clean = token.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    return `kpn_sync_${clean}`;
  }

  /**
   * Listen for real-time claim / transfer events on a specific coupon token
   * @param token Coupon QR token
   * @param onClaim Callback triggered when peer scans the coupon
   * @returns Unsubscribe cleanup function
   */
  public static listenForClaim(
    token: string,
    onClaim: (event: P2PClaimEvent) => void
  ): () => void {
    if (!token) return () => {};

    const topic = this.sanitizeTopic(token);
    let eventSource: EventSource | null = null;
    let isClosed = false;

    try {
      // Connect using Server-Sent Events over HTTPS (supported natively on Android & Web)
      eventSource = new EventSource(`https://ntfy.sh/${topic}/sse`);

      eventSource.onmessage = (e) => {
        if (isClosed) return;
        try {
          const raw = JSON.parse(e.data);
          if (raw && raw.message) {
            const parsedEvent: P2PClaimEvent = JSON.parse(raw.message);
            if (parsedEvent && (parsedEvent.token === token || parsedEvent.action)) {
              onClaim(parsedEvent);
            }
          }
        } catch {
          // Non-JSON or keep-alive message, ignore
        }
      };

      eventSource.onerror = () => {
        // EventSource will automatically attempt reconnection if network drops
      };
    } catch (err) {
      console.warn('P2P EventSource initialization warning:', err);
    }

    return () => {
      isClosed = true;
      if (eventSource) {
        try {
          eventSource.close();
        } catch {
          // ignore
        }
      }
    };
  }

  /**
   * Broadcast a claim / transfer notification to the presenter's device
   * @param event The claim event payload
   */
  public static async broadcastClaim(event: P2PClaimEvent): Promise<boolean> {
    if (!event.token) return false;

    const topic = this.sanitizeTopic(event.token);
    try {
      const response = await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Title: 'Kupon P2P Claim',
        },
        body: JSON.stringify(event),
      });

      return response.ok;
    } catch (err) {
      console.warn('P2P Broadcast claim warning (device may be offline):', err);
      return false;
    }
  }
}
