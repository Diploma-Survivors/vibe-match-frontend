"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Problem, Solution } from "@/types/problem";
import {
  AlertCircle,
  BarChart3,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Code2,
  Copy,
  Eye,
  FileText,
  Filter,
  Heart,
  Lightbulb,
  MemoryStick,
  MessageCircle,
  Play,
  Plus,
  Search,
  Send,
  Share,
  Sparkles,
  TestTube,
  ThumbsUp,
  Timer,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function ProblemSolutionsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const [submissions, setSubmissions] = useState<
    Array<{
      id: number;
      timestamp: string;
      status:
        | "Accepted"
        | "Wrong Answer"
        | "Time Limit Exceeded"
        | "Runtime Error";
      runtime: string;
      memory: string;
      score: number;
    }>
  >([]);

  // Solutions tab state
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
    null
  );
  const [solutionSearchTerm, setSolutionSearchTerm] = useState("");
  const [solutionLanguageFilter, setSolutionLanguageFilter] = useState("all");
  const [solutionSortOrder, setSolutionSortOrder] = useState("popular");

  // Mock solutions data
  const mockSolutions: Solution[] = [
    {
      id: "sol-1",
      title: "Efficient Euler's Totient Function using Sieve",
      description:
        "This solution uses the sieve approach to calculate Euler's totient function for all numbers from 1 to N efficiently. Time complexity: O(N log log N), which is much better than the naive O(N√N) approach.",
      author: {
        name: "AlgorithmMaster",
        level: "Expert",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=expert1",
      },
      code: `def sieve_euler_phi(n):
      phi = list(range(n + 1))
      for i in range(2, n + 1):
          if phi[i] == i:  # i is prime
              for j in range(i, n + 1, i):
                  phi[j] -= phi[j] // i
      return phi
  
  n = int(input())
  phi = sieve_euler_phi(n)
  for i in range(1, n + 1):
      print(phi[i], end=" " if i < n else "")
  print()`,
      language: "Python 3.11",
      runtime: "124ms",
      memory: "2.1MB",
      views: 1247,
      supports: 89,
      comments: 23,
      createdAt: "2025-01-15T10:30:00Z",
      tags: ["sieve", "number-theory", "optimization"],
    },
    {
      id: "sol-2",
      title: "Clean Mathematical Approach",
      description:
        "A straightforward implementation using the mathematical definition of Euler's totient function. Easy to understand and implement, perfect for learning the concept.",
      author: {
        name: "MathGenius",
        level: "Advanced",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=math1",
      },
      code: `def euler_phi(n):
      result = n
      p = 2
      while p * p <= n:
          if n % p == 0:
              while n % p == 0:
                  n //= p
              result -= result // p
          p += 1
      if n > 1:
          result -= result // n
      return result
  
  n = int(input())
  for i in range(1, n + 1):
      print(euler_phi(i), end=" " if i < n else "")
  print()`,
      language: "Python 3.11",
      runtime: "298ms",
      memory: "1.8MB",
      views: 892,
      supports: 67,
      comments: 15,
      createdAt: "2025-01-14T15:45:00Z",
      tags: ["math", "basic", "educational"],
    },
  ];

  // Filter and sort solutions
  const filteredSolutions = mockSolutions
    .filter((solution) => {
      const matchesSearch =
        solution.title
          .toLowerCase()
          .includes(solutionSearchTerm.toLowerCase()) ||
        solution.author.name
          .toLowerCase()
          .includes(solutionSearchTerm.toLowerCase()) ||
        solution.description
          .toLowerCase()
          .includes(solutionSearchTerm.toLowerCase());

      const matchesLanguage =
        solutionLanguageFilter === "all" ||
        solution.language
          .toLowerCase()
          .includes(solutionLanguageFilter.toLowerCase());

      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      switch (solutionSortOrder) {
        case "popular":
          return b.supports + b.views * 0.1 - (a.supports + a.views * 0.1);
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "views":
          return b.views - a.views;
        case "supports":
          return b.supports - a.supports;
        default:
          return 0;
      }
    });

  // Auto-select first solution if none selected
  if (!selectedSolution && filteredSolutions.length > 0) {
    setSelectedSolution(filteredSolutions[0]);
  }

  const getAuthorLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      case "advanced":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "intermediate":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "beginner":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");

    setTimeout(() => {
      setOutput(
        "Sample Input: 5\nSample Output: 1 1 2 1 4\n\nExecution time: 0.12s\nMemory used: 2.4 MB\n\n✅ Test passed!"
      );
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Submitting...");

    setTimeout(() => {
      const statusOptions: Array<
        "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
      > = ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"];
      const randomStatus =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const newSubmission = {
        id: submissions.length + 1,
        timestamp: new Date().toLocaleString(),
        status: Math.random() > 0.3 ? ("Accepted" as const) : randomStatus,
        runtime: `${(Math.random() * 2).toFixed(2)}s`,
        memory: `${(Math.random() * 50 + 10).toFixed(1)}MB`,
        score: Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 60 + 20),
      };

      setSubmissions([newSubmission, ...submissions]);
      setOutput(
        `✅ Submission #${newSubmission.id} completed!\n\nStatus: ${newSubmission.status}\nRuntime: ${newSubmission.runtime}\nMemory: ${newSubmission.memory}\nScore: ${newSubmission.score}/100`
      );
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel - Solution List */}

          <div className="xl:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              {/* Header */}

              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        💡 Community Solutions
                      </h2>

                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Learn from other solutions for mock problem
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Section */}

              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

                    <Input
                      value={solutionSearchTerm}
                      onChange={(e) => setSolutionSearchTerm(e.target.value)}
                      placeholder="Search solutions by title, author, or description..."
                      className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      value={solutionLanguageFilter}
                      onValueChange={setSolutionLanguageFilter}
                    >
                      <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="All languages" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="all">All languages</SelectItem>

                        <SelectItem value="python">Python</SelectItem>

                        <SelectItem value="cpp">C++</SelectItem>

                        <SelectItem value="java">Java</SelectItem>

                        <SelectItem value="javascript">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={solutionSortOrder}
                      onValueChange={setSolutionSortOrder}
                    >
                      <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>

                        <SelectItem value="newest">Newest</SelectItem>

                        <SelectItem value="views">Most Viewed</SelectItem>

                        <SelectItem value="supports">Most Liked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Solutions List */}

              <div className="overflow-y-auto max-h-[600px]">
                {filteredSolutions.length > 0 ? (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredSolutions.map((solution) => (
                      <div
                        key={solution.id}
                        onClick={() => setSelectedSolution(solution)}
                        className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          selectedSolution?.id === solution.id
                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={solution.author.avatar}
                            alt={solution.author.name}
                            className="w-8 h-8 rounded-full"
                          />

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {solution.author.name}
                              </span>

                              <Badge
                                variant="outline"
                                className={`text-xs px-2 py-0.5 ${getAuthorLevelColor(
                                  solution.author.level
                                )}`}
                              >
                                {solution.author.level}
                              </Badge>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {formatTimeAgo(solution.createdAt)}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
                          {solution.title}
                        </h3>

                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {solution.language}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />

                            <span>{solution.views.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />

                            <span>{solution.supports}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />

                            <span>{solution.comments}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Timer className="w-3 h-3" />

                            <span>{solution.runtime}</span>
                          </div>

                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <MemoryStick className="w-3 h-3" />

                            <span>{solution.memory}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />

                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      No solutions found
                    </h3>

                    <p className="text-slate-500 dark:text-slate-500">
                      Try adjusting your search filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Solution Detail */}

          <div className="xl:col-span-1">
            {selectedSolution ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedSolution.author.avatar}
                        alt={selectedSolution.author.name}
                        className="w-10 h-10 rounded-full"
                      />

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          {selectedSolution.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            by {selectedSolution.author.name}
                          </span>

                          <Badge
                            variant="outline"
                            className={`text-xs ${getAuthorLevelColor(
                              selectedSolution.author.level
                            )}`}
                          >
                            {selectedSolution.author.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />

                        {selectedSolution.supports}
                      </Button>

                      <Button variant="outline" size="sm" className="gap-2">
                        <Share className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {selectedSolution.language}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />

                      <span>
                        {selectedSolution.views.toLocaleString()} views
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />

                      <span>{selectedSolution.comments} comments</span>
                    </div>

                    <span>{formatTimeAgo(selectedSolution.createdAt)}</span>
                  </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[600px]">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Performance Metrics
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                        <div className="text-xs text-green-600 dark:text-green-400 mb-1">
                          Runtime
                        </div>

                        <div className="text-lg font-bold text-green-700 dark:text-green-300 font-mono">
                          {selectedSolution.runtime}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                          Memory Usage
                        </div>

                        <div className="text-lg font-bold text-blue-700 dark:text-blue-300 font-mono">
                          {selectedSolution.memory}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Description
                    </h4>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedSolution.description}
                      </p>
                    </div>
                  </div>

                  {selectedSolution.tags &&
                    selectedSolution.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                          Tags
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {selectedSolution.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Solution Code
                      </h4>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(selectedSolution.code, -2)
                        }
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />

                        {copiedIndex === -2 ? "Copied!" : "Copy Code"}
                      </Button>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-700 overflow-x-auto">
                      <pre className="text-xs text-green-400 dark:text-green-300 font-mono whitespace-pre-wrap">
                        {selectedSolution.code}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Comments ({selectedSolution.comments})
                    </h4>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Comments section coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 text-center">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />

                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Select a solution
                </h3>

                <p className="text-slate-500 dark:text-slate-500">
                  Click on any solution from the left to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
