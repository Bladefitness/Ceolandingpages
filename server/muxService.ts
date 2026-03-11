import Mux from "@mux/mux-node";
import { eq, desc } from "drizzle-orm";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { muxAssets } from "../drizzle/schema";

function getMuxClient() {
  return new Mux({
    tokenId: ENV.muxTokenId,
    tokenSecret: ENV.muxTokenSecret,
  });
}

export async function createDirectUpload(filename: string) {
  const mux = getMuxClient();

  let upload;
  try {
    upload = await mux.video.uploads.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
        // generated_subtitles is supported by the Mux API but absent from older SDK types
        generated_subtitles: [{ name: "English CC", language_code: "en" }],
      } as any,
      cors_origin: "*",
    });
  } catch (err) {
    throw new Error(`Failed to create Mux direct upload: ${err instanceof Error ? err.message : String(err)}`);
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(muxAssets).values({
    muxAssetId: upload.id, // placeholder — real asset ID arrives via webhook/poll
    uploadId: upload.id,
    filename,
    status: "preparing",
  });

  return {
    uploadUrl: upload.url,
    uploadId: upload.id,
    assetId: null,
  };
}

function deriveCaptionStatus(
  asset: Awaited<ReturnType<ReturnType<typeof getMuxClient>["video"]["assets"]["retrieve"]>>,
): "generating" | "ready" | "none" {
  const tracks = (asset as { tracks?: Array<{ type?: string; status?: string }> }).tracks ?? [];
  const textTrack = tracks.find((t) => t.type === "text");
  if (!textTrack) return "none";
  return textTrack.status === "ready" ? "ready" : "generating";
}

export async function getAssetStatus(uploadId: string) {
  const mux = getMuxClient();

  let upload;
  try {
    upload = await mux.video.uploads.retrieve(uploadId);
  } catch (err) {
    throw new Error(`Failed to retrieve Mux upload ${uploadId}: ${err instanceof Error ? err.message : String(err)}`);
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (upload.asset_id) {
    let asset;
    try {
      asset = await mux.video.assets.retrieve(upload.asset_id);
    } catch (err) {
      throw new Error(`Failed to retrieve Mux asset ${upload.asset_id}: ${err instanceof Error ? err.message : String(err)}`);
    }

    const mappedStatus: "preparing" | "ready" | "errored" =
      asset.status === "ready"
        ? "ready"
        : asset.status === "errored"
        ? "errored"
        : "preparing";

    await db
      .update(muxAssets)
      .set({
        muxAssetId: upload.asset_id,
        playbackId: asset.playback_ids?.[0]?.id ?? null,
        status: mappedStatus,
        captionStatus: deriveCaptionStatus(asset),
        duration: Math.round(asset.duration ?? 0),
      })
      .where(eq(muxAssets.uploadId, uploadId));
  }

  const rows = await db
    .select()
    .from(muxAssets)
    .where(eq(muxAssets.uploadId, uploadId));

  return rows[0] ?? null;
}

export async function listAssets() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(muxAssets)
    .orderBy(desc(muxAssets.createdAt));
}

export async function syncPreparingAssets() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const preparing = await db
    .select()
    .from(muxAssets)
    .where(eq(muxAssets.status, "preparing"));

  if (preparing.length === 0) return { synced: 0 };

  const mux = getMuxClient();
  let synced = 0;

  for (const row of preparing) {
    if (!row.uploadId) continue;
    try {
      const upload = await mux.video.uploads.retrieve(row.uploadId);
      if (!upload.asset_id) continue;

      const asset = await mux.video.assets.retrieve(upload.asset_id);
      const mappedStatus: "preparing" | "ready" | "errored" =
        asset.status === "ready"
          ? "ready"
          : asset.status === "errored"
          ? "errored"
          : "preparing";

      await db
        .update(muxAssets)
        .set({
          muxAssetId: upload.asset_id,
          playbackId: asset.playback_ids?.[0]?.id ?? null,
          status: mappedStatus,
          captionStatus: deriveCaptionStatus(asset),
          duration: Math.round(asset.duration ?? 0),
        })
        .where(eq(muxAssets.uploadId, row.uploadId));

      if (mappedStatus !== "preparing") synced++;
    } catch (err) {
      console.error(`Failed to sync asset ${row.uploadId}:`, err instanceof Error ? err.message : err);
    }
  }

  return { synced };
}

export type CaptionLine = { startTime: string; endTime: string; text: string };

function parseVtt(vttText: string): CaptionLine[] {
  const lines = vttText.split("\n");
  const result: CaptionLine[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    // Match timestamp lines like "00:00:01.000 --> 00:00:04.000"
    const tsMatch = line.match(/^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}[.,]\d{3})/);
    if (tsMatch) {
      const startTime = tsMatch[1].replace(",", ".");
      const endTime = tsMatch[2].replace(",", ".");
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "") {
        const t = lines[i].trim();
        if (t) textLines.push(t);
        i++;
      }
      const text = textLines.join(" ");
      if (text) result.push({ startTime, endTime, text });
    } else {
      i++;
    }
  }

  return result;
}

export async function getCaptions(muxAssetId: string): Promise<CaptionLine[] | null> {
  const mux = getMuxClient();

  let asset;
  try {
    asset = await mux.video.assets.retrieve(muxAssetId);
  } catch (err) {
    throw new Error(`Failed to retrieve asset ${muxAssetId}: ${err instanceof Error ? err.message : String(err)}`);
  }

  const playbackId = asset.playback_ids?.[0]?.id;
  if (!playbackId) return null;

  const tracks = (asset as { tracks?: Array<{ id?: string; type?: string; status?: string }> }).tracks ?? [];
  const textTrack = tracks.find((t) => t.type === "text" && t.status === "ready");
  if (!textTrack?.id) return null;

  const vttUrl = `https://stream.mux.com/${playbackId}/text/${textTrack.id}.vtt`;
  let vttText: string;
  try {
    const res = await fetch(vttUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    vttText = await res.text();
  } catch (err) {
    throw new Error(`Failed to fetch VTT from Mux: ${err instanceof Error ? err.message : String(err)}`);
  }

  return parseVtt(vttText);
}

export async function deleteAsset(muxAssetId: string) {
  const mux = getMuxClient();

  try {
    await mux.video.assets.delete(muxAssetId);
  } catch (err) {
    console.error(`Failed to delete Mux asset ${muxAssetId} from API:`, err instanceof Error ? err.message : err);
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(muxAssets).where(eq(muxAssets.muxAssetId, muxAssetId));
}
