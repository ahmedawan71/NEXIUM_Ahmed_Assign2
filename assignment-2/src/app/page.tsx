"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { BookOpen, Loader2, Copy, Check } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [scrapedText, setScrapedText] = useState("");
  const [summary, setSummary] = useState("");
  const [dictionaryTranslation, setDictionaryTranslation] = useState("");
  const [aiTranslation, setAiTranslation] = useState("");
  const [error, setError] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    scraping: false,
    summarizing: false,
    dictionaryTranslating: false,
    aiTranslating: false,
  });
  const [copiedStates, setCopiedStates] = useState({
    scraped: false,
    summary: false,
    dictionary: false,
    ai: false,
  });

  const setLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async (
    text: string,
    type: keyof typeof copiedStates
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSummary("");
    setDictionaryTranslation("");
    setAiTranslation("");
    setLoading("scraping", true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setScrapedText(data.fullText);
      }
    } catch {
      setError("Failed to scrape blog");
    } finally {
      setLoading("scraping", false);
    }
  };

  const handleSummarize = async () => {
    setError("");
    setLoading("summarizing", true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scrapedText, url }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch {
      setError("Failed to summarize text");
    } finally {
      setLoading("summarizing", false);
    }
  };

  const handleDictionaryTranslate = async () => {
    setError("");
    setLoading("dictionaryTranslating", true);

    try {
      const res = await fetch("/api/translate/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setDictionaryTranslation(data.translated);
      }
    } catch {
      setError("Failed to translate with dictionary");
    } finally {
      setLoading("dictionaryTranslating", false);
    }
  };

  const handleAiTranslate = async () => {
    setError("");
    setLoading("aiTranslating", true);

    try {
      const res = await fetch("/api/translate/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAiTranslation(data.translated);
      }
    } catch {
      setError("Failed to translate with AI");
    } finally {
      setLoading("aiTranslating", false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-green-700" />
          <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">
            Blog Processing Tool
          </h1>
        </div>
        <p className="text-lg text-gray-600 mt-2 max-w-md mx-auto">
          Scrape, summarize, and translate blogs step by step!
        </p>
      </header>

      <Card className="w-full max-w-4xl p-6 shadow-xl rounded-2xl bg-white">
        {/* URL Input */}
        <div className="flex gap-2 mb-4">
          <Input
            type="url"
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border-gray-200 focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all rounded-md h-9 text-sm"
            disabled={loadingStates.scraping}
            aria-label="Blog URL input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleScrape(e);
              }
            }}
          />
          <Button
            onClick={handleScrape}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 h-9 rounded-md transition-all text-sm"
            disabled={loadingStates.scraping}
            aria-label="Scrape blog content"
          >
            {loadingStates.scraping ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scraping...
              </span>
            ) : (
              "Scrape"
            )}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium animate-pulse">
            {error}
          </p>
        )}

        {/* Scraped Text */}
        {scrapedText && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-800">
                Scraped Text
              </h3>
              <Button
                onClick={() => copyToClipboard(scrapedText, "scraped")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copiedStates.scraped ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {scrapedText}
              </p>
            </div>

            {/* Summarize Button */}
            <div className="mt-4">
              <Button
                onClick={handleSummarize}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
                disabled={loadingStates.summarizing}
              >
                {loadingStates.summarizing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Summarizing...
                  </span>
                ) : (
                  "Summarize"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-800">Summary</h3>
              <Button
                onClick={() => copyToClipboard(summary, "summary")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copiedStates.summary ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>

              <Button
                onClick={handleDictionaryTranslate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
                disabled={loadingStates.dictionaryTranslating}
              >
                {loadingStates.dictionaryTranslating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Translating...
                  </span>
                ) : (
                  "Translate to Urdu (Dictionary)"
                )}
              </Button>       
          </div>
        )}

        {/* Dictionary Translation */}
        {dictionaryTranslation && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-800">
                Dictionary Translation (Urdu)
              </h3>
              <Button
                onClick={() =>
                  copyToClipboard(dictionaryTranslation, "dictionary")
                }
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copiedStates.dictionary ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-gray-700 leading-relaxed font-urdu direction-rtl">
                {dictionaryTranslation}
              </p>
            </div>
          </div>
        )}

        {/* AI Translation */}
        {aiTranslation && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-800">
                AI Translation (Urdu)
              </h3>
              <Button
                onClick={() => copyToClipboard(aiTranslation, "ai")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copiedStates.ai ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-gray-700 leading-relaxed font-urdu direction-rtl">
                {aiTranslation}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}