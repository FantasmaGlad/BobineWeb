import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  // L’absence du fichier vérifié doit arrêter le build pour éviter de servir un autre installateur.
  const scriptContent = fs.readFileSync(path.join(process.cwd(), "public", "install.sh"), "utf-8");
  return new NextResponse(scriptContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
