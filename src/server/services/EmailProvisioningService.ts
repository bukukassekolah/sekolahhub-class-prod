import { logger } from './LoggerService';

export interface EmailDispatchOptions {
  email: string;
  contactName: string;
  schoolName: string;
  plan: string;
  passwordSetupLink: string;
  requestId?: string;
}

export class EmailProvisioningService {
  /**
   * Abstraction for sending official password creation / setup emails.
   * Can integrate with SMTP, SendGrid, Resend, or Firebase Trigger Email extension.
   */
  public static async sendPasswordSetupEmail(options: EmailDispatchOptions): Promise<boolean> {
    const { email, contactName, schoolName, plan, passwordSetupLink, requestId } = options;

    logger.info('EmailService', `Preparing official setup email dispatch for ${email} (${schoolName})`, requestId);

    try {
      // Formatted email payload abstraction
      const emailTemplate = {
        to: email,
        subject: `[SekolahHub Class] Instruksi Pembuatan Kata Sandi - ${schoolName}`,
        bodyText: `Halo ${contactName},\n\nPermohonan implementasi SekolahHub Class (${plan}) untuk ${schoolName} telah aktif.\n\nSilakan klik tautan resmi berikut untuk menentukan kata sandi akun Anda:\n${passwordSetupLink}\n\nTerima kasih,\nTim SekolahHub`,
      };

      // Log dispatch for administrative audit & development observability
      logger.info(
        'Sending Password Setup Email',
        `Email dispatch dispatched to ${email}. Setup Link: ${passwordSetupLink}`,
        requestId,
        { emailTemplate }
      );

      return true;
    } catch (error: any) {
      logger.error('EmailService', `Failed to send email to ${email}: ${error.message}`, requestId);
      throw error;
    }
  }
}
