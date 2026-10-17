import { NextResponse } from "next/server";
import { getRepoStats } from "@/lib/releaseChannels";

export const runtime = "nodejs";

export type { ReleaseChannelInfo } from "@/lib/releaseTypes";

export async function GET() {
  return NextResponse.json(await getRepoStats(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
