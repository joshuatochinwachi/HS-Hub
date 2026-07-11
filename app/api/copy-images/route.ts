import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const ARTIFACTS_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  ".gemini",
  "antigravity-ide",
  "brain",
  "8a438209-e3ba-491b-8124-5ca535d4feaa"
);

const IMAGE_MAP = {
  "panini_prizm_wc.png": "panini_prizm_wc_1783754804652.png",
  "mega_greninja_ex.png": "mega_greninja_ex_1783754812628.png",
  "perfect_order_box.png": "perfect_order_box_1783754824354.png",
  "trainers_toolkit.png": "trainers_toolkit_1783754833334.png",
};

export async function GET(request: NextRequest) {
  const destDir = path.join(process.cwd(), "public", "products");

  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const copiedFiles: string[] = [];

    for (const [destName, srcName] of Object.entries(IMAGE_MAP)) {
      const srcPath = path.join(ARTIFACTS_DIR, srcName);
      const destPath = path.join(destDir, destName);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        copiedFiles.push(destName);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully copied images to public/products/ folder.`,
      files: copiedFiles,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
