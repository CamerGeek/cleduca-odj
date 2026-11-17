import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;
  if (
    !file?.length ||
    file.some(
      (part) =>
        part.includes("..") ||
        part.includes("/") ||
        part.includes("\\") ||
        part.startsWith("."),
    )
  ) {
    return new NextResponse("Fichier introuvable.", { status: 404 });
  }

  const directory = path.join(process.cwd(), ".data", "uploads");
  const target = path.resolve(directory, ...file);
  if (!target.startsWith(`${path.resolve(directory)}${path.sep}`)) {
    return new NextResponse("Fichier introuvable.", { status: 404 });
  }

  const extension = path.extname(target).slice(1).toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) {
    return new NextResponse("Fichier introuvable.", { status: 404 });
  }

  try {
    const data = await fs.readFile(target);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Fichier introuvable.", { status: 404 });
  }
}
