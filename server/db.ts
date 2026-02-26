import { eq, desc, and, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, roadmaps, InsertRoadmap, Roadmap } from "../drizzle/schema";
import { ENV } from './_core/env';
import { logger } from "./_core/logger";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      logger.warn({ err: error }, "Failed to connect to database");
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    logger.warn("Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to upsert user");
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    logger.warn("Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Roadmap functions
export async function insertRoadmap(roadmap: InsertRoadmap): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(roadmaps).values(roadmap);
  return Number(result[0].insertId);
}

export async function getRoadmapById(id: number): Promise<Roadmap | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(roadmaps).where(eq(roadmaps.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllRoadmaps(filters?: {
  monthlyRevenue?: string;
  biggestFrustration?: string;
  status?: "new" | "contacted" | "qualified" | "converted";
}): Promise<Roadmap[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const conditions = [];
  
  if (filters?.monthlyRevenue) {
    conditions.push(eq(roadmaps.monthlyRevenue, filters.monthlyRevenue));
  }
  
  if (filters?.biggestFrustration) {
    conditions.push(like(roadmaps.biggestFrustration, `%${filters.biggestFrustration}%`));
  }
  
  if (filters?.status) {
    conditions.push(eq(roadmaps.status, filters.status));
  }

  const query = conditions.length > 0
    ? db.select().from(roadmaps).where(and(...conditions)).orderBy(desc(roadmaps.createdAt))
    : db.select().from(roadmaps).orderBy(desc(roadmaps.createdAt));

  return await query;
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "converted"): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(roadmaps).set({ status }).where(eq(roadmaps.id, id));
}

/**
 * Calculate lead score based on revenue potential, frustration urgency, and engagement
 * Score range: 0-100
 * - Revenue: 0-40 points (higher revenue = higher score)
 * - Frustration: 0-30 points (more urgent problems = higher score)
 * - Playbooks: 0-30 points (more playbooks selected = higher engagement)
 */
export function calculateLeadScore(data: {
  monthlyRevenue?: string;
  biggestFrustration?: string;
  offerPlaybook?: string;
  facebookAdLaunch?: string;
  instagramGrowth?: string;
  leadGeneration?: string;
}): number {
  let score = 0;

  // Revenue score (0-40 points)
  const revenueScores: Record<string, number> = {
    "$0-$5K": 5,
    "$5K-$20K": 15,
    "$20K-$50K": 25,
    "$50K-$100K": 35,
    "$100K+": 40,
  };
  score += revenueScores[data.monthlyRevenue || ""] || 0;

  // Frustration urgency score (0-30 points)
  // Higher urgency = more likely to buy
  const frustrationScores: Record<string, number> = {
    "Not enough leads coming in": 30, // Critical - no leads = dying business
    "Leads aren't converting to appointments": 28, // High urgency
    "Too many no-shows/cancellations": 25, // Losing money
    "Can't scale past current revenue": 22, // Growth blocked
    "Spending on ads with no ROI": 20, // Bleeding cash
    "Don't know what marketing actually works": 18, // Confused
    "No time to create content": 15, // Time constraint
    "Doing everything myself": 12, // Overwhelmed but lower urgency
  };
  
  // Match partial frustration text (since it's stored as text field)
  let frustrationScore = 0;
  if (data.biggestFrustration) {
    for (const [key, value] of Object.entries(frustrationScores)) {
      if (data.biggestFrustration.includes(key) || key.includes(data.biggestFrustration)) {
        frustrationScore = value;
        break;
      }
    }
  }
  score += frustrationScore;

  // Playbook engagement score (0-30 points)
  // More playbooks = higher engagement = more likely to buy
  let playbookCount = 0;
  if (data.offerPlaybook) playbookCount++;
  if (data.facebookAdLaunch) playbookCount++;
  if (data.instagramGrowth) playbookCount++;
  if (data.leadGeneration) playbookCount++;
  
  score += playbookCount * 7.5; // 7.5 points per playbook (max 30 for all 4)

  return Math.round(score);
}

export async function getRoadmapByShareCode(shareCode: string): Promise<Roadmap | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(roadmaps).where(eq(roadmaps.shareCode, shareCode)).limit(1);
  
  // Increment view count
  if (result.length > 0) {
    await db.update(roadmaps)
      .set({ viewCount: (result[0].viewCount || 0) + 1 })
      .where(eq(roadmaps.id, result[0].id));
  }
  
  return result.length > 0 ? result[0] : undefined;
}
