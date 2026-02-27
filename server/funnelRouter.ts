import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { getStripe } from "./stripe";
import { getDb } from "./db";
import {
  products,
  funnelOrders,
  funnelOrderItems,
} from "../drizzle/schema";
import { pushPurchaseToGHL } from "./ghlWebhook";
import { logger } from "./_core/logger";

export const funnelRouter = router({
  checkout: router({
    createIntent: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          firstName: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const stripe = getStripe();

        // Get the course product
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.slug, "fb-ads-course"))
          .limit(1);

        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }

        // Create or retrieve Stripe customer
        const existingCustomers = await stripe.customers.list({
          email: input.email,
          limit: 1,
        });

        const customer =
          existingCustomers.data.length > 0
            ? existingCustomers.data[0]
            : await stripe.customers.create({
                email: input.email,
                name: input.firstName,
              });

        // Create PaymentIntent with setup_future_usage for one-click upsells
        const paymentIntent = await stripe.paymentIntents.create({
          amount: product.priceInCents,
          currency: "usd",
          customer: customer.id,
          setup_future_usage: "off_session",
          metadata: {
            productSlug: "fb-ads-course",
            email: input.email,
            firstName: input.firstName,
          },
        });

        // Create order
        const orderResult = await db.insert(funnelOrders).values({
          email: input.email,
          firstName: input.firstName,
          stripeCustomerId: customer.id,
          status: "pending",
          totalInCents: 0,
        });
        const orderId = Number(orderResult[0].insertId);

        // Create order item
        await db.insert(funnelOrderItems).values({
          orderId,
          productId: product.id,
          stripePaymentIntentId: paymentIntent.id,
          amountInCents: product.priceInCents,
          status: "pending",
        });

        return {
          clientSecret: paymentIntent.client_secret!,
          orderId,
          amount: product.priceInCents,
        };
      }),

    confirmPurchase: publicProcedure
      .input(
        z.object({
          orderId: z.number(),
          paymentIntentId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const stripe = getStripe();

        // Verify the payment intent succeeded
        const pi = await stripe.paymentIntents.retrieve(input.paymentIntentId);
        if (pi.status !== "succeeded") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Payment not completed" });
        }

        // Store the payment method for one-click upsells
        const paymentMethodId =
          typeof pi.payment_method === "string" ? pi.payment_method : pi.payment_method?.id;

        if (paymentMethodId) {
          await db
            .update(funnelOrders)
            .set({
              stripePaymentMethodId: paymentMethodId,
              status: "completed",
              totalInCents: pi.amount ?? 0,
            })
            .where(eq(funnelOrders.id, input.orderId));
        }

        // Update order item status
        await db
          .update(funnelOrderItems)
          .set({ status: "paid" })
          .where(eq(funnelOrderItems.stripePaymentIntentId, input.paymentIntentId));

        // Push to GHL async
        const [order] = await db
          .select()
          .from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId))
          .limit(1);

        if (order) {
          pushPurchaseToGHL({
            firstName: order.firstName,
            email: order.email,
            tag: "fb-ads-course-buyer",
            product: "FB Ads Course",
            amount: 197,
          }).catch((err) => logger.error({ err }, "GHL push failed for course purchase"));
        }

        return { success: true };
      }),
  }),

  upsell: router({
    charge: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const stripe = getStripe();

        // Get order with stored payment method
        const [order] = await db
          .select()
          .from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId))
          .limit(1);

        if (!order?.stripeCustomerId || !order?.stripePaymentMethodId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No payment method on file" });
        }

        // Get vault product
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.slug, "ceo-vault"))
          .limit(1);

        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });

        // One-click charge using stored payment method
        const paymentIntent = await stripe.paymentIntents.create({
          amount: product.priceInCents,
          currency: "usd",
          customer: order.stripeCustomerId,
          payment_method: order.stripePaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            productSlug: "ceo-vault",
            orderId: String(input.orderId),
          },
        });

        // Create order item
        await db.insert(funnelOrderItems).values({
          orderId: input.orderId,
          productId: product.id,
          stripePaymentIntentId: paymentIntent.id,
          amountInCents: product.priceInCents,
          status: paymentIntent.status === "succeeded" ? "paid" : "pending",
        });

        // Update order total
        if (paymentIntent.status === "succeeded") {
          await db
            .update(funnelOrders)
            .set({ totalInCents: order.totalInCents + product.priceInCents })
            .where(eq(funnelOrders.id, input.orderId));

          pushPurchaseToGHL({
            firstName: order.firstName,
            email: order.email,
            tag: "vault-member",
            product: "Health Pro CEO Vault",
            amount: 997,
          }).catch((err) => logger.error({ err }, "GHL push failed for vault purchase"));
        }

        return {
          success: paymentIntent.status === "succeeded",
          paymentIntentId: paymentIntent.id,
        };
      }),
  }),

  downsell: router({
    charge: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const stripe = getStripe();

        const [order] = await db
          .select()
          .from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId))
          .limit(1);

        if (!order?.stripeCustomerId || !order?.stripePaymentMethodId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No payment method on file" });
        }

        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.slug, "strategy-session"))
          .limit(1);

        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: product.priceInCents,
          currency: "usd",
          customer: order.stripeCustomerId,
          payment_method: order.stripePaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            productSlug: "strategy-session",
            orderId: String(input.orderId),
          },
        });

        await db.insert(funnelOrderItems).values({
          orderId: input.orderId,
          productId: product.id,
          stripePaymentIntentId: paymentIntent.id,
          amountInCents: product.priceInCents,
          status: paymentIntent.status === "succeeded" ? "paid" : "pending",
        });

        if (paymentIntent.status === "succeeded") {
          await db
            .update(funnelOrders)
            .set({ totalInCents: order.totalInCents + product.priceInCents })
            .where(eq(funnelOrders.id, input.orderId));

          pushPurchaseToGHL({
            firstName: order.firstName,
            email: order.email,
            tag: "session-booked",
            product: "Strategy Session",
            amount: 297,
          }).catch((err) => logger.error({ err }, "GHL push failed for session purchase"));
        }

        return {
          success: paymentIntent.status === "succeeded",
          paymentIntentId: paymentIntent.id,
        };
      }),
  }),

  order: router({
    get: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const [order] = await db
          .select()
          .from(funnelOrders)
          .where(eq(funnelOrders.id, input.orderId))
          .limit(1);

        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });

        const items = await db
          .select({
            id: funnelOrderItems.id,
            productId: funnelOrderItems.productId,
            amountInCents: funnelOrderItems.amountInCents,
            status: funnelOrderItems.status,
            productName: products.name,
            productSlug: products.slug,
            productType: products.type,
          })
          .from(funnelOrderItems)
          .innerJoin(products, eq(funnelOrderItems.productId, products.id))
          .where(eq(funnelOrderItems.orderId, input.orderId));

        return {
          ...order,
          items,
        };
      }),
  }),
});
