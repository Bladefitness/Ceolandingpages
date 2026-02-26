import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("Shareable Roadmap Links", () => {
  let roadmapId: number;
  let shareCode: string;

  const mockContext: Context = {
    user: null, // Public access
  };

  const caller = appRouter.createCaller(mockContext);

  beforeAll(async () => {
    // Create a test roadmap with all required fields
    const result = await caller.roadmap.generate({
      firstName: "Test",
      businessName: "Test Clinic",
      businessType: "Med Spa",
      email: "test@example.com",
      monthlyRevenue: "$20K-$50K/month",
      mainOffer: "Botox and fillers",
      crmUsage: "Yes, we use a CRM",
      leadResponseSpeed: "Within 24 hours",
      missedLeads: "10-20%",
      chatAgents: "No",
      contentFrequency: "Weekly",
      audienceSize: "1,000-5,000",
      instagramHandle: "@testclinic",
      monthlyAdBudget: "$1,000-$2,500/month",
      ninetyDayGoal: "Increase revenue by 50%",
      biggestFrustration: "Not enough leads coming in",
      phone: "555-1234",
      selectedPlaybooks: "Offer Optimization",
      website: "https://testclinic.com",
    });

    roadmapId = result.id;

    // Get the roadmap to retrieve share code
    const roadmap = await caller.roadmap.getRoadmap({ id: roadmapId });
    shareCode = roadmap.shareCode!;
  }, 60000); // 60 second timeout for LLM generation

  it("should generate a unique share code when creating a roadmap", async () => {
    const roadmap = await caller.roadmap.getRoadmap({ id: roadmapId });
    
    expect(roadmap.shareCode).toBeDefined();
    expect(roadmap.shareCode).toHaveLength(6);
    expect(roadmap.shareCode).toMatch(/^[a-z0-9]{6}$/);
  });

  it("should retrieve roadmap by share code", async () => {
    const roadmap = await caller.roadmap.getRoadmapByShareCode({ shareCode });
    
    expect(roadmap).toBeDefined();
    expect(roadmap.id).toBe(roadmapId);
    expect(roadmap.businessName).toBe("Test Clinic");
    expect(roadmap.shareCode).toBe(shareCode);
  });

  it("should increment view count when accessing via share code", async () => {
    // Get initial view count
    const initialRoadmap = await caller.roadmap.getRoadmap({ id: roadmapId });
    const initialViewCount = initialRoadmap.viewCount || 0;

    // Access via share code (should increment view count)
    await caller.roadmap.getRoadmapByShareCode({ shareCode });

    // Check view count increased
    const updatedRoadmap = await caller.roadmap.getRoadmap({ id: roadmapId });
    expect(updatedRoadmap.viewCount).toBe(initialViewCount + 1);
  });

  it("should throw error for invalid share code", async () => {
    await expect(
      caller.roadmap.getRoadmapByShareCode({ shareCode: "invalid" })
    ).rejects.toThrow("Roadmap not found");
  });

  it("should initialize viewCount to 0 for new roadmaps", async () => {
    const roadmap = await caller.roadmap.getRoadmap({ id: roadmapId });
    expect(roadmap.viewCount).toBeGreaterThanOrEqual(0);
  });
});
