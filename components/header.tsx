"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { Search } from "lucide-react";

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="relative border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center h-20 space-x-4">
            {/* Logo */}
            <div className="md:flex-1">
              <Link href="/" className="text-xl font-outfit font-bold text-zinc-800 dark:text-white">
                AI Q&A Forum
              </Link>
            </div>

            {/* Navigation */}
            <nav className="grow">
              <ul className="flex items-center whitespace-nowrap font-semibold text-[15px]">
                <li className="py-2">
                  <Link
                    href="/questions"
                    className="px-4 lg:px-10 text-zinc-800 dark:text-zinc-100 hover:underline hover:decoration-zinc-300 dark:hover:decoration-zinc-600 underline-offset-4"
                  >
                    Questions
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    href="/search"
                    className="px-4 lg:px-10 inline-flex items-center gap-2 text-zinc-800 dark:text-zinc-100 hover:underline hover:decoration-zinc-300 dark:hover:decoration-zinc-600 underline-offset-4"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Actions */}
            <div className="md:flex-1 flex items-center justify-end gap-3">
              <Link href="/questions/ask">
                <Button
                  className="bg-zinc-800 dark:bg-zinc-100 hover:bg-zinc-950 dark:hover:bg-white text-zinc-50 dark:text-zinc-800 font-semibold"
                >
                  Ask Question
                </Button>
              </Link>

              {isPending ? (
                <Button variant="outline" disabled className="text-sm">
                  Loading...
                </Button>
              ) : session?.user ? (
                <div className="flex items-center gap-3">
                  <Link href={`/users/${session.user.id}`}>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100">
                      {session.user.name}
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="text-sm"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline" className="text-sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="ghost" className="text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
