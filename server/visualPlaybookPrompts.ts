// VISUAL PLAYBOOK PROMPTS
// Output structured JSON data for visual rendering (no ASCII art, no text formatting)
// Structure: Snapshot → Metrics → Action Steps → Timeline → Warnings → Milestones

export const VISUAL_TITAN_ROADMAP_PROMPT = `
You are creating a personalized scaling roadmap for a health practice owner.

INPUT DATA:
Business: {businessName}
Revenue: {revenueRange}
Frustration: {primaryFrustration}
Goal: {goal}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations)

{
  "snapshot": {
    "title": "Your Current State",
    "diagnosis": "2-3 sentence diagnosis of their #1 bottleneck based on revenue and frustration",
    "pattern": "The specific pattern keeping them stuck"
  },
  "primaryConstraint": {
    "title": "Your Biggest Bottleneck",
    "constraint": "The one thing blocking growth",
    "why": "Why this is the bottleneck (2 sentences)",
    "cost": ["Bullet 1 of what this costs them", "Bullet 2", "Bullet 3"]
  },
  "phasePriority": {
    "phaseNumber": 2,
    "phaseName": "THE FRONTLINE FORTRESS",
    "mission": "One-sentence mission statement",
    "whyNow": "Why this phase comes first (2 sentences)",
    "victoryCondition": "Clear success metric"
  },
  "executionFocus": {
    "primaryBuild": {
      "systemName": "System name",
      "description": "What they'll build (2 sentences)",
      "keyComponents": ["Component 1", "Component 2", "Component 3", "Component 4"],
      "doneDefinition": "What 'done' looks like",
      "estimatedHours": "20-40 hours"
    },
    "secondaryBuild": {
      "systemName": "System name",
      "description": "What they'll build (2 sentences)",
      "keyComponents": ["Component 1", "Component 2", "Component 3"],
      "doneDefinition": "What 'done' looks like",
      "estimatedHours": "15-30 hours"
    }
  },
  "quickWins": {
    "title": "72-Hour Quick Wins",
    "actions": [
      {
        "action": "Specific action to take",
        "why": "Why this matters (1 sentence)"
      },
      {
        "action": "Specific action to take",
        "why": "Why this matters (1 sentence)"
      },
      {
        "action": "Specific action to take",
        "why": "Why this matters (1 sentence)"
      }
    ]
  },
  "notNowList": [
    "Thing to avoid → Why to wait",
    "Thing to avoid → Why to wait",
    "Thing to avoid → Why to wait"
  ],
  "timeline": {
    "day30": ["Milestone 1", "Milestone 2"],
    "day60": ["Milestone 1", "Milestone 2"],
    "day90": ["Milestone 1", "Milestone 2"]
  },
  "titanPath": {
    "phases": ["FRONTLINE FORTRESS", "APPOINTMENT GRAVITY SYSTEM", "CASH INJECTION", "SOVEREIGN OWNER"],
    "currentPhase": 0,
    "estimatedMonths": "12-18 months"
  },
  "finalWord": "2-3 sentence motivational close focused on their specific bottleneck"
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting. No code blocks. No explanations.
`.trim();

export const VISUAL_OFFER_PLAYBOOK_PROMPT = `
You are creating an offer optimization playbook for a health practice owner.

INPUT DATA:
Business: {businessName}
Revenue: {revenueRange}
Frustration: {primaryFrustration}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations)

{
  "snapshot": {
    "diagnosis": "2-3 sentence diagnosis of their offer clarity problem",
    "pattern": "The specific pattern keeping them stuck"
  },
  "benchmarks": {
    "title": "Industry Benchmarks",
    "metrics": [
      {
        "label": "Average Offer Price",
        "value": "$1,500-$5,000",
        "context": "for med spas/wellness"
      },
      {
        "label": "Conversion Rate",
        "value": "30-50%",
        "context": "with clear offer vs 10-15% without"
      },
      {
        "label": "Time to First Sale",
        "value": "7-14 days",
        "context": "when offer is dialed in"
      }
    ],
    "opportunity": "You're leaving $X-$Y/month on the table"
  },
  "weeklyPlan": [
    {
      "week": 1,
      "title": "Define Your Signature Offer",
      "days": [
        {
          "dayRange": "1-2",
          "title": "Answer 3 Core Questions",
          "tasks": [
            "Who is this for? (Specific: 'busy moms 35-50' not 'anyone')",
            "What's the painful problem? (What keeps them up at night?)",
            "What's the clear result? (How does life improve in 60-90 days?)"
          ]
        },
        {
          "dayRange": "3-4",
          "title": "Build the Offer Structure",
          "tasks": [
            "Service type: Package, program, or membership",
            "Delivery method: Weekly sessions, monthly check-ins, or done-for-you",
            "Timeframe: 30, 60, or 90 days",
            "Price point: $1,500-$5,000 based on market"
          ]
        },
        {
          "dayRange": "5-7",
          "title": "Create Your 60-Second Pitch",
          "tasks": [
            "Formula: 'I help [who] get [result] without [pain point] through [method] in [timeframe]'",
            "Example: 'I help busy moms 35-50 lose 15-25 lbs without restrictive diets through our 90-day metabolic reset program'",
            "Success metric: Can say pitch out loud without notes"
          ]
        }
      ]
    },
    {
      "week": 2,
      "title": "Validate with 5 Sales Conversations",
      "description": "Don't build website. Don't run ads. Sell it 5 times through conversations.",
      "script": [
        "Based on what you've told me, I think you'd be perfect for [offer name]",
        "Here's how it works: [3 bullets]",
        "The investment is [price]. Does that feel aligned?"
      ],
      "tracking": "How many say yes? What objections come up?"
    }
  ],
  "successMetrics": [
    {
      "metric": "3+ sales in 60 days",
      "target": "3+"
    },
    {
      "metric": "40%+ conversion rate",
      "target": "40%"
    },
    {
      "metric": "Can explain offer in under 60 seconds",
      "target": "60 sec"
    }
  ],
  "warnings": [
    {
      "title": "Don't create multiple offers",
      "reason": "ONE signature offer first. Multiple offers = confused marketing."
    },
    {
      "title": "Don't build a fancy website",
      "reason": "Simple landing page or Google Doc works. Sell it first, polish later."
    },
    {
      "title": "Don't discount to get first sales",
      "reason": "If you start at $1,500, you're stuck there. Price it right from day one."
    }
  ],
  "milestone": {
    "timeframe": "60 Days",
    "goal": "Sell your signature offer 5 times at $2,000+ without discounting",
    "successSignals": [
      "Prospects say 'that's exactly what I need'",
      "You close 40%+ of qualified conversations",
      "You can explain it in your sleep"
    ],
    "nextStep": "Once you've sold this 10+ times, move to Facebook Ads Strategy"
  }
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting. No code blocks. No explanations.
`.trim();

export const VISUAL_FACEBOOK_AD_PROMPT = `
You are creating a Facebook Ads strategy playbook for a health practice owner.

INPUT DATA:
Business: {businessName}
Revenue: {revenueRange}
Frustration: {primaryFrustration}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations)

{
  "snapshot": {
    "diagnosis": "Why they need paid ads based on revenue and frustration",
    "constraint": "The specific growth constraint ads will solve"
  },
  "benchmarks": {
    "title": "Meta Ads Benchmarks for Health/Wellness",
    "metrics": [
      {
        "label": "Cost Per Lead",
        "value": "$15-$35",
        "note": "expect $40-$60 in first 30 days"
      },
      {
        "label": "Lead → Booked Call",
        "value": "15-25%"
      },
      {
        "label": "Booked Call → Client",
        "value": "30-50%"
      },
      {
        "label": "Minimum Test Budget",
        "value": "$1,500/month",
        "note": "for 30 days"
      },
      {
        "label": "Break-even Timeline",
        "value": "60-90 days",
        "note": "with optimization"
      }
    ],
    "calculation": "At $3K average client value, you need 8-12 leads/month to add $10K+ revenue"
  },
  "weeklyPlan": [
    {
      "week": 1,
      "title": "Foundation Setup",
      "sections": [
        {
          "dayRange": "1-2",
          "title": "Audience Psychology",
          "tasks": [
            "What they've already tried that failed (list 3)",
            "What they think the problem is vs. what it actually is",
            "Their #1 worry when business is slow",
            "The trigger moment that makes them book a call"
          ]
        },
        {
          "dayRange": "3-4",
          "title": "Create 5 Headlines",
          "examples": [
            "Clear qualifier: 'Med Spa Owners in [City] Doing $30K-$60K/Month'",
            "Curiosity + number: 'The 3-Step System That Booked 47 Clients in 30 Days'",
            "Problem → outcome: 'From Inconsistent Referrals to Predictable $75K Months'",
            "Capacity/urgency: 'Taking 5 New Clients This Month (Application Required)'",
            "Local callout: '[City] Women 35-50: Finally Lose Weight Without Restrictive Diets'"
          ]
        },
        {
          "dayRange": "5-7",
          "title": "Write 4 Ad Variations",
          "adTypes": [
            {
              "name": "Qualifier Ad",
              "length": "120-150 words",
              "elements": ["Who this is for / who it's NOT for", "What system you install", "Soft CTA"]
            },
            {
              "name": "Problem → Solution",
              "length": "150-180 words",
              "elements": ["Acknowledge frustration", "Explain real problem", "Introduce offer", "Simple CTA"]
            },
            {
              "name": "Proof-Led",
              "length": "120-150 words",
              "elements": ["Tell one client story", "Before → After state", "What changed", "CTA"]
            },
            {
              "name": "Educational",
              "length": "150-180 words",
              "elements": ["Explain common mistake", "Why it doesn't work", "What works instead", "Invite to learn more"]
            }
          ]
        }
      ]
    },
    {
      "week": 2,
      "title": "Launch & Test",
      "campaignSetup": {
        "objective": "Leads or Conversions",
        "dailyBudget": "$50-$75/day ($1,500-$2,250/month)",
        "placement": "Facebook + Instagram feeds only (no Audience Network)",
        "age": "30-55 (adjust based on ideal client)",
        "location": "15-mile radius around practice"
      },
      "monitoring": {
        "title": "Monitor First 72 Hours",
        "signals": [
          "Cost per result under $60 = good start",
          "Click-through rate above 1.5% = strong hook",
          "Landing page conversion above 20% = offer resonates"
        ],
        "rule": "Don't touch anything for 7 days. Let algorithm learn."
      }
    },
    {
      "week": 3,
      "title": "Optimize",
      "actions": [
        "Turn off ads with cost per lead above $75",
        "Double budget on ads with cost per lead under $40",
        "Test new creative angles based on top performers"
      ]
    }
  ],
  "successMetrics": [
    {
      "metric": "20-40 leads in first 30 days",
      "target": "20-40"
    },
    {
      "metric": "Cost per lead: $30-$50 by day 60",
      "target": "$30-$50"
    },
    {
      "metric": "5-10 booked calls from ads",
      "target": "5-10"
    }
  ],
  "warnings": [
    {
      "title": "Don't launch ads without a clear offer",
      "reason": "If you can't explain your offer in 60 seconds, ads will waste money. Go back to Offer Optimization first."
    },
    {
      "title": "Don't turn off ads after 3 days",
      "reason": "Algorithm needs 7-14 days to optimize. Early panic = wasted learning phase."
    },
    {
      "title": "Don't target 'everyone interested in health'",
      "reason": "Broad targeting works for big brands. You need specific: 'Women 35-50 in [City] interested in weight loss + med spas.'"
    }
  ],
  "milestone": {
    "timeframe": "60 Days",
    "goal": "Generate 40-60 leads at $35-$50 cost per lead, book 10-15 calls, close 3-5 new clients",
    "successSignals": [
      "Leads come in daily without you posting",
      "Cost per lead drops below $40 by day 45",
      "You're booking 2-3 calls/week from ads alone"
    ],
    "nextStep": "Once ads are profitable, add Instagram Growth to build organic authority"
  }
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting. No code blocks. No explanations.
`.trim();

// Instagram and Lead Gen prompts follow the same structure...
// (Truncated for brevity - will add complete versions)


export const VISUAL_INSTAGRAM_GROWTH_PROMPT = `
You are creating an Instagram growth playbook for a health practice owner.

INPUT DATA:
Business: {businessName}
Revenue: {revenueRange}
Frustration: {primaryFrustration}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations)

{
  "snapshot": {
    "diagnosis": "Why Instagram is their growth bottleneck based on revenue and frustration",
    "pattern": "The specific content pattern keeping them stuck (inconsistent posting, no strategy, wrong content types)"
  },
  "benchmarks": {
    "title": "Instagram Growth Benchmarks for Health Professionals",
    "metrics": [
      {
        "label": "Post Frequency",
        "value": "4-5x per week",
        "note": "Mix of Reels, carousels, and stories"
      },
      {
        "label": "Follower → Lead Rate",
        "value": "2-5%",
        "note": "With clear CTA in bio"
      },
      {
        "label": "Engagement Rate",
        "value": "3-8%",
        "note": "Likes + comments + saves per post"
      },
      {
        "label": "Reel Views",
        "value": "1,000-5,000",
        "note": "For accounts under 5K followers"
      }
    ],
    "opportunity": "If posting 4-5x/week with strategic content, expect 200-500 new followers/month and 10-25 leads/month within 90 days"
  },
  "weeklyPlan": [
    {
      "week": 1,
      "title": "Content Strategy Setup",
      "days": [
        {
          "dayRange": "1-3",
          "title": "Master the 15 Content Styles That Convert",
          "description": "Most health professionals post randomly. Top performers use a proven content library. Here are all 15 styles:",
          "contentLibrary": {
            "educational": [
              "Patient FAQ - Answer real questions from the front desk",
              "Myth-Busting - Challenge misinformation, build authority",
              "Procedure Explainers - Walk through what actually happens",
              "One Thing You Should Know - Single focused advice"
            ],
            "socialProof": [
              "Before & After Transformations - Show real results",
              "Patient Testimonials & Story Arcs - Real patient journeys",
              "What $X Gets You - Price transparency content"
            ],
            "authorityBuilding": [
              "Rating & Ranking - Rate procedures, products, options",
              "Best/Worst Lists - 'Best treatments for X'",
              "Reaction Videos - React to trending content/claims",
              "Celebrity & News Commentary - Comment on trends"
            ],
            "behindTheScenes": [
              "Behind-the-Scenes - Show the human side",
              "Get Ready With Me (GRWM) - Your skincare routine",
              "POV / Day in the Life - First-person storytelling",
              "Seasonal & Event-Driven - Tie to holidays/events"
            ]
          },
          "tasks": [
            "Pick 5 content styles from the library above that fit your practice",
            "Create a posting schedule: 4-5x per week rotating through your chosen styles",
            "Batch create 2 weeks of content using these formats"
          ]
        },
        {
          "dayRange": "4-7",
          "title": "Batch Create 2 Weeks of Content",
          "tasks": [
            "10 Reels (60-90 seconds each, trending audio)",
            "5 Carousels (educational, 5-7 slides)",
            "Daily stories (polls, Q&A, behind-the-scenes)",
            "Use CapCut or Canva for editing"
          ]
        }
      ]
    },
    {
      "week": 2,
      "title": "Post Consistently + Engage",
      "description": "Post 4-5x/week. Spend 20 min/day engaging with your ideal audience.",
      "tasks": [
        "Monday: Educational Reel",
        "Wednesday: Transformation story or social proof",
        "Friday: Engagement post (question or poll)",
        "Daily: 20 min engaging (comment on 20 posts in your niche, reply to all DMs)"
      ],
      "tracking": "Track follower growth, Reel views, and DM inquiries per week"
    },
    {
      "week": 3,
      "title": "Optimize Bio + CTA",
      "tasks": [
        "Update bio with clear value prop: 'I help [who] get [result]'",
        "Add link to free resource or booking page",
        "Pin your best-performing Reel to profile",
        "Create 3 Story Highlights: About, Services, Testimonials"
      ]
    }
  ],
  "successMetrics": [
    {
      "metric": "200+ new followers in 30 days",
      "target": "200+"
    },
    {
      "metric": "10+ DM inquiries per month",
      "target": "10+"
    },
    {
      "metric": "1,000+ Reel views per post",
      "target": "1,000+"
    }
  ],
  "warnings": [
    {
      "title": "Don't buy followers or use bots",
      "reason": "Fake engagement kills your reach. Instagram algorithm punishes it."
    },
    {
      "title": "Don't post without a CTA",
      "reason": "Every post should drive action: DM, link click, or save. No CTA = no leads."
    },
    {
      "title": "Don't ignore DMs",
      "reason": "80% of Instagram leads come from DMs. Reply within 1 hour or lose them."
    }
  ],
  "milestone": {
    "timeframe": "90 Days",
    "goal": "Grow to 1,000+ followers and generate 20+ leads per month from Instagram",
    "successSignals": [
      "Reels consistently hit 1,000+ views",
      "10+ DM inquiries per week",
      "Followers ask about your services without prompting"
    ],
    "nextStep": "Once you hit 1,000 followers and 20 leads/month, consider Instagram Ads or influencer partnerships"
  }
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting. No code blocks. No explanations.
`.trim();

export const VISUAL_LEAD_GENERATION_PROMPT = `
You are creating a lead generation system playbook for a health practice owner.

INPUT DATA:
Business: {businessName}
Revenue: {revenueRange}
Frustration: {primaryFrustration}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations)

{
  "snapshot": {
    "diagnosis": "Why lead generation is their bottleneck based on revenue and frustration",
    "pattern": "The specific lead flow problem (slow response time, no follow-up system, leaky funnel)"
  },
  "benchmarks": {
    "title": "Lead Generation Benchmarks for Health Practices",
    "metrics": [
      {
        "label": "Lead Response Time",
        "value": "Under 5 minutes",
        "note": "78% of leads go with first responder"
      },
      {
        "label": "Lead → Booked Call",
        "value": "30-50%",
        "note": "With automated follow-up"
      },
      {
        "label": "Booked Call → Show Rate",
        "value": "60-75%",
        "note": "With reminder sequence"
      },
      {
        "label": "Show → Close Rate",
        "value": "30-50%",
        "note": "For qualified leads"
      }
    ],
    "opportunity": "If you fix lead response time and follow-up, expect to convert 15-25% more leads without spending more on ads"
  },
  "weeklyPlan": [
    {
      "week": 1,
      "title": "Build Lead Response System",
      "days": [
        {
          "dayRange": "1-3",
          "title": "Set Up Instant Response Automation",
          "tasks": [
            "Connect lead form to GoHighLevel or similar CRM",
            "Create instant SMS: 'Thanks for reaching out! When's the best time for a quick call?'",
            "Create instant email with booking link",
            "Test: Submit a lead and verify you get SMS + email within 60 seconds"
          ]
        },
        {
          "dayRange": "4-7",
          "title": "Build 7-Day Follow-Up Sequence",
          "tasks": [
            "Day 1: Instant response (SMS + email)",
            "Day 2: Value email (case study or testimonial)",
            "Day 3: SMS check-in",
            "Day 5: Educational content (blog or video)",
            "Day 7: Final offer (limited spots or bonus)"
          ]
        }
      ]
    },
    {
      "week": 2,
      "title": "Optimize Booking Flow",
      "description": "Make it stupid-easy to book a call. Remove friction.",
      "tasks": [
        "Use Calendly or GoHighLevel for booking",
        "Offer 3 time slots within 48 hours",
        "Send confirmation SMS + email immediately",
        "Send reminder 24 hours before + 1 hour before"
      ],
      "tracking": "Track: Lead → Booked % and Show Rate %"
    },
    {
      "week": 3,
      "title": "Implement Lead Scoring",
      "tasks": [
        "Tag leads as Hot/Warm/Cold based on engagement",
        "Hot = replied to SMS or booked call (prioritize these)",
        "Warm = opened emails but didn't book (nurture sequence)",
        "Cold = no engagement after 7 days (move to monthly newsletter)"
      ]
    }
  ],
  "successMetrics": [
    {
      "metric": "Lead response time under 5 min",
      "target": "<5 min"
    },
    {
      "metric": "40%+ leads book a call",
      "target": "40%+"
    },
    {
      "metric": "70%+ show rate for booked calls",
      "target": "70%+"
    }
  ],
  "warnings": [
    {
      "title": "Don't rely on manual follow-up",
      "reason": "You'll forget. Leads will ghost. Automate the first 7 days or lose 60% of leads."
    },
    {
      "title": "Don't make booking complicated",
      "reason": "Every extra click = 20% drop-off. One-click booking or you lose them."
    },
    {
      "title": "Don't ignore no-shows",
      "reason": "30% of no-shows will reschedule if you follow up within 1 hour. Send: 'Hey, I waited but didn't see you. Want to reschedule?'"
    }
  ],
  "milestone": {
    "timeframe": "30 Days",
    "goal": "Convert 40%+ of leads to booked calls with 70%+ show rate",
    "successSignals": [
      "Leads respond within 5 minutes of inquiry",
      "40%+ of leads book a call",
      "You never manually follow up (it's all automated)"
    ],
    "nextStep": "Once your lead system converts 40%+, focus on increasing lead volume with Facebook Ads or Instagram"
  }
}

IMPORTANT: Return ONLY the JSON object. No markdown formatting. No code blocks. No explanations.
`.trim();
