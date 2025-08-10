import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { saveToMongoDB } from "../../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const fullText = $("p, article p, main p, .content p, .post-content p, .entry-content p")
      .map((_, el) => $(el).text())
      .get()
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!fullText) {
      return NextResponse.json({ error: "No content found on the page" }, { status: 400 });
    }

    await saveToMongoDB(fullText, url);

    return NextResponse.json({ fullText });
  } catch (error: any) {
    console.error("Scraping error:", error);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json({ error: "Unable to access the URL. Please check if it's valid and accessible." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to scrape blog content" }, { status: 500 });
  }
}