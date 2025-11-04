"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SearchResult } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim().length < 2) {
      alert("Search query must be at least 2 characters");
      return;
    }

    await performSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-heading text-3xl font-bold mb-6 text-foreground">
        Search Questions
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">Search</span>
          </Button>
        </div>
      </form>

      {searched && !loading && (
        <p className="text-sm text-muted-foreground mb-4">
          Found {results.length} result{results.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <Link key={result.id} href={`/questions/${result.id}`}>
            <div className="bg-card border border-border rounded p-4 hover:shadow-sm transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                {result.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {result.body.substring(0, 200)}...
              </p>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {result.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="font-medium">{result.votes} votes</span>
                <span>{result.views} views</span>
                <span>asked by {result.author.name}</span>
                <span>
                  {formatDistanceToNow(new Date(result.createdAt))} ago
                </span>
              </div>
            </div>
          </Link>
        ))}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No results found for "{query}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try different keywords or ask a new question
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
