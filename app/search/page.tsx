"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchResult {
  id: number;
  title: string;
  body: string;
  tags: string[];
  images: string[];
  views: number;
  votes: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

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
      <h1 className="font-heading text-3xl font-bold mb-6 text-zinc-800 dark:text-white">
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
            className="bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-950 dark:hover:bg-white text-zinc-50 dark:text-zinc-800 font-semibold"
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
        <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-4">
          Found {results.length} result{results.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <Link key={result.id} href={`/questions/${result.id}`}>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-4 hover:shadow-sm transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">
                {result.title}
              </h3>

              <p className="text-sm text-zinc-700 dark:text-zinc-400 line-clamp-2 mb-3">
                {result.body.substring(0, 200)}...
              </p>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {result.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 flex-wrap">
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
            <p className="text-zinc-700 dark:text-zinc-400">
              No results found for "{query}"
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Try different keywords or ask a new question
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
