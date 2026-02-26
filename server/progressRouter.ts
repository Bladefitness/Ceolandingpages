import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { taskProgress, playbookShareTokens, roadmaps } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";

export const progressRouter = router({
  // Get all completed tasks for a roadmap
  getProgress: publicProcedure
    .input(
      z.object({
        roadmapId: z.number(),
        playbookType: z.enum(["titan", "offer", "facebook", "instagram", "leadgen"]),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const progress = await db
        .select()
        .from(taskProgress)
        .where(
          and(
            eq(taskProgress.roadmapId, input.roadmapId),
            eq(taskProgress.playbookType, input.playbookType)
          )
        );
      
      // Return as a Set of completed task IDs for easy lookup
      return progress
        .filter((p: any) => p.completed === 1)
        .map((p: any) => p.taskId);
    }),

  // Toggle task completion status
  toggleTask: publicProcedure
    .input(
      z.object({
        roadmapId: z.number(),
        playbookType: z.enum(["titan", "offer", "facebook", "instagram", "leadgen"]),
        taskId: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Check if task progress record exists
      const existing = await db
        .select()
        .from(taskProgress)
        .where(
          and(
            eq(taskProgress.roadmapId, input.roadmapId),
            eq(taskProgress.playbookType, input.playbookType),
            eq(taskProgress.taskId, input.taskId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing record
        await db
          .update(taskProgress)
          .set({
            completed: input.completed ? 1 : 0,
            completedAt: input.completed ? new Date() : null,
          })
          .where(eq(taskProgress.id, existing[0].id));
      } else {
        // Insert new record
        await db.insert(taskProgress).values({
          roadmapId: input.roadmapId,
          playbookType: input.playbookType,
          taskId: input.taskId,
          completed: input.completed ? 1 : 0,
          completedAt: input.completed ? new Date() : null,
        });
      }

      return { success: true };
    }),

  // Generate shareable link for a playbook
  generateShareLink: publicProcedure
    .input(
      z.object({
        roadmapId: z.number(),
        playbookType: z.enum(["titan", "offer", "facebook", "instagram", "leadgen"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Check if share token already exists
      const existing = await db
        .select()
        .from(playbookShareTokens)
        .where(
          and(
            eq(playbookShareTokens.roadmapId, input.roadmapId),
            eq(playbookShareTokens.playbookType, input.playbookType)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { token: existing[0].token };
      }

      // Generate new unique token
      const token = randomBytes(16).toString("hex");

      await db.insert(playbookShareTokens).values({
        roadmapId: input.roadmapId,
        playbookType: input.playbookType,
        token,
      });

      return { token };
    }),

  // Get playbook data by share token (for public viewing)
  getSharedPlaybook: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const shareRecord = await db
        .select()
        .from(playbookShareTokens)
        .where(eq(playbookShareTokens.token, input.token))
        .limit(1);

      if (shareRecord.length === 0) {
        throw new Error("Invalid share link");
      }

      // Increment view count
      await db
        .update(playbookShareTokens)
        .set({
          viewCount: shareRecord[0].viewCount + 1,
        })
        .where(eq(playbookShareTokens.id, shareRecord[0].id));

      // Get roadmap data
      const roadmapResults = await db
        .select()
        .from(roadmaps)
        .where(eq(roadmaps.id, shareRecord[0].roadmapId))
        .limit(1);
      
      const roadmapData = roadmapResults[0];

      if (!roadmapData) {
        throw new Error("Roadmap not found");
      }

      const playbookType = shareRecord[0].playbookType;
      let playbookContent = "";

      switch (playbookType) {
        case "titan":
          playbookContent = roadmapData.titanRoadmap || "";
          break;
        case "offer":
          playbookContent = roadmapData.offerPlaybook || "";
          break;
        case "facebook":
          playbookContent = roadmapData.facebookAdLaunch || "";
          break;
        case "instagram":
          playbookContent = roadmapData.instagramGrowth || "";
          break;
        case "leadgen":
          playbookContent = roadmapData.leadGeneration || "";
          break;
      }

      return {
        businessName: roadmapData.businessName,
        playbookType,
        playbookContent,
        overallScore: roadmapData.overallScore,
      };
    }),
});
