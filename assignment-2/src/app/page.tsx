"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call API route to process URL
    const res = await fetch("/api/summarize", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setTranslated(data.translated);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <Input
            type="url"
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="submit" className="mt-4">Summarize</Button>
        </form>
        {summary && (
          <div className="mt-4">
            <h2>Summary:</h2>
            <p>{summary}</p>
            <h2>Translated (Urdu):</h2>
            <p>{translated}</p>
          </div>
        )}
      </Card>
    </div>
  );
}