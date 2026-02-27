import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { getWhop } from "./whop";
import { getDb } from "./db";
import { funnelOrderItems, funnelOrders } from "../drizzle/schema";
import { logger } from "./_core/logger";

export async function handleWhopWebhook(req: Request, res: Response) {
  const whop = getWhop();

  let webhookData;
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const headers = Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v ?? ""])
    );
    webhookData = whop.webhooks.unwrap(body, { headers } as any);
  } catch (err) {
    logger.error({ err }, "Whop webhook verification failed");
    res.status(400).json({ error: "Invalid webhook" });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.status(500).json({ error: "Database unavailable" });
    return;
  }

  try {
    switch (webhookData.type) {
      case "payment.succeeded": {
        const payment = webhookData.data;
        // Update order item by whop payment ID
        await db
          .update(funnelOrderItems)
          .set({ status: "paid" })
          .where(eq(funnelOrderItems.stripePaymentIntentId, payment.id));

        logger.info({ paymentId: payment.id }, "Whop payment succeeded via webhook");
        break;
      }

      case "payment.failed": {
        const payment = webhookData.data;
        await db
          .update(funnelOrderItems)
          .set({ status: "failed" })
          .where(eq(funnelOrderItems.stripePaymentIntentId, payment.id));

        logger.warn({ paymentId: payment.id }, "Whop payment failed via webhook");
        break;
      }

      default:
        logger.debug({ type: webhookData.type }, "Unhandled Whop webhook event");
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err, type: webhookData.type }, "Error processing Whop webhook");
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
