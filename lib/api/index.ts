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

// Hierarchical query key factory following TanStack Query best practices
export const queryKeys = {
  // Question-related keys
  questions: {
    all: ["questions"] as const,
    lists: () => [...queryKeys.questions.all, "list"] as const,
    list: (filters: { page?: number; limit?: number; tag?: string }) =>
      [...queryKeys.questions.lists(), filters] as const,
    details: () => [...queryKeys.questions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.questions.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.questions.all, "search", query] as const,
  },

  // User-related keys
  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) =>
      [...queryKeys.users.detail(id), "profile"] as const,
  },

  // Answer-related keys
  answers: {
    all: ["answers"] as const,
    lists: () => [...queryKeys.answers.all, "list"] as const,
    list: (questionId: string) =>
      [...queryKeys.answers.lists(), questionId] as const,
    details: () => [...queryKeys.answers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.answers.details(), id] as const,
  },

  // Tag-related keys
  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    detail: (id: string) => [...queryKeys.tags.all, "detail", id] as const,
  },

  // Image-related keys
  images: {
    url: (key: string) => ["images", "url", key] as const,
    urls: (keys: string[]) => ["images", "urls", keys] as const,
  },
} as const;

// Import Drizzle schema types (type-safe from actual database schema)
import type { answers, questions, tags, user, userProfile } from "@/lib/schema";

// Use Drizzle's built-in type inference - no duplication needed!
export type User = typeof user.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type UserProfile = typeof userProfile.$inferSelect;
export type Tag = typeof tags.$inferSelect;

// API response types with populated relationships
export type QuestionWithAuthor = Omit<Question, "authorId"> & {
  author: User; // Populated from authorId relationship
  tags: string[]; // Populated from questionTags junction table
};

export type AnswerWithAuthor = Omit<Answer, "authorId"> & {
  author: User | null; // Populated from authorId relationship (nullable)
};

export type AnswerWithQuestion = Omit<Answer, "questionId"> & {
  question?: {
    id: number;
    title: string;
  } | null; // Populated from questionId relationship
};

// Use Drizzle relations for type-safe user with profile
export type UserWithProfile = User & {
  profile?: UserProfile | null;
  _count?: {
    questions: number;
    answers: number;
  };
};

// API response type for user profile endpoint
export type UserProfileApiResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  profile: UserProfile | null;
  questions: Question[];
  answers: AnswerWithQuestion[];
};
