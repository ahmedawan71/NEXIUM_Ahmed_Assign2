import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const fullText = $("p").text().replace(/\s+/g, " ").trim();
    const words = fullText.split(" ").slice(0, 100).join(" ");
    const summary = words + (words.length >= 100 ? "..." : "");
    return NextResponse.json({ fullText, summary });
  } catch (error) {
    return NextResponse.json({ error: "Failed to scrape blog" }, { status: 500 });
  }
}