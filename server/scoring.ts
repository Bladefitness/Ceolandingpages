/**
 * Business Health Scoring System
 * 
 * Calculates 4 category scores (0-100) based on quiz answers:
 * 1. Lead Generation (0-100)
 * 2. Offer Clarity (0-100)
 * 3. Social Presence (0-100)
 * 4. Conversion Process (0-100)
 * 
 * Overall Health Score = Average of 4 categories
 */

export interface BusinessHealthScore {
  overall: number; // 0-100
  leadGeneration: number; // 0-100
  offerClarity: number; // 0-100
  socialPresence: number; // 0-100
  conversionProcess: number; // 0-100
  topStrength: string; // Category name
  biggestGap: string; // Category name
}

export interface BenchmarkData {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPerformers: number;
}

export function calculateBusinessHealthScore(quizData: Record<string, string>): BusinessHealthScore {
  // 1. LEAD GENERATION SCORE (0-100)
  let leadGenScore = 0;
  
  // CRM Usage (0-30 points)
  const crmUsage = quizData.crmUsage || "";
  if (crmUsage.includes("use it daily")) leadGenScore += 30;
  else if (crmUsage.includes("barely touch it")) leadGenScore += 15;
  else if (crmUsage.includes("manual tracking")) leadGenScore += 10;
  else leadGenScore += 0; // No tracking
  
  // Lead Response Speed (0-35 points)
  const responseSpeed = quizData.leadResponseSpeed || "";
  if (responseSpeed.includes("5 minutes")) leadGenScore += 35;
  else if (responseSpeed.includes("1 hour")) leadGenScore += 25;
  else if (responseSpeed.includes("24 hours")) leadGenScore += 10;
  else leadGenScore += 0; // Whenever I can
  
  // Missed Leads (0-20 points - inverted, fewer missed = higher score)
  const missedLeads = quizData.missedLeads || "";
  if (missedLeads.includes("0-10%")) leadGenScore += 20;
  else if (missedLeads.includes("10-25%")) leadGenScore += 15;
  else if (missedLeads.includes("25-50%")) leadGenScore += 5;
  else leadGenScore += 0; // 50%+ or don't know
  
  // Chat Agents (0-15 points)
  const chatAgents = quizData.chatAgents || "";
  if (chatAgents.includes("website + social")) leadGenScore += 15;
  else if (chatAgents.includes("website only")) leadGenScore += 10;
  else if (chatAgents.includes("manual responses")) leadGenScore += 5;
  else leadGenScore += 0; // No chat
  
  // 2. OFFER CLARITY SCORE (0-100)
  let offerScore = 0;
  
  // Offer Confidence (0-50 points) - PRIMARY SIGNAL
  const offerConfidence = quizData.offerConfidence || "";
  if (offerConfidence.includes("Very confident") || offerConfidence.includes("100%")) {
    offerScore += 50; // User is very confident
  } else if (offerConfidence.includes("Somewhat confident")) {
    offerScore += 30; // Some confidence
  } else {
    offerScore += 10; // Not confident
  }
  
  // Main Offer Description Quality (0-30 points)
  const mainOffer = quizData.mainOffer || "";
  if (mainOffer.length > 50 && mainOffer.includes("$")) {
    offerScore += 30; // Detailed with pricing
  } else if (mainOffer.length > 30) {
    offerScore += 20; // Some detail
  } else if (mainOffer.length > 10) {
    offerScore += 10; // Basic
  } else {
    offerScore += 0; // Vague or empty
  }
  
  // Revenue Level (0-20 points - higher revenue suggests clearer offer)
  const revenue = quizData.monthlyRevenue || "";
  if (revenue.includes("$100K+")) offerScore += 20;
  else if (revenue.includes("$50K-$100K")) offerScore += 15;
  else if (revenue.includes("$20K-$50K")) offerScore += 10;
  else if (revenue.includes("$5K-$20K")) offerScore += 5;
  else offerScore += 0;
  
  // 3. SOCIAL PRESENCE SCORE (0-100)
  let socialScore = 0;
  
  // Content Frequency (0-40 points)
  const contentFreq = quizData.contentFrequency || "";
  if (contentFreq.includes("Daily")) socialScore += 40;
  else if (contentFreq.includes("3-5x/week")) socialScore += 35;
  else if (contentFreq.includes("1-2x/week")) socialScore += 20;
  else if (contentFreq.includes("Rarely")) socialScore += 5;
  else socialScore += 0; // Never
  
  // Audience Size (0-40 points)
  const audienceSize = quizData.audienceSize || "";
  if (audienceSize.includes("25K+")) socialScore += 40;
  else if (audienceSize.includes("10K-25K")) socialScore += 35;
  else if (audienceSize.includes("5K-10K")) socialScore += 25;
  else if (audienceSize.includes("2K-5K")) socialScore += 15;
  else if (audienceSize.includes("500-2K")) socialScore += 10;
  else socialScore += 5; // 0-500
  
  // Instagram Handle Provided (0-20 points)
  const instagramHandle = quizData.instagramHandle || "";
  if (instagramHandle.length > 3) socialScore += 20;
  
  // 4. CONVERSION PROCESS SCORE (0-100)
  let conversionScore = 0;
  
  // Ad Budget (0-50 points - willingness to invest)
  const adBudget = quizData.monthlyAdBudget || "";
  if (adBudget.includes("$5K+")) conversionScore += 50;
  else if (adBudget.includes("$3K-$5K")) conversionScore += 40;
  else if (adBudget.includes("$1K-$3K")) conversionScore += 30;
  else if (adBudget.includes("$500-$1K")) conversionScore += 15;
  else conversionScore += 0; // Organic only
  
  // 90-Day Goal Clarity (0-30 points)
  const goal = quizData.ninetyDayGoal || "";
  if (goal.length > 20 && (goal.includes("$") || goal.includes("K"))) {
    conversionScore += 30; // Specific revenue goal
  } else if (goal.length > 10) {
    conversionScore += 15; // Some goal
  } else {
    conversionScore += 0; // Vague or empty
  }
  
  // Website Provided (0-20 points)
  const website = quizData.website || "";
  if (website.length > 5) conversionScore += 20;
  
  // OVERALL SCORE
  const overall = Math.round((leadGenScore + offerScore + socialScore + conversionScore) / 4);
  
  // IDENTIFY TOP STRENGTH & BIGGEST GAP
  const scores = [
    { name: "Lead Generation", score: leadGenScore },
    { name: "Offer Clarity", score: offerScore },
    { name: "Social Presence", score: socialScore },
    { name: "Conversion Process", score: conversionScore },
  ];
  
  const sortedByScore = [...scores].sort((a, b) => b.score - a.score);
  const topStrength = sortedByScore[0].name;
  const biggestGap = sortedByScore[sortedByScore.length - 1].name;
  
  return {
    overall,
    leadGeneration: leadGenScore,
    offerClarity: offerScore,
    socialPresence: socialScore,
    conversionProcess: conversionScore,
    topStrength,
    biggestGap,
  };
}

export function getBenchmarkData(scores: BusinessHealthScore): BenchmarkData[] {
  return [
    {
      category: "Lead Generation",
      yourScore: scores.leadGeneration,
      industryAverage: 55,
      topPerformers: 85,
    },
    {
      category: "Offer Clarity",
      yourScore: scores.offerClarity,
      industryAverage: 60,
      topPerformers: 90,
    },
    {
      category: "Social Presence",
      yourScore: scores.socialPresence,
      industryAverage: 45,
      topPerformers: 80,
    },
    {
      category: "Conversion Process",
      yourScore: scores.conversionProcess,
      industryAverage: 50,
      topPerformers: 85,
    },
  ];
}

export function getGapAnalysis(quizData: Record<string, string>, scores: BusinessHealthScore) {
  const revenue = quizData.monthlyRevenue || "";
  const currentRevenue = revenue.includes("$100K+") ? "$100K+" :
                        revenue.includes("$50K-$100K") ? "$50K-$100K" :
                        revenue.includes("$20K-$50K") ? "$20K-$50K" :
                        revenue.includes("$5K-$20K") ? "$5K-$20K" : "$0-$5K";
  
  // Estimate potential based on scores
  const potentialMultiplier = scores.overall >= 70 ? 2.5 : scores.overall >= 50 ? 2.0 : 1.5;
  
  return {
    currentRevenue,
    currentLeads: estimateLeads(currentRevenue),
    currentCloseRate: estimateCloseRate(scores.conversionProcess),
    potentialRevenue: projectRevenue(currentRevenue, potentialMultiplier),
    potentialLeads: estimateLeads(currentRevenue) * potentialMultiplier,
    potentialCloseRate: Math.min(estimateCloseRate(scores.conversionProcess) + 15, 40),
  };
}

function estimateLeads(revenue: string): number {
  if (revenue.includes("$100K+")) return 50;
  if (revenue.includes("$50K-$100K")) return 35;
  if (revenue.includes("$20K-$50K")) return 20;
  if (revenue.includes("$5K-$20K")) return 10;
  return 5;
}

function estimateCloseRate(conversionScore: number): number {
  if (conversionScore >= 70) return 35;
  if (conversionScore >= 50) return 25;
  if (conversionScore >= 30) return 18;
  return 12;
}

function projectRevenue(current: string, multiplier: number): string {
  // Ensure potential is always higher than current
  if (current.includes("$100K+")) return "$200K-$300K";
  if (current.includes("$50K-$100K")) return "$125K-$200K";
  if (current.includes("$20K-$50K")) return "$60K-$100K";
  if (current.includes("$5K-$20K")) return "$30K-$50K";
  return "$10K-$20K";
}
