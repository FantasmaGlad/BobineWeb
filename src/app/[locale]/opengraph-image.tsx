import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Bobine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const iconData = await readFile(
    join(process.cwd(), "public/logo-bobine-icon.png")
  );
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ede8d0",
          color: "#372528",
        }}
      >
        <img src={iconSrc} width={200} height={223} alt="" />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 32 }}>
          Bobine
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 16, opacity: 0.75 }}>
          {"L’alternative open-source à LesMills Cinema"}
        </div>
      </div>
    ),
    { ...size }
  );
}
