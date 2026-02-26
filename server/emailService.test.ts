import { describe, it, expect } from 'vitest';
import { sendRoadmapEmail } from './emailService';
import { ENV } from './_core/env';

describe('Email Service', () => {
  it('should have Resend API key configured', () => {
    expect(ENV.resendApiKey).toBeTruthy();
    expect(ENV.resendApiKey).toMatch(/^re_/);
  });

  it('should send test email successfully', async () => {
    // Send test email to verify API key works
    const result = await sendRoadmapEmail({
      to: 'skool@doctablade.com', // Resend test mode allows sending to verified email
      businessName: 'Test Business',
      dashboardUrl: 'https://example.com/dashboard/123',
      roadmapId: 123,
    });

    expect(result).toBe(true);
  }, 15000); // 15s timeout for email API
});
