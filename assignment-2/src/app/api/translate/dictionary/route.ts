import { NextResponse } from "next/server";
import { translateToUrdu } from "../../../../../lib/translate";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const translated = await translateToUrdu(text);

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Dictionary translation error:", error);
    return NextResponse.json({ error: "Failed to translate with dictionary" }, { status: 500 });
  }
}