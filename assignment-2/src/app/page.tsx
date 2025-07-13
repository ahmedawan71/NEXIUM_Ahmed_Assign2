"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="btn btn-primary">
            Summarize
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {summary && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Summary:</h2>
            <p>{summary}</p>
            <h2 className="text-lg font-bold">Translated (Urdu):</h2>
            <p>{translated}</p>
          </div>
        )}
      </Card>
    </div>
  );
}