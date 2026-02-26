import { ENV } from "./_core/env";
import { logger } from "./_core/logger";

interface GHLLeadPayload {
  // Contact info
  firstName: string;
  email: string;
  phone?: string;
  businessName: string;
  website?: string;

  // Quiz data
  businessType: string;
  industry?: string;
  monthlyRevenue: string;
  biggestFrustration: string;
  ninetyDayGoal: string;

  // Scores
  overallScore: number;
  leadScore: number;

  // Roadmap link
  dashboardUrl: string;
  roadmapId: number;

  // Diagnostic
  topStrength: string;
  biggestGap: string;
}

/**
 * Push a new lead into GoHighLevel via webhook.
 * Fires async after quiz submission - does not block the user response.
 * Maps fields to GHL custom contact fields.
 */
export async function pushLeadToGHL(payload: GHLLeadPayload): Promise<boolean> {
  if (!ENV.ghlWebhookUrl) {
    logger.debug("GHL webhook not configured, skipping");
    return false;
  }

  try {
    const body = {
      // Standard GHL contact fields
      first_name: payload.firstName,
      email: payload.email,
      phone: payload.phone || "",
      company_name: payload.businessName,
      website: payload.website || "",

      // Custom fields (mapped by key name - configure in GHL to match)
      business_type: payload.businessType,
      industry: payload.industry || "",
      monthly_revenue: payload.monthlyRevenue,
      biggest_frustration: payload.biggestFrustration,
      ninety_day_goal: payload.ninetyDayGoal,
      overall_score: String(payload.overallScore),
      lead_score: String(payload.leadScore),
      top_strength: payload.topStrength,
      biggest_gap: payload.biggestGap,
      dashboard_url: payload.dashboardUrl,
      roadmap_id: String(payload.roadmapId),

      // Tags for GHL automation triggers
      tags: ["titan-quiz-lead", `score-${payload.leadScore >= 70 ? "hot" : payload.leadScore >= 40 ? "warm" : "cold"}`].join(","),
      source: "Titan Dashboard Quiz",
    };

    const response = await fetch(ENV.ghlWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      logger.warn(
        { status: response.status, detail },
        "GHL webhook returned non-OK status"
      );
      return false;
    }

    logger.info(
      { email: payload.email, leadScore: payload.leadScore },
      "Lead pushed to GHL successfully"
    );
    return true;
  } catch (error) {
    logger.error({ err: error }, "Failed to push lead to GHL");
    return false;
  }
}
