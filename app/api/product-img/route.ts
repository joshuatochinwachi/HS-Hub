import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// Serves product images from the artifacts directory
// Maps: /api/product-img?name=panini_prizm_wc -> reads from artifacts dir
const ARTIFACTS_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  ".gemini",
  "antigravity-ide",
  "brain",
  "8a438209-e3ba-491b-8124-5ca535d4feaa"
);

const IMAGE_MAP: Record<string, string> = {
  panini_prizm_wc: "panini_prizm_wc_1783754804652.png",
  mega_greninja_ex: "mega_greninja_ex_1783754812628.png",
  perfect_order_box: "perfect_order_box_1783754824354.png",
  trainers_toolkit: "trainers_toolkit_1783754833334.png",
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") || "";
  const filename = IMAGE_MAP[name];

  if (!filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(ARTIFACTS_DIR, filename);

  try {
    const data = fs.readFileSync(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
