import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { insertRoadmap, getRoadmapById, getAllRoadmaps, calculateLeadScore } from "./db";
import { calculateBusinessHealthScore, getBenchmarkData, getGapAnalysis } from "./scoring";
import { pushLeadToGHL } from "./ghlWebhook";
import { checkRateLimit, getRateLimitIdentifier } from "./rateLimit";
import { TRPCError } from "@trpc/server";
import { logger } from "./_core/logger";

import { nanoid } from "nanoid";

// Generate unique 8-character share code using cryptographically secure random
function generateShareCode(): string {
  return nanoid(8);
}
import {
  VISUAL_OFFER_PLAYBOOK_PROMPT,
  VISUAL_FACEBOOK_AD_PROMPT,
  VISUAL_INSTAGRAM_GROWTH_PROMPT,
  VISUAL_LEAD_GENERATION_PROMPT,
} from "./visualPlaybookPrompts";
import { constructVisualTitanRoadmapPrompt } from "./visualTitanRoadmapPrompt";

// Input schema - optimized Hormozi-style quiz structure
const generateRoadmapInputSchema = z.object({
  // Q1-Q3: Foundation
  firstName: z.string().min(1),
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  industry: z.string().optional(), // Selected from landing page
  
  // Q4: Email (early capture)
  email: z.string().email(),
  
  // Q5-Q6: Revenue & Offer
  monthlyRevenue: z.string().min(1),
  mainOffer: z.string().min(1), // Combined: offer + differentiation
  
  // Q7-Q10: Systems & Automation
  crmUsage: z.string().optional().default("Not applicable"),
  leadResponseSpeed: z.string().min(1),
  missedLeads: z.string().min(1),
  chatAgents: z.string().min(1),
  
  // Q11-Q14: Marketing & Content
  contentFrequency: z.string().min(1),
  audienceSize: z.string().min(1),
  instagramHandle: z.string().min(1),
  monthlyAdBudget: z.string().min(1),
  
  // Q15-Q16: Goals & Frustrations
  ninetyDayGoal: z.string().min(1),
  biggestFrustration: z.string().min(1),
  
  // Offer confidence
  offerConfidence: z.string().optional(),

  // Q17-Q18: Contact info
  phone: z.string().optional(),
  website: z.string().optional(),
});

// Legacy text-based prompt (replaced by constructVisualTitanRoadmapPrompt)
// Kept as reference only - not used in production
function _legacyConstructTitanRoadmapPrompt(input: z.infer<typeof generateRoadmapInputSchema>): string {
  return `
══════════════════════════════════════
TITAN PROTOCOL SCALING ROADMAP GENERATOR
Public, Playbook-Free Version (LOCKED MASTER)
══════════════════════════════════════

USER INPUT ZONE

──────────────────────────────────────
BUSINESS PROFILE

FBusiness name: ${input.businessName}
Business type: ${input.businessType}
Industry vertical: ${input.industry || 'Healthcare (general)'}
First name: ${input.firstName}
Email: ${input.email}
Website: ${input.website || "Not provided"}
Main offer and what makes them different: ${input.mainOffer}
Instagram handle: ${input.instagramHandle}
──────────────────────────────────────
QUICK DIAGNOSTIC INPUTS

Current monthly revenue: ${input.monthlyRevenue}

CRM Usage: ${input.crmUsage || "Not applicable"}
CRM Platform: Not specified

Lead response speed: ${input.leadResponseSpeed}
Chat agents/automation: ${input.chatAgents}
Estimated missed leads: ${input.missedLeads}

Content posting frequency: ${input.contentFrequency}
Total audience size: ${input.audienceSize}
Monthly ad budget: ${input.monthlyAdBudget}

──────────────────────────────────────
PRIMARY 90-DAY GOAL

${input.ninetyDayGoal}

──────────────────────────────────────
BIGGEST FRUSTRATION/ROADBLOCK

${input.biggestFrustration}

──────────────────────────────────────
END USER INPUT ZONE

If any field is left blank, infer conservatively and proceed.

══════════════════════════════════════
LOCKED SYSTEM LOGIC
Do not modify anything below this line.
══════════════════════════════════════

ROLE AND IDENTITY

You are the Titan Protocol Diagnostic Engine.

You are a senior business systems strategist who diagnoses growth bottlenecks and prescribes the correct sequence of systems to build next.

You have seen every failure pattern in service-based, coaching, agency, and expert-led businesses.

You do not motivate.
You do not brainstorm.
You do not hedge.

You diagnose and prescribe.

──────────────────────────────────────

INPUT INTERPRETATION RULES

If Quick Diagnostic Inputs conflict with self-reported problems, prioritize observable behavior over opinions or intentions.

The context may be incomplete, emotional, disorganized, or vague.

Do not ask follow-up questions.

──────────────────────────────────────

INDUSTRY-SPECIFIC CONTEXT

When the industry vertical is specified, tailor language and examples:

• IV/Wellness Clinics: Reference hydration therapy, NAD+ treatments, vitamin infusions, membership models, concierge services
• Med Spas: Reference Botox, fillers, laser treatments, body contouring, membership packages, aesthetic consultations
• Dental Practices: Reference implants, cosmetic dentistry, treatment plans, insurance vs cash-pay, patient financing
• Chiropractic: Reference adjustment packages, wellness plans, maintenance care, injury recovery protocols
• Physical Therapy: Reference treatment episodes, insurance authorizations, discharge planning, home exercise programs
• Other Healthcare: Use general healthcare service language

Use industry-appropriate terminology naturally throughout the roadmap without forcing it.

──────────────────────────────────────

YOUR OBJECTIVE

Produce a Titan Scaling Roadmap that:

• Identifies the single primary constraint
• Selects the correct Titan Phase or Phases to fix FIRST
• Translates strategy into concrete systems to build
• Tells the client exactly what to do next
• Prevents them from working on the wrong things

You must always select a primary phase.
Recommending exploration, waiting, or doing nothing is not allowed.

You are prescribing sequence, not options.

──────────────────────────────────────

THE 8 PHASES OF THE TITAN PROTOCOL

Phase 1: THE AUDIT
Clarify and strengthen the offer so it converts at a premium

Phase 2: THE FRONTLINE FORTRESS
Ensure every lead is captured and responded to immediately

Phase 3: THE CASH INJECTION
Create immediate revenue from existing leads and contacts

Phase 4: THE APPOINTMENT GRAVITY SYSTEM
Increase show rates, preparedness, and close probability

Phase 5: THE FULFILLMENT FLOW
Standardize onboarding and delivery for consistency and scale

Phase 6: THE CONTENT ENGINE
Build visibility and authority with minimal time investment

Phase 7: THE OPERATIONAL BRAIN
Document processes so the business can run without the founder

Phase 8: THE SOVEREIGN OWNER
Operate the business by metrics, not emotion or guesswork

──────────────────────────────────────

DIAGNOSTIC RULES

Use these rules to identify the REAL bottleneck.

• Revenue level outweighs opinions
• Low revenue plus ads equals a capture or follow-up problem
• No clear niche or method equals Phase 1
• Traffic sent to a homepage equals lost money
• Booked calls with low show rates equals Phase 4
• High revenue with chaos equals Phase 5 or Phase 7

Choose the most constraining problem, not the loudest complaint.

──────────────────────────────────────

OUTPUT FORMAT RULES

• Plain text only
• No tables
• No code blocks
• Simple line breaks
• Emojis for structure and scannability
• Airtable-friendly formatting
• Confident, decisive language

──────────────────────────────────────

OUTPUT STRUCTURE
USE THIS EXACT STRUCTURE

══════════════════════════════════════
🏛️ TITAN SCALING ROADMAP
${input.businessName}
══════════════════════════════════════

📸 THE SNAPSHOT

3 to 4 sentences describing the current state of the business.
Reference context and diagnostic inputs.
Make the diagnosis feel accurate and grounded.

──────────────────────────────────────

🎯 PRIMARY CONSTRAINT

State one clear constraint in direct language.

The constraint must describe a system failure, not a mindset issue, personality trait, or abstract concept.

Why this is the bottleneck:
2 to 3 sentences explaining the root cause.

What this is costing you:
→ Concrete consequence
→ Concrete consequence
→ Concrete consequence
→ Concrete consequence

──────────────────────────────────────

🔥 PHASE PRIORITY

PHASE [#]: [PHASE NAME]

Mission:
One sentence describing the objective.

Why now:
2 to 3 sentences tying this phase to revenue level, systems maturity, and lead response behavior.

Victory condition:
A clear, observable definition of what "done" looks like.

Include a second phase only if sequencing requires it.

──────────────────────────────────────

📚 EXECUTION FOCUS

1️⃣ PRIMARY BUILD

System focus:
Name the system in plain language.

What you will build:
Describe the outcome, not the method.

Key components:
• Component
• Component
• Component
• Component

What "done" looks like:
Describe observable success.

Estimated effort:
Time range in hours.

2️⃣ SECONDARY BUILD (if applicable)

Use the same structure.

──────────────────────────────────────

⚡ 72-HOUR BLITZ

These are mandatory.

☐ Action 1
Why:

☐ Action 2
Why:

☐ Action 3
Why:

──────────────────────────────────────

🚫 NOT NOW LIST

Explicitly state what to avoid.

✗ Activity → Wait until condition
✗ Activity → Wait until condition
✗ Activity → Wait until condition

──────────────────────────────────────

📈 90-DAY VISION

Day 30:
• Milestone
• Milestone

Day 60:
• Milestone
• Milestone

Day 90:
• Milestone
• Milestone

──────────────────────────────────────

🗺️ YOUR TITAN PATH

[Current Phase] → [Next Phase] → [Next Phase] → SOVEREIGN OWNER
↑
YOU ARE HERE

Estimated time to Sovereign Owner:
X months with focused execution

──────────────────────────────────────

💬 FINAL WORD

2 to 3 sentences.
Direct.
Grounded.
Certain.

End of output.
`.trim();
}

export const roadmapRouter = router({
  generate: publicProcedure
    .input(generateRoadmapInputSchema)
    .mutation(async ({ input, ctx }) => {
      // Rate limiting: 5 submissions per IP per hour
      const identifier = getRateLimitIdentifier(ctx.req);
      const rateLimit = await checkRateLimit(identifier, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
      
      if (!rateLimit.allowed) {
        const resetDate = new Date(rateLimit.resetAt);
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `Rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}.`,
        });
      }

      try {
        // Generate the Titan Scaling Roadmap using visual JSON format
        const titanPrompt = constructVisualTitanRoadmapPrompt(input);
        
        const titanResponse = await invokeLLM({
          messages: [
            {
              role: "user",
              content: titanPrompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "titan_roadmap",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  diagnosis: {
                    type: "object",
                    properties: {
                      snapshot: { type: "string" },
                      primaryConstraint: { type: "string" },
                      costOfInaction: { type: "string" },
                    },
                    required: ["snapshot", "primaryConstraint", "costOfInaction"],
                    additionalProperties: false,
                  },
                  titanPhase: {
                    type: "object",
                    properties: {
                      phase: { type: "string" },
                      mission: { type: "string" },
                      whyNow: { type: "string" },
                      victoryCondition: { type: "string" },
                    },
                    required: ["phase", "mission", "whyNow", "victoryCondition"],
                    additionalProperties: false,
                  },
                  benchmarks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        metric: { type: "string" },
                        value: { type: "string" },
                        context: { type: "string" },
                      },
                      required: ["metric", "value", "context"],
                      additionalProperties: false,
                    },
                  },
                  actionPlan: {
                    type: "object",
                    properties: {
                      primaryBuild: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          components: {
                            type: "array",
                            items: { type: "string" },
                          },
                          doneDefinition: { type: "string" },
                          estimatedEffort: { type: "string" },
                        },
                        required: ["title", "description", "components", "doneDefinition", "estimatedEffort"],
                        additionalProperties: false,
                      },
                      weeklyPlan: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            week: { type: "number" },
                            title: { type: "string" },
                            days: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  dayRange: { type: "string" },
                                  task: { type: "string" },
                                  details: {
                                    type: "array",
                                    items: { type: "string" },
                                  },
                                },
                                required: ["dayRange", "task", "details"],
                                additionalProperties: false,
                              },
                            },
                          },
                          required: ["week", "title", "days"],
                          additionalProperties: false,
                        },
                      },
                      blitz72Hours: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            task: { type: "string" },
                            why: { type: "string" },
                          },
                          required: ["task", "why"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["primaryBuild", "weeklyPlan", "blitz72Hours"],
                    additionalProperties: false,
                  },
                  warnings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["title", "reason"],
                      additionalProperties: false,
                    },
                  },
                  milestone: {
                    type: "object",
                    properties: {
                      timeframe: { type: "string" },
                      goal: { type: "string" },
                      successSignals: {
                        type: "array",
                        items: { type: "string" },
                      },
                      nextStep: { type: "string" },
                    },
                    required: ["timeframe", "goal", "successSignals", "nextStep"],
                    additionalProperties: false,
                  },
                  titanPath: {
                    type: "object",
                    properties: {
                      currentPhase: { type: "string" },
                      nextPhases: {
                        type: "array",
                        items: { type: "string" },
                      },
                      estimatedTimeToSovereign: { type: "string" },
                    },
                    required: ["currentPhase", "nextPhases", "estimatedTimeToSovereign"],
                    additionalProperties: false,
                  },
                },
                required: ["diagnosis", "titanPhase", "benchmarks", "actionPlan", "warnings", "milestone", "titanPath"],
                additionalProperties: false,
              },
            },
          },
        });

        const titanRoadmapContent = titanResponse.choices[0]?.message?.content;
        const titanRoadmap = typeof titanRoadmapContent === 'string' 
          ? titanRoadmapContent 
          : (Array.isArray(titanRoadmapContent) && titanRoadmapContent[0]?.type === 'text' 
            ? titanRoadmapContent[0].text 
            : null);

        if (!titanRoadmap) {
          throw new Error("LLM returned empty or invalid roadmap content");
        }

        // Extract primary constraint from structured response (will be used later)
        let primaryConstraint = "";
        try {
          const parsedRoadmap = JSON.parse(titanRoadmap);
          if (parsedRoadmap.diagnosis?.primaryConstraint) {
            primaryConstraint = parsedRoadmap.diagnosis.primaryConstraint;
          }
        } catch (e) {
          // If parsing fails, will use score-based gap later
          logger.info("Could not parse structured response, using score-based gap");
        }

        // Generate all 4 playbooks automatically
        logger.info({ businessName: input.businessName }, "Auto-generating all playbooks");
        
        const playbooks: Record<string, string | null> = {
          offerPlaybook: null,
          facebookAdLaunch: null,
          instagramGrowth: null,
          leadGeneration: null,
        };
        
        // Generate all 4 playbooks for everyone
        const allPlaybooks = ["offer", "facebook", "instagram", "leadgen"] as const;
        logger.info({ playbooks: allPlaybooks }, "Generating playbooks");
        
        const playbookPromises = allPlaybooks.map(async (generator) => {
          try {
            let prompt = "";
            let userInput = "";

            switch (generator) {
              case "offer":
                prompt = VISUAL_OFFER_PLAYBOOK_PROMPT;
                userInput = `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Website URL: ${input.website || "Not provided"}

Who do you help?
Target audience: Inferred from business type and main offer

What problem do you help them solve?
${input.biggestFrustration}

What result do you help them get?
${input.ninetyDayGoal}

How do you currently help them?
${input.mainOffer}

Current or intended price:
${input.mainOffer}

What feels confusing, stuck, or hard about your offer right now?
${input.biggestFrustration}

What makes you different?
${input.mainOffer}
`;
                break;

              case "facebook":
                prompt = VISUAL_FACEBOOK_AD_PROMPT;
                userInput = `
Business Name: ${input.businessName}
Owner Name: Not provided
Business Type: ${input.businessType}
Main Service or Offer: ${input.mainOffer}

Monthly ad budget: ${input.monthlyAdBudget}
Landing page URL: ${input.website || "Not provided"}

What is the offer or promotion?
${input.mainOffer}

Price point:
${input.mainOffer}

Who is this for?
Target audience: Inferred from business type and main offer

What do they want most right now?
${input.ninetyDayGoal}

What have they likely tried already that did not work?
${input.biggestFrustration}

Why are you running ads now?
To scale lead generation

What feels hardest or most confusing about getting clients?
${input.biggestFrustration}

Have you run ads before?
${input.monthlyRevenue.includes("$0") ? "No" : "Yes, with mixed results"}
`;
                break;

              case "instagram":
                prompt = VISUAL_INSTAGRAM_GROWTH_PROMPT;
                userInput = `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Website or primary link: ${input.website || "Not provided"}

Who do you help?
Target audience: Inferred from business type and main offer

What problem do you help them with?
${input.biggestFrustration}

What result do you help them get?
${input.ninetyDayGoal}

Main offer and price:
${input.mainOffer}

Method name, if any:
Not specified

Instagram handle:
${input.instagramHandle || "Not created yet"}

What feels hardest about Instagram right now?
${input.biggestFrustration}

How often do you post?
${input.contentFrequency}
`;
                break;

              case "leadgen":
                prompt = VISUAL_LEAD_GENERATION_PROMPT;
                userInput = `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Website: ${input.website || "Not provided"}

Who do you help?
Target audience: Inferred from business type and main offer

What problem do you solve?
${input.biggestFrustration}

What result do you help them get?
${input.ninetyDayGoal}

Main offer and price:
${input.mainOffer}

Current lead response speed:
${input.leadResponseSpeed}

Do you have chat agents?
${input.chatAgents}

Estimated missed leads:
${input.missedLeads}

What feels hardest about lead generation right now?
${input.biggestFrustration}
`;
                break;
            }

            const response = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: prompt
                    .replace('{businessName}', input.businessName)
                    .replace('{revenueRange}', input.monthlyRevenue)
                    .replace('{primaryFrustration}', input.biggestFrustration),
                },
                {
                  role: "user",
                  content: userInput,
                },
              ],
              response_format: { type: "json_object" },
            });

            const content = response.choices[0]?.message?.content;
            let parsedContent;
            try {
              parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
            } catch (e) {
              logger.error({ err: e, generator }, "Failed to parse playbook JSON");
              return { generator, content: null };
            }
            return {
              generator,
              content: JSON.stringify(parsedContent),
            };
          } catch (error) {
            logger.error({ err: error, generator }, "Error generating playbook");
            return { generator, content: null };
          }
        });

        const results = await Promise.all(playbookPromises);

        results.forEach((result) => {
          if (!result || !result.content) return; // Skip null/failed results
          switch (result.generator) {
            case "offer":
              playbooks.offerPlaybook = result.content;
              break;
            case "facebook":
              playbooks.facebookAdLaunch = result.content;
              break;
            case "instagram":
              playbooks.instagramGrowth = result.content;
              break;
            case "leadgen":
              playbooks.leadGeneration = result.content;
              break;
          }
        });

        // Calculate lead score
        const leadScore = calculateLeadScore({
          monthlyRevenue: input.monthlyRevenue,
          biggestFrustration: input.biggestFrustration,
          offerPlaybook: playbooks.offerPlaybook || undefined,
          facebookAdLaunch: playbooks.facebookAdLaunch || undefined,
          instagramGrowth: playbooks.instagramGrowth || undefined,
          leadGeneration: playbooks.leadGeneration || undefined,
        });

        // Generate unique share code
        const shareCode = generateShareCode();

        // Calculate business health scores
        const healthScores = calculateBusinessHealthScore(input);
        const benchmarkData = getBenchmarkData(healthScores);
        const gapAnalysis = getGapAnalysis(input, healthScores);

        // Save to database with calculated scores
        const roadmapId = await insertRoadmap({
          ...input,
          allAnswers: JSON.stringify(input), // Store all quiz answers as JSON
          titanRoadmap, // Now guaranteed to be a string
          offerPlaybook: playbooks.offerPlaybook,
          facebookAdLaunch: playbooks.facebookAdLaunch,
          instagramGrowth: playbooks.instagramGrowth,
          leadGeneration: playbooks.leadGeneration,
          leadScore,
          shareCode,
          // Save calculated scores
          overallScore: healthScores.overall,
          operationsScore: healthScores.leadGeneration, // Map to operations
          marketingScore: healthScores.socialPresence, // Map to marketing
          salesScore: healthScores.conversionProcess, // Map to sales
          systemsScore: healthScores.offerClarity, // Map to systems
          industryAverage: 65,
          topPerformerScore: 88,
          userPercentile: Math.round((healthScores.overall / 88) * 100),
          topStrength: healthScores.topStrength,
          biggestGap: primaryConstraint || healthScores.biggestGap, // Use LLM's constraint if available
          potentialRevenue: Math.round(gapAnalysis.potentialLeads * 2000), // Estimate
        });

        // Email is handled by GHL workflow (triggered by titan-quiz-lead tag)
        const baseUrl = process.env.APP_URL || 'https://quiz.healthproceo.com';
        const dashboardUrl = `${baseUrl}/dashboard/${roadmapId}`;

        // Push lead to GHL CRM pipeline (async, don't block response)
        pushLeadToGHL({
          firstName: input.firstName,
          email: input.email,
          phone: input.phone,
          businessName: input.businessName,
          website: input.website,
          businessType: input.businessType,
          industry: input.industry,
          monthlyRevenue: input.monthlyRevenue,
          biggestFrustration: input.biggestFrustration,
          ninetyDayGoal: input.ninetyDayGoal,
          overallScore: healthScores.overall,
          leadScore,
          topStrength: healthScores.topStrength,
          biggestGap: primaryConstraint || healthScores.biggestGap,
          dashboardUrl,
          roadmapId,
        }).catch(err => {
          logger.error({ err }, "Failed to push lead to GHL");
        });

        return {
          id: roadmapId,
          titanRoadmap,
          ...playbooks,
          healthScores,
          benchmarkData,
          gapAnalysis,
        };
      } catch (error) {
        logger.error({ err: error }, "Error generating roadmap");
        
        // Provide user-friendly error message based on error type
        let errorMessage = "We encountered an issue generating your roadmap. ";
        
        if (error instanceof Error) {
          // Check for common error patterns
          if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            errorMessage += "Our AI is taking longer than expected. Please try again in a moment.";
          } else if (error.message.includes('rate limit') || error.message.includes('429')) {
            errorMessage += "Our system is experiencing high demand. Please try again in a few minutes.";
          } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
            errorMessage += "Please check your internet connection and try again.";
          } else {
            errorMessage += "Please try again or contact support if the issue persists.";
          }
        } else {
          errorMessage += "Please try again or contact support if the issue persists.";
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        });
      }
    }),

  // Get roadmap by ID — strips PII for non-admin access
  getRoadmap: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const roadmap = await getRoadmapById(input.id);
      if (!roadmap) {
        throw new Error("Roadmap not found");
      }
      // Return full data but strip sensitive PII fields
      const { email, phone, allAnswers, ...safeData } = roadmap;
      return safeData;
    }),

  // Get all roadmaps with optional filters (admin only)
  getAllRoadmaps: adminProcedure
    .input(z.object({
      monthlyRevenue: z.string().optional(),
      biggestFrustration: z.string().optional(),
      status: z.enum(["new", "contacted", "qualified", "converted"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      return await getAllRoadmaps(input);
    }),

  // Update lead status (admin only)
  updateLeadStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "contacted", "qualified", "converted"]),
    }))
    .mutation(async ({ input }) => {
      const { updateLeadStatus } = await import("./db");
      await updateLeadStatus(input.id, input.status);
      return { success: true };
    }),

  // Get roadmap by share code (public)
  getRoadmapByShareCode: publicProcedure
    .input(z.object({ shareCode: z.string() }))
    .query(async ({ input }) => {
      const { getRoadmapByShareCode } = await import("./db");
      const roadmap = await getRoadmapByShareCode(input.shareCode);
      if (!roadmap) {
        throw new Error("Roadmap not found");
      }
      // Filter out sensitive personal information for public sharing
      return {
        id: roadmap.id,
        businessName: roadmap.businessName,
        businessType: roadmap.businessType,
        titanRoadmap: roadmap.titanRoadmap,
        shareCode: roadmap.shareCode,
        viewCount: roadmap.viewCount,
        createdAt: roadmap.createdAt,
        // Explicitly exclude: email, phone, firstName, allAnswers, etc.
      };
    }),
});
