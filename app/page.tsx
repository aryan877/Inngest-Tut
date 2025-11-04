import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, Tags, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-20">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-zinc-800 dark:text-white leading-tight">
          Get Instant AI-Powered Answers
        </h1>
        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Ask any coding question and receive instant AI-generated answers
          powered by GPT-5, plus insights from the community
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/questions/ask">
            <Button
              size="lg"
              className="bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-950 dark:hover:bg-white text-zinc-50 dark:text-zinc-800 font-semibold w-full sm:w-auto"
            >
              Ask a Question
            </Button>
          </Link>
          <Link href="/questions">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Browse Questions
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
              <Bot className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              Instant AI Answers
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Every question gets an AI-generated answer within seconds using
            GPT-5
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
              <Tags className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              Auto-Tagging
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Questions are automatically tagged and categorized by AI
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
              <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              Community Answers
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Get additional insights from experienced developers
          </p>
        </div>
      </div>
    </div>
  );
}
