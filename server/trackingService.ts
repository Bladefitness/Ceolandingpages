import { createHash } from "crypto";
import { logger } from "./_core/logger";
import { getDb } from "./db";
import { trackingPixels } from "../drizzle/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export interface CapiEventData {
  eventName: string;
  email?: string;
  phone?: string;
  firstName?: string;
  value?: number;
  currency?: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Fire a Facebook Conversions API event for a given pixel.
 * Hashes PII fields (email, phone, first name) before sending.
 * Returns true on success, false on failure.
 */
export async function fireFacebookCapi(
  pixelId: string,
  accessToken: string,
  eventData: CapiEventData
): Promise<boolean> {
  const url = `https://graph.facebook.com/v20.0/${pixelId}/events`;

  try {
    const user_data: Record<string, string> = {};
    if (eventData.email) user_data.em = sha256(eventData.email);
    if (eventData.phone) user_data.ph = sha256(eventData.phone);
    if (eventData.firstName) user_data.fn = sha256(eventData.firstName);

    const custom_data: Record<string, string | number> = {
      currency: eventData.currency ?? "USD",
    };
    if (eventData.value !== undefined) custom_data.value = eventData.value;

    const body = {
      data: [
        {
          event_name: eventData.eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data,
          custom_data,
        },
      ],
      access_token: accessToken,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      logger.warn(
        { status: response.status, detail, pixelId, eventName: eventData.eventName },
        "Facebook CAPI returned non-OK status"
      );
      return false;
    }

    logger.info(
      { pixelId, eventName: eventData.eventName },
      "Facebook CAPI event fired successfully"
    );
    return true;
  } catch (error) {
    logger.error({ err: error, pixelId, eventName: eventData.eventName }, "Failed to fire Facebook CAPI event");
    return false;
  }
}

/**
 * Query active Facebook pixels that have an accessToken and are scoped to the given page.
 * pageScope is a JSON string[] stored in the DB; null means the pixel applies to all pages.
 */
export async function getCapiPixelsForPage(
  pageSlug: string
): Promise<Array<{ pixelId: string; accessToken: string }>> {
  const db = await getDb();
  if (!db) {
    logger.warn("Cannot query tracking pixels: database not available");
    return [];
  }

  try {
    const rows = await db
      .select({
        pixelId: trackingPixels.pixelId,
        accessToken: trackingPixels.accessToken,
        pageScope: trackingPixels.pageScope,
      })
      .from(trackingPixels)
      .where(
        and(
          eq(trackingPixels.platform, "facebook"),
          eq(trackingPixels.isActive, 1),
          isNotNull(trackingPixels.accessToken)
        )
      );

    return rows
      .filter((row) => {
        if (!row.accessToken) return false;
        if (row.pageScope === null) return true;
        try {
          const pages = JSON.parse(row.pageScope) as string[];
          return Array.isArray(pages) && pages.includes(pageSlug);
        } catch {
          return false;
        }
      })
      .map((row) => ({
        pixelId: row.pixelId,
        accessToken: row.accessToken as string,
      }));
  } catch (error) {
    logger.error({ err: error }, "Failed to query Facebook CAPI pixels");
    return [];
  }
}
