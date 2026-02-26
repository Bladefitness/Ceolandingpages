import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Roadmap Generation Flow", () => {
  it("should generate roadmap and retrieve it by ID", async () => {
    const caller = appRouter.createCaller({ user: null });

    // Test data matching the optimized quiz structure
    const quizData = {
      firstName: "Test",
      businessName: "Test Med Spa",
      businessType: "Med Spa",
      email: "test@example.com",
      monthlyRevenue: "$20K-$50K",
      mainOffer: "Botox treatments ($500) - premium products",
      crmUsage: "No (manual tracking)",
      leadResponseSpeed: "Within 24 hours",
      missedLeads: "25-50%",
      chatAgents: "No (no chat at all)",
      contentFrequency: "1-2x/week",
      audienceSize: "2K-5K",
      instagramHandle: "@testmedspa",
      monthlyAdBudget: "$1K-$3K",
      ninetyDayGoal: "Hit $50K/month",
      biggestFrustration: "Not enough leads coming in",
      phone: "555-1234",
      selectedPlaybooks: "Offer Optimization,Facebook Ads Strategy",
      website: "https://test.com",
    };

    // Generate roadmap
    const result = await caller.roadmap.generate(quizData);

    // Verify roadmap was created
    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result.titanRoadmap).toBeTypeOf("string");
    expect(result.titanRoadmap.length).toBeGreaterThan(100);

    // Retrieve roadmap by ID
    const retrieved = await caller.roadmap.getRoadmap({ id: result.id });

    // Verify retrieved data matches
    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(result.id);
    expect(retrieved.businessName).toBe(quizData.businessName);
    expect(retrieved.email).toBe(quizData.email);
    expect(retrieved.titanRoadmap).toBe(result.titanRoadmap);
  }, 60000); // 60 second timeout for LLM generation

  it("should throw error for non-existent roadmap ID", async () => {
    const caller = appRouter.createCaller({ user: null });

    await expect(
      caller.roadmap.getRoadmap({ id: 999999 })
    ).rejects.toThrow("Roadmap not found");
  });
});
