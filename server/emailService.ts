import { Resend } from 'resend';
import { ENV } from './_core/env';
import { logger } from "./_core/logger";

const resend = new Resend(ENV.resendApiKey);

interface SendRoadmapEmailParams {
  to: string;
  businessName: string;
  dashboardUrl: string;
  roadmapId: number;
}

export async function sendRoadmapEmail({
  to,
  businessName,
  dashboardUrl,
  roadmapId,
}: SendRoadmapEmailParams): Promise<boolean> {
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await resend.emails.send({
      from: `${ENV.emailFromName} <${ENV.emailFromAddress}>`,
      replyTo: 'support@doctorleadflow.com',
      to: [to],
      subject: `${businessName} - Your Scaling Roadmap is Ready`,
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@doctorleadflow.com?subject=Unsubscribe%20${encodeURIComponent(to)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Entity-Ref-ID': `roadmap-${roadmapId}-${Date.now()}`,
        'Precedence': 'bulk',
      },
      text: [
        `Hi ${businessName} team,`,
        ``,
        `Your personalized scaling roadmap has been generated based on your assessment.`,
        ``,
        `What's inside:`,
        `- Your Business Health Score breakdown`,
        `- Personalized action plan`,
        `- Growth potential projections`,
        `- Week-by-week implementation roadmap`,
        `- Critical warnings to avoid common mistakes`,
        ``,
        `View Your Roadmap: ${dashboardUrl}`,
        `Download PDF Report: ${dashboardUrl}?download=pdf`,
        ``,
        `Pro tip: Bookmark this link or share it with your team.`,
        ``,
        `Join 200+ Health Pros in our free community:`,
        `https://www.skool.com/10ksidehustle`,
        ``,
        `Questions? Reply to this email and we will help.`,
        ``,
        `Doctor Lead Flow LLC - Helping health professionals scale`,
        `To unsubscribe, reply with "Unsubscribe" in the subject line.`,
      ].join('\n'),
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2937; background: #F3F4F6; max-width: 600px; margin: 0 auto; padding: 20px;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <tr><td style="padding: 40px 30px;">
                <p style="font-size: 36px; margin: 0 0 16px 0;">&#127919;</p>
                <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #111827;">Your Roadmap is Ready!</h1>
                <p style="margin: 0; font-size: 14px; color: #6B7280;">Health Pro CEO Scaling System</p>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; margin-bottom: 20px;">
              <tr><td style="padding: 32px;">
                <p style="color: #374151; margin: 0 0 16px 0; font-size: 15px;">Hi ${businessName} team,</p>

                <p style="color: #374151; margin: 0 0 16px 0; font-size: 15px;">Your personalized scaling roadmap has been generated based on your assessment. Here is what is inside:</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Your Business Health Score breakdown</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Personalized action plan</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Growth potential projections</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Week-by-week implementation roadmap</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Critical warnings to avoid common mistakes</td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding: 24px 0 12px 0;">
                    <a href="${dashboardUrl}" style="display: inline-block; background: #0EA5E9; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View Your Roadmap
                    </a>
                  </td></tr>
                  <tr><td align="center" style="padding: 0 0 16px 0;">
                    <a href="${dashboardUrl}?download=pdf" style="display: inline-block; color: #0EA5E9; padding: 10px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid #0EA5E9;">
                      Download PDF Report
                    </a>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="background: #EFF6FF; border-left: 3px solid #0EA5E9; border-radius: 6px; margin-top: 24px;">
                  <tr><td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #1E40AF;"><strong style="color: #0EA5E9;">Pro tip:</strong> Bookmark this link or share it with your team. You can access your roadmap anytime.</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="background: #F0FDF4; border: 2px solid #10B981; border-radius: 8px; margin: 24px 0; text-align: center;">
                  <tr><td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; color: #065F46; font-size: 18px; font-weight: 700;">Join 200+ Health Pros</p>
                    <p style="margin: 0 0 16px 0; color: #047857; font-size: 14px;">Get weekly coaching, tips and tricks in our free community</p>
                    <a href="https://www.skool.com/10ksidehustle" style="display: inline-block; background: #10B981; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                      Join Free Community
                    </a>
                  </td></tr>
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; background: white; border-radius: 12px;">
              <tr><td style="padding: 20px;">
                <p style="margin: 0 0 12px 0; color: #6B7280; font-size: 14px;">Questions? Reply to this email and we will help.</p>
                <p style="margin: 0 0 16px 0; font-size: 14px;">
                  <a href="${dashboardUrl}" style="color: #0EA5E9; text-decoration: none;">View Dashboard</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                  Doctor Lead Flow LLC - Helping health professionals scale<br/>
                  <a href="mailto:support@doctorleadflow.com?subject=Unsubscribe&body=Please%20unsubscribe%20${encodeURIComponent(to)}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe</a>
                </p>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    });

      if (error) {
        lastError = error;
        logger.error({ err: error, attempt, maxRetries }, "Email send attempt failed");
        
        // Wait before retry (exponential backoff: 1s, 2s, 4s)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
          continue;
        }
      } else {
        logger.info({ to, roadmapId, attempt }, "Email sent successfully");
        return true;
      }
    } catch (error) {
      lastError = error;
      logger.error({ err: error, attempt, maxRetries }, "Email send exception");
      
      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        continue;
      }
    }
  }

  // All retries failed
  logger.error({ err: lastError, to, maxRetries }, "All email attempts failed");
  return false;
}
