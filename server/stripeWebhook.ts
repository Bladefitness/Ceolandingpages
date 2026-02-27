import type { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { getStripe } from "./stripe";
import { getDb } from "./db";
import { funnelOrderItems, funnelOrders } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { logger } from "./_core/logger";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig || !ENV.stripeWebhookSecret) {
    res.status(400).json({ error: "Missing signature or webhook secret" });
    return;
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body as Buffer,
      sig,
      ENV.stripeWebhookSecret,
    );
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const db = await getDb();
  if (!db) {
    res.status(500).json({ error: "Database unavailable" });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        await db
          .update(funnelOrderItems)
          .set({ status: "paid" })
          .where(eq(funnelOrderItems.stripePaymentIntentId, pi.id));

        // Update order total
        const items = await db
          .select()
          .from(funnelOrderItems)
          .where(
            and(
              eq(funnelOrderItems.stripePaymentIntentId, pi.id),
            ),
          );

        if (items.length > 0) {
          const orderId = items[0].orderId;
          const allItems = await db
            .select()
            .from(funnelOrderItems)
            .where(eq(funnelOrderItems.orderId, orderId));

          const total = allItems
            .filter((i) => i.status === "paid")
            .reduce((sum, i) => sum + i.amountInCents, 0);

          await db
            .update(funnelOrders)
            .set({ totalInCents: total, status: "completed" })
            .where(eq(funnelOrders.id, orderId));
        }

        logger.info({ paymentIntentId: pi.id }, "Payment succeeded via webhook");
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        await db
          .update(funnelOrderItems)
          .set({ status: "failed" })
          .where(eq(funnelOrderItems.stripePaymentIntentId, pi.id));

        logger.warn({ paymentIntentId: pi.id }, "Payment failed via webhook");
        break;
      }

      default:
        logger.debug({ type: event.type }, "Unhandled Stripe event type");
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err, eventType: event.type }, "Error processing Stripe webhook");
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
