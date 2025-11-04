// Used throughout the app

// Form Types
export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export interface AskQuestionFormData {
  title: string;
  body: string;
  images: string[];
}

export interface SubmitAnswerFormData {
  content: string;
  images: string[];
}

// Data Types
export interface User {
  id: string;
  name: string;
  image: string | null;
}

export interface Answer {
  id: number;
  content: string;
  isAiGenerated: boolean;
  votes: number;
  createdAt: string;
  author: User | null;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
  votes: number;
  aiAnswerGenerated: boolean;
  createdAt: string;
  author: User;
  answers?: Answer[];
}

export interface SearchResult {
  id: number;
  title: string;
  body: string;
  tags: string[];
  images: string[];
  views: number;
  votes: number;
  createdAt: string;
  author: User & { email: string };
}

// Component Props
export interface VoteButtonsProps {
  itemId: number;
  itemType: "question" | "answer";
  initialVotes: number;
  userVote?: "upvote" | "downvote" | null;
}

export interface ImageUploadProps {
  maxImages?: number;
  onImagesChange: (imageUrls: string[]) => void;
  existingImages?: string[];
}
