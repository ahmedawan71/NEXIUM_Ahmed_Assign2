import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { translateToUrdu } from "../../../../lib/translate";
import { saveToSupabase } from "../../../../lib/supabase";
import { saveToMongoDB } from "../../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const fullText = $("p").text().replace(/\s+/g, " ").trim();
    const words = fullText.split(" ").slice(0, 100).join(" ");
    const summary = words + (words.length >= 100 ? "..." : "");
    const translated = await translateToUrdu(summary);
    await saveToSupabase(summary, url);
    await saveToMongoDB(fullText, url);
    return NextResponse.json({ fullText, summary, translated });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to scrape blog" }, { status: 500 });
  }
}