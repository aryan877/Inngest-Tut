// API base configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Generic API wrapper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Query key factory
export const queryKeys = {
  questions: ["questions"] as const,
  question: (id: string) => ["question", id] as const,
  user: (id: string) => ["user", id] as const,
  search: (query: string) => ["search", query] as const,
  imageUrl: (key: string) => ["image-url", key] as const,
  imageUrls: (keys: string[]) => ["image-urls", keys] as const,
};


// Import Drizzle schema types (type-safe from actual database schema)
import type { answers, questions, user } from "@/lib/schema";

// Use Drizzle's built-in type inference - no duplication needed!
export type User = typeof user.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;

// Import tag types from schema
import type { tags } from "@/lib/schema";
export type Tag = typeof tags.$inferSelect;

// API response types with populated relationships (as expected by components)
export type QuestionWithAuthor = Omit<Question, "authorId"> & {
  author: User; // Populated from authorId relationship
  tags: string[]; // Populated from questionTags junction table
};

export type AnswerWithAuthor = Omit<Answer, "authorId"> & {
  author: User | null; // Populated from authorId relationship (nullable)
};

export type UserWithProfile = {
  user: User; // Main user object
  profile?: {
    reputation: number;
    questionsCount: number;
    answersCount: number;
    bio?: string;
    location?: string;
    website?: string;
    githubHandle?: string;
  };
  questions: QuestionWithAuthor[];
  answers: AnswerWithAuthor[];
};
