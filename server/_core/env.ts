export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFromName: process.env.EMAIL_FROM_NAME ?? "CEO Scaling Roadmap",
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS ?? "noreply@updates.doctorleadflow.com",
  ghlWebhookUrl: process.env.GHL_WEBHOOK_URL ?? "",
};

// Validate critical env vars at startup in production
if (ENV.isProduction) {
  const missing: string[] = [];
  if (!ENV.databaseUrl) missing.push("DATABASE_URL");
  if (!ENV.cookieSecret) missing.push("JWT_SECRET");
  if (!ENV.forgeApiKey) missing.push("BUILT_IN_FORGE_API_KEY or OPENAI_API_KEY");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. See .env.example for details.`
    );
  }
}
