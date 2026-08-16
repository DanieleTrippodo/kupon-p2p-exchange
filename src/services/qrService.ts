import { Coupon, QRPayload, RedemptionResult } from '../types/coupon';

/**
 * QR Code Service: Handles token generation, QR payload packing, and validation.
 */
export class QRService {
  private static readonly PREFIX = 'kpn_tok_';

  /**
   * Generates a unique single-use token for a coupon
   */
  public static generateToken(couponId: string): string {
    const randomEntropy = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
    return `${this.PREFIX}${couponId.slice(0, 8)}_${timestamp}_${randomEntropy}`;
  }

  /**
   * Encodes a payload for TRANSFER (Handover to a friend's wallet)
   */
  public static encodeTransferPayload(coupon: Coupon): string {
    const payload: QRPayload = {
      app: 'kupon-p2p',
      version: '1.0',
      action: 'transfer',
      couponId: coupon.id,
      token: coupon.qr_token,
      title: coupon.title,
      description: coupon.description,
      icon_name: coupon.icon_name,
      color_theme: coupon.color_theme,
      sender: coupon.sender_id || 'You',
      recipient: coupon.recipient_id || 'Friend',
      secret_message: coupon.secret_message,
      appliedStickers: coupon.appliedStickers,
      timestamp: coupon.created_at,
    };
    return JSON.stringify(payload);
  }

  /**
   * Encodes a payload for REDEMPTION (Tear & claim coupon)
   */
  public static encodeRedeemPayload(coupon: Coupon): string {
    const payload: QRPayload = {
      app: 'kupon-p2p',
      version: '1.0',
      action: 'redeem',
      couponId: coupon.id,
      token: coupon.qr_token,
      title: coupon.title,
      description: coupon.description,
      icon_name: coupon.icon_name,
      color_theme: coupon.color_theme,
      sender: coupon.sender_id,
      recipient: coupon.recipient_id,
      secret_message: coupon.secret_message,
      appliedStickers: coupon.appliedStickers,
      timestamp: coupon.created_at,
    };
    return JSON.stringify(payload);
  }

  /**
   * Legacy alias for encodeRedeemPayload
   */
  public static encodePayload(coupon: Coupon): string {
    return this.encodeRedeemPayload(coupon);
  }

  /**
   * Decodes a QR code string or raw token string into a structured payload
   */
  public static parseScannedData(rawScannedText: string): {
    action: 'transfer' | 'redeem';
    couponId?: string;
    token: string;
    fullCouponData?: Partial<Coupon>;
  } {
    const trimmed = rawScannedText.trim();

    // Check if JSON payload
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed: QRPayload = JSON.parse(trimmed);
        if (parsed.token) {
          if (parsed.action === 'transfer') {
            return {
              action: 'transfer',
              couponId: parsed.couponId,
              token: parsed.token,
              fullCouponData: {
                id: parsed.couponId,
                title: parsed.title || 'Kupon Regalo',
                description: parsed.description || '',
                icon_name: parsed.icon_name || 'redeem',
                color_theme: parsed.color_theme || 'peach',
                sender_id: parsed.sender || 'Un amico',
                recipient_id: parsed.recipient || 'You',
                secret_message: parsed.secret_message,
                appliedStickers: parsed.appliedStickers,
                qr_token: parsed.token,
                status: 'active',
                created_at: parsed.timestamp || new Date().toISOString(),
                redeemed_at: null,
              },
            };
          }

          // REDEEM ACTION
          return {
            action: 'redeem',
            couponId: parsed.couponId,
            token: parsed.token,
            fullCouponData: {
              id: parsed.couponId,
              title: parsed.title || 'Kupon',
              description: parsed.description || '',
              icon_name: parsed.icon_name || 'local_cafe',
              color_theme: parsed.color_theme || 'peach',
              sender_id: parsed.sender || 'Un amico',
              recipient_id: parsed.recipient || 'You',
              secret_message: parsed.secret_message,
              appliedStickers: parsed.appliedStickers,
              qr_token: parsed.token,
              status: 'redeemed',
              created_at: parsed.timestamp || new Date().toISOString(),
              redeemed_at: new Date().toISOString(),
            },
          };
        }
      } catch {
        // Fall back to treating as raw text
      }
    }

    return { action: 'redeem', token: trimmed };
  }

  /**
   * Validates a token against a specific coupon
   */
  public static validateCouponToken(coupon: Coupon, token: string): RedemptionResult {
    if (!coupon) {
      return {
        success: false,
        message: 'Kupon not found. Please verify the code.',
        errorCode: 'NOT_FOUND',
      };
    }

    if (coupon.status === 'redeemed') {
      return {
        success: false,
        coupon,
        message: 'This Kupon has already been redeemed and torn!',
        errorCode: 'ALREADY_REDEEMED',
      };
    }

    if (coupon.qr_token !== token && coupon.id !== token) {
      return {
        success: false,
        coupon,
        message: 'Invalid or mismatched token for this Kupon.',
        errorCode: 'INVALID_TOKEN',
      };
    }

    return {
      success: true,
      coupon,
      message: `Success! Redeemed "${coupon.title}" from ${coupon.sender_id}.`,
    };
  }
}
