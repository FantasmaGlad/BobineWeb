import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "install.sh");
    const scriptContent = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("#!/usr/bin/env bash\ncurl -sSL https://raw.githubusercontent.com/FantasmaGlad/Bobine/main/install.sh | bash -s -- \"$@\"\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
