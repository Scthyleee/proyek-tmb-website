import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // e.g. "image", "document", "model"

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Determine subdirectory based on type
    let subDir = "uploads";
    if (type === "document") subDir = "documents";
    else if (type === "model") subDir = "models";
    else if (type === "image") subDir = "gallery";

    const uploadDir = path.join(process.cwd(), "public", subDir);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file with original name (sanitized)
    const fileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/${subDir}/${fileName}`,
      name: fileName,
      size: file.size
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
