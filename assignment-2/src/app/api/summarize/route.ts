import { NextResponse } from "next/server";
import { saveToSupabase } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const { text, url } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const words = text.split(" ").slice(0, 100);
    const summary = words.join(" ") + (words.length >= 100 ? "..." : "");

    if (url) {
      await saveToSupabase(summary, url);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json({ error: "Failed to summarize text" }, { status: 500 });
  }
}