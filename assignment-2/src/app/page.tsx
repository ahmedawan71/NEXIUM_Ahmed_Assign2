"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
        setTranslated(data.translated);
      }
    } catch {
      setError("Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-green-700" />
          <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">
            Blog Summarization Tool
          </h1>
        </div>
        <p className="text-lg text-gray-600 mt-2 max-w-md mx-auto">
          Summarize any blog and translate it into Urdu instantly!
        </p>
      </header>
      <Card className="w-full max-w-lg p-6 shadow-xl rounded-2xl bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all rounded-md py-2"
            disabled={loading}
            aria-label="Blog URL input"
          />
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition-all"
            disabled={loading}
            aria-label="Submit URL to summarize"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Summarizing...
              </span>
            ) : (
              "Summarize"
            )}
          </Button>
        </form>
        {error && (
          <p className="text-red-500 mt-4 text-center font-medium animate-pulse">{error}</p>
        )}
        {summary && !loading && (
          <div className="mt-6 space-y-4">
            <details className="bg-gray-50 rounded-md p-3">
              <summary className="text-lg font-semibold text-green-800 cursor-pointer hover:text-green-600">
                Summary
              </summary>
              <p className="text-gray-700 mt-2 leading-relaxed">{summary}</p>
            </details>
            <details className="bg-gray-50 rounded-md p-3">
              <summary className="text-lg font-semibold text-green-800 cursor-pointer hover:text-green-600">
                Translated (Urdu)
              </summary>
              <p className="text-gray-700 mt-2 font-urdu leading-relaxed direction-rtl">{translated}</p>
            </details>
          </div>
        )}
      </Card>
    </div>
  );
}
