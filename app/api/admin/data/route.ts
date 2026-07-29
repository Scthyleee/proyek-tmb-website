import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Read current data
    let currentData = {};
    if (fs.existsSync(dataFilePath)) {
      currentData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }

    // Update with new data (merge)
    const newData = { ...currentData, ...body };
    
    // Save to file
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), "utf8");

    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}
