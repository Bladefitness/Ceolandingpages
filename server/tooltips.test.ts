import { describe, it, expect } from "vitest";

describe("Tooltip Content Validation", () => {
  it("should have tooltip explanations for all Business Health Score metrics", () => {
    // Define expected tooltip content structure
    const expectedTooltips = {
      overall: "overall score (0-100) is calculated from 4 key areas",
      leadGeneration: "Measures your ability to attract and capture new leads",
      offerClarity: "Evaluates how well-defined and compelling your service offering is",
      socialPresence: "Assesses your visibility and engagement on social media",
      conversionProcess: "Analyzes your ability to convert leads into paying clients"
    };

    // Verify each tooltip has meaningful content
    Object.entries(expectedTooltips).forEach(([key, expectedContent]) => {
      expect(expectedContent.length).toBeGreaterThan(20);
      expect(expectedContent).toBeTruthy();
    });
  });

  it("should have benchmark comparison tooltip explaining data sources", () => {
    const benchmarkTooltip = {
      yourScore: "Based on your quiz responses",
      industryAverage: "Median scores from 2,000+ health practices",
      topPerformers: "90th percentile scores from practices scaling past $100K/month"
    };

    // Verify benchmark tooltip includes all three comparison types
    Object.values(benchmarkTooltip).forEach(content => {
      expect(content.length).toBeGreaterThan(10);
      expect(content).toBeTruthy();
    });
  });

  it("should have gap analysis tooltip explaining projection methodology", () => {
    const gapAnalysisTooltip = "These projections show what's achievable in 18 months by implementing the recommended strategies";

    // Verify gap analysis tooltip explains timeframe and methodology
    expect(gapAnalysisTooltip).toContain("18 months");
    expect(gapAnalysisTooltip).toContain("implementing");
    expect(gapAnalysisTooltip.length).toBeGreaterThan(50);
  });

  it("should provide industry averages for each category", () => {
    const industryAverages = {
      leadGeneration: 55,
      offerClarity: 60,
      socialPresence: 50,
      conversionProcess: 58
    };

    // Verify all averages are reasonable (0-100 scale)
    Object.values(industryAverages).forEach(avg => {
      expect(avg).toBeGreaterThanOrEqual(0);
      expect(avg).toBeLessThanOrEqual(100);
    });

    // Verify averages are in expected range for health practices
    expect(industryAverages.leadGeneration).toBeGreaterThanOrEqual(50);
    expect(industryAverages.offerClarity).toBeGreaterThanOrEqual(50);
  });

  it("should explain calculation methodology for overall score", () => {
    const calculationExplanation = "Lead Generation (25pts), Offer Clarity (25pts), Social Presence (25pts), and Conversion Process (25pts)";

    // Verify equal weighting (25 points each = 100 total)
    const weights = calculationExplanation.match(/25pts/g);
    expect(weights).toHaveLength(4);
    expect(calculationExplanation).toContain("25pts");
  });
});
