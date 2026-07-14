import fs from "fs"
import path from "path"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  const filePath = path.join(process.cwd(), "public", "logo.png")
  const buffer = fs.readFileSync(filePath)
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
