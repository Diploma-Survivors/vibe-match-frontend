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
import type { Problem } from "@/types/problem";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  FileText,
  Filter,
  MemoryStick,
  Play,
  Search,
  Send,
  TestTube,
  Timer,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface ProblemDescriptionProps {
  problem: Problem;
  activeTab: string;
}

export default function ProblemDescription({
  problem,
  activeTab,
}: ProblemDescriptionProps) {
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

  // Status tab state
  const [searchTerm, setSearchTerm] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 20;

  // Mock submissions data for Status tab
  const mockSubmissions = [
    {
      id: 1001,
      when: "2025-08-09 14:30:25",
      who: "user123",
      fullName: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
      userRank: "expert",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Accepted",
      time: "124ms",
      memory: "2.1MB",
      testCase: null,
    },
    {
      id: 1002,
      when: "2025-08-09 14:25:15",
      who: "coder456",
      fullName: "Trần Thị B",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coder456",
      userRank: "candidate master",
      problem: problem.title,
      lang: "C++17",
      verdict: "Wrong Answer",
      time: "89ms",
      memory: "1.8MB",
      testCase: "Failed on test 5",
    },
    {
      id: 1003,
      when: "2025-08-09 14:20:10",
      who: "pythonist",
      fullName: "Lê Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pythonist",
      userRank: "specialist",
      problem: problem.title,
      lang: "Java 17",
      verdict: "Time Limit Exceeded",
      time: "2000ms",
      memory: "3.2MB",
      testCase: "Failed on test 12",
    },
    {
      id: 1004,
      when: "2025-08-09 14:15:05",
      who: "newbie_coder",
      fullName: "Phạm Thị D",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=newbie_coder",
      userRank: "newbie",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Compilation Error",
      time: "-",
      memory: "-",
      testCase: "Syntax error at line 15",
    },
    {
      id: 1005,
      when: "2025-08-09 14:10:00",
      who: "master_dev",
      fullName: "Hoàng Văn E",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master_dev",
      userRank: "master",
      problem: problem.title,
      lang: "C++17",
      verdict: "Accepted",
      time: "67ms",
      memory: "1.4MB",
      testCase: null,
    },
    {
      id: 1006,
      when: "2025-08-09 14:05:30",
      who: "java_expert",
      fullName: "Vũ Thị F",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=java_expert",
      userRank: "international master",
      problem: problem.title,
      lang: "Java 17",
      verdict: "Runtime Error",
      time: "156ms",
      memory: "2.8MB",
      testCase: "Runtime error on test 8",
    },
    {
      id: 1007,
      when: "2025-08-09 14:00:45",
      who: "algorithm_pro",
      fullName: "Đặng Văn G",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=algorithm_pro",
      userRank: "grandmaster",
      problem: problem.title,
      lang: "C++17",
      verdict: "Accepted",
      time: "45ms",
      memory: "1.2MB",
      testCase: null,
    },
    {
      id: 1008,
      when: "2025-08-09 13:55:20",
      who: "student_coder",
      fullName: "Bùi Thị H",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student_coder",
      userRank: "pupil",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Memory Limit Exceeded",
      time: "1800ms",
      memory: "256MB",
      testCase: "Memory limit exceeded on test 15",
    },
    {
      id: 1009,
      when: "2025-08-09 13:50:10",
      who: "competitive_coder",
      fullName: "Ngô Văn I",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=competitive_coder",
      userRank: "expert",
      problem: problem.title,
      lang: "JavaScript",
      verdict: "Wrong Answer",
      time: "234ms",
      memory: "3.5MB",
      testCase: "Wrong answer on test 3",
    },
    {
      id: 1010,
      when: "2025-08-09 13:45:00",
      who: "beginner123",
      fullName: "Cao Thị J",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beginner123",
      userRank: "newbie",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Accepted",
      time: "189ms",
      memory: "2.3MB",
      testCase: null,
    },
    {
      id: 1011,
      when: "2025-08-09 13:40:15",
      who: "algo_master",
      fullName: "Lý Văn K",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=algo_master",
      userRank: "international master",
      problem: problem.title,
      lang: "C++17",
      verdict: "Accepted",
      time: "34ms",
      memory: "1.1MB",
      testCase: null,
    },
    {
      id: 1012,
      when: "2025-08-09 13:35:30",
      who: "python_lover",
      fullName: "Trịnh Thị L",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=python_lover",
      userRank: "expert",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Time Limit Exceeded",
      time: "2000ms",
      memory: "1.9MB",
      testCase: "Time limit exceeded on test 18",
    },
    {
      id: 1013,
      when: "2025-08-09 13:30:45",
      who: "js_dev",
      fullName: "Đinh Văn M",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=js_dev",
      userRank: "specialist",
      problem: problem.title,
      lang: "JavaScript",
      verdict: "Wrong Answer",
      time: "145ms",
      memory: "2.7MB",
      testCase: "Wrong answer on test 7",
    },
    {
      id: 1014,
      when: "2025-08-09 13:25:20",
      who: "code_ninja",
      fullName: "Võ Thị N",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=code_ninja",
      userRank: "candidate master",
      problem: problem.title,
      lang: "Java 17",
      verdict: "Accepted",
      time: "98ms",
      memory: "2.4MB",
      testCase: null,
    },
    {
      id: 1015,
      when: "2025-08-09 13:20:10",
      who: "swift_coder",
      fullName: "Dương Văn O",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=swift_coder",
      userRank: "pupil",
      problem: problem.title,
      lang: "C++17",
      verdict: "Compilation Error",
      time: "-",
      memory: "-",
      testCase: "Compilation error: missing semicolon",
    },
    {
      id: 1016,
      when: "2025-08-09 13:15:55",
      who: "data_scientist",
      fullName: "Lương Thị P",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=data_scientist",
      userRank: "master",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Runtime Error",
      time: "67ms",
      memory: "1.8MB",
      testCase: "Runtime error on test 4",
    },
    {
      id: 1017,
      when: "2025-08-09 13:10:30",
      who: "full_stack",
      fullName: "Phan Văn Q",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=full_stack",
      userRank: "expert",
      problem: problem.title,
      lang: "JavaScript",
      verdict: "Accepted",
      time: "123ms",
      memory: "3.1MB",
      testCase: null,
    },
    {
      id: 1018,
      when: "2025-08-09 13:05:45",
      who: "algorithm_god",
      fullName: "Tôn Thị R",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=algorithm_god",
      userRank: "grandmaster",
      problem: problem.title,
      lang: "C++17",
      verdict: "Accepted",
      time: "23ms",
      memory: "0.9MB",
      testCase: null,
    },
    {
      id: 1019,
      when: "2025-08-09 13:00:20",
      who: "beginner_dev",
      fullName: "Hồ Văn S",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beginner_dev",
      userRank: "newbie",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Memory Limit Exceeded",
      time: "1456ms",
      memory: "256MB",
      testCase: "Memory limit exceeded on test 11",
    },
    {
      id: 1020,
      when: "2025-08-09 12:55:10",
      who: "competitive_ace",
      fullName: "Lê Thị T",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=competitive_ace",
      userRank: "international master",
      problem: problem.title,
      lang: "C++17",
      verdict: "Accepted",
      time: "56ms",
      memory: "1.3MB",
      testCase: null,
    },
    {
      id: 1021,
      when: "2025-08-09 12:50:35",
      who: "java_pro",
      fullName: "Nguyễn Văn U",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=java_pro",
      userRank: "specialist",
      problem: problem.title,
      lang: "Java 17",
      verdict: "Wrong Answer",
      time: "234ms",
      memory: "3.8MB",
      testCase: "Wrong answer on test 14",
    },
    {
      id: 1022,
      when: "2025-08-09 12:45:50",
      who: "python_expert",
      fullName: "Trần Thị V",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=python_expert",
      userRank: "master",
      problem: problem.title,
      lang: "Python 3.11",
      verdict: "Accepted",
      time: "167ms",
      memory: "2.6MB",
      testCase: null,
    },
    {
      id: 1023,
      when: "2025-08-09 12:40:25",
      who: "code_wizard",
      fullName: "Phạm Văn W",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=code_wizard",
      userRank: "candidate master",
      problem: problem.title,
      lang: "C++17",
      verdict: "Time Limit Exceeded",
      time: "2000ms",
      memory: "2.1MB",
      testCase: "Time limit exceeded on test 20",
    },
    {
      id: 1024,
      when: "2025-08-09 12:35:15",
      who: "student_ace",
      fullName: "Hoàng Thị X",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student_ace",
      userRank: "pupil",
      problem: problem.title,
      lang: "JavaScript",
      verdict: "Accepted",
      time: "289ms",
      memory: "4.2MB",
      testCase: null,
    },
    {
      id: 1025,
      when: "2025-08-09 12:30:40",
      who: "pro_coder",
      fullName: "Vũ Văn Y",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro_coder",
      userRank: "expert",
      problem: problem.title,
      lang: "Java 17",
      verdict: "Runtime Error",
      time: "156ms",
      memory: "2.9MB",
      testCase: "Runtime error on test 6",
    },
  ];

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "newbie":
        return "text-gray-600";
      case "pupil":
        return "text-green-600";
      case "specialist":
        return "text-cyan-600";
      case "expert":
        return "text-blue-600";
      case "candidate master":
        return "text-purple-600";
      case "master":
        return "text-orange-600";
      case "international master":
        return "text-orange-500";
      case "grandmaster":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "Wrong Answer":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "Time Limit Exceeded":
        return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
      case "Compilation Error":
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
      case "Runtime Error":
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
      case "Memory Limit Exceeded":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-slate-600 bg-slate-50 dark:bg-slate-900/20";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "Wrong Answer":
        return <XCircle className="w-4 h-4" />;
      case "Time Limit Exceeded":
        return <Timer className="w-4 h-4" />;
      case "Compilation Error":
        return <AlertCircle className="w-4 h-4" />;
      case "Runtime Error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter and sort submissions
  const filteredSubmissions = mockSubmissions
    .filter((submission) => {
      const matchesSearch =
        submission.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.id.toString().includes(searchTerm);
      const matchesVerdict =
        verdictFilter === "all" || submission.verdict === verdictFilter;
      const matchesLanguage =
        languageFilter === "all" || submission.lang.includes(languageFilter);

      return matchesSearch && matchesVerdict && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.when).getTime() - new Date(a.when).getTime();
      }
      return new Date(a.when).getTime() - new Date(b.when).getTime();
    });

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + submissionsPerPage
  );

  // Calculate verdict statistics
  const verdictStats = mockSubmissions.reduce(
    (acc, submission) => {
      acc[submission.verdict] = (acc[submission.verdict] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalSubmissions = mockSubmissions.length;
  const chartData = Object.entries(verdictStats)
    .map(([verdict, count]) => ({
      verdict,
      count,
      percentage: ((count / totalSubmissions) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");

    // Simulate code execution
    setTimeout(() => {
      setOutput(
        "Sample Input: 5\nSample Output: 1 1 2 3 5\n\nExecution time: 0.12s\nMemory used: 2.4 MB\n\n✅ Test passed!"
      );
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Submitting...");

    // Simulate submission
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
        `✅ Submission #${newSubmission.id} completed!\n\nStatus: ${newSubmission.status}\nRuntime: ${newSubmission.runtime}\nMemory: ${newSubmission.memory}\nScore: ${newSubmission.score}/100\n\nTest case 1: Passed (0.08s)\nTest case 2: Passed (0.12s)\nTest case 3: ${newSubmission.status === "Accepted" ? "Passed" : "Failed"} (0.15s)`
      );
      setIsSubmitting(false);
    }, 3000);
  };

  // Submit Tab Content
  if (activeTab === "submit") {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl h-full overflow-hidden">
        <div className="h-full flex gap-4 p-6">
          {/* Left Side - Code Editor & Controls (70%) */}
          <div className="w-[70%] flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 mb-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                {/* Editor Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Code Editor
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      Auto-save
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm">
                      <option>Python 3</option>
                      <option>C++17</option>
                      <option>Java 17</option>
                      <option>JavaScript</option>
                      <option>C# 10</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-slate-200 dark:border-slate-700"
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 p-4">
                  <textarea
                    placeholder="# Nhập N từ bàn phím&#10;n = int(input())&#10;&#10;# Code của bạn ở đây&#10;for i in range(1, n + 1):&#10;    print(i, end=' ')"
                    className="w-full h-full bg-transparent border-0 font-mono text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none"
                    style={{ minHeight: "400px" }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white border-0 px-6"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Code"}
              </Button>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Output
                </h4>
                <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 max-h-32 overflow-y-auto">
                  <pre className="text-green-400 dark:text-green-300 font-mono text-xs whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - AI Suggestions Panel (30%) */}
          <div className="w-[30%] bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                🤖 AI Gợi ý
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Nhận gợi ý code thông minh từ AI
              </p>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {/* AI Suggestion Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                <button
                  type="button"
                  className="px-2 py-1 text-xs bg-white dark:bg-slate-600 rounded text-slate-800 dark:text-slate-200 font-medium"
                >
                  Gợi ý
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Lỗi
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Thuật toán
                </button>
              </div>

              {/* AI Content */}
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                    💡 Gợi ý Code
                  </h4>
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                    <p>Sử dụng vòng lặp for để tính phi hàm Euler:</p>
                    <div className="bg-slate-100 dark:bg-slate-900 rounded p-2 font-mono text-xs">
                      <code>
                        for i in range(1, n+1):
                        <br />
                        &nbsp;&nbsp;phi[i] = i
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                    🔍 Phân tích bài toán
                  </h4>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <p>
                      Bài này yêu cầu tính phi hàm Euler từ 1 đến N. Độ phức tạp
                      tối ưu là O(N log log N) sử dụng sàng.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                    ⚡ Tối ưu hóa
                  </h4>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <p>
                      Sử dụng sàng Eratosthenes cải tiến để tính nhanh phi hàm.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-slate-200 dark:border-slate-700"
                >
                  🔄 Refresh gợi ý
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-slate-200 dark:border-slate-700"
                >
                  📋 Copy code mẫu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions History - Bottom Section */}
        {submissions.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
              📊 Lịch sử nộp bài
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {submissions.slice(0, 3).map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{submission.id}</span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        submission.status === "Accepted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {submission.status === "Accepted" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {submission.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span>{submission.runtime}</span>
                    <span>{submission.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Status Tab Content
  if (activeTab === "status") {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              📊 Submission Status
            </h2>
          </div>{" "}
          {/* Verdict Analysis Chart */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              📈 Verdict Analysis
            </h3>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {chartData.slice(0, 4).map((data) => (
                <div
                  key={data.verdict}
                  className="bg-slate-50/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getVerdictIcon(data.verdict)}
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      {data.verdict}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {data.count}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-500">
                    {data.percentage}%
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal Bar Chart */}
            <div className="space-y-3">
              {chartData.map((data) => (
                <div key={data.verdict} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-40 flex-shrink-0">
                    {getVerdictIcon(data.verdict)}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {data.verdict}
                    </span>
                  </div>

                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        data.verdict === "Accepted"
                          ? "bg-green-500"
                          : data.verdict === "Wrong Answer"
                            ? "bg-red-500"
                            : data.verdict === "Time Limit Exceeded"
                              ? "bg-orange-500"
                              : data.verdict === "Compilation Error"
                                ? "bg-gray-500"
                                : data.verdict === "Runtime Error"
                                  ? "bg-purple-500"
                                  : data.verdict === "Memory Limit Exceeded"
                                    ? "bg-yellow-500"
                                    : "bg-slate-500"
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-20 flex-shrink-0 text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {data.count}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      ({data.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Stats */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Overall Acceptance Rate
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {(
                        ((verdictStats.Accepted || 0) / totalSubmissions) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Total Submissions
                  </div>
                  <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {totalSubmissions}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by problem or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Verdict Filter */}
              <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by verdict" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All verdicts</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
                  <SelectItem value="Time Limit Exceeded">
                    Time Limit Exceeded
                  </SelectItem>
                  <SelectItem value="Memory Limit Exceeded">
                    Memory Limit Exceeded
                  </SelectItem>
                  <SelectItem value="Compilation Error">
                    Compilation Error
                  </SelectItem>
                  <SelectItem value="Runtime Error">Runtime Error</SelectItem>
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="C#">C#</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Submissions Table */}
          <div>
            <table className="w-full table-auto">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    When
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 min-w-[200px]">
                    Who
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 min-w-[300px]">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    Lang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    Verdict
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {paginatedSubmissions.map((submission, index) => {
                  return (
                    <tr
                      key={submission.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline font-semibold transition-colors"
                        >
                          {submission.id}
                        </button>
                      </td>

                      {/* When */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                          {submission.when}
                        </div>
                      </td>

                      {/* Who */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={submission.avatar}
                            alt={submission.fullName}
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 ring-2 ring-slate-200 dark:ring-slate-600"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {submission.fullName}
                            </span>
                            <span
                              className={`text-xs font-medium ${getRankColor(submission.userRank)}`}
                            >
                              @{submission.who}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Problem */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-slate-900 dark:text-slate-100 hover:text-green-600 dark:hover:text-green-400 hover:underline text-sm font-medium max-w-xs truncate text-left transition-colors"
                        >
                          {submission.problem}
                        </button>
                      </td>

                      {/* Language */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {submission.lang}
                          </span>
                        </div>
                      </td>

                      {/* Verdict */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative group">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${getVerdictColor(submission.verdict)}`}
                          >
                            {getVerdictIcon(submission.verdict)}
                            {submission.verdict}
                          </div>
                          {/* Tooltip */}
                          {submission.testCase && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {submission.testCase}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">
                          {submission.time}
                        </span>
                      </td>

                      {/* Memory */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">
                          {submission.memory}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* No results */}
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-slate-800">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No submissions found
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  No submissions match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-700/10">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 p-0 rounded-xl transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Page info and items per page */}
              <div className="flex items-center gap-6">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Hiển thị{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {startIndex + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {Math.min(
                      startIndex + submissionsPerPage,
                      filteredSubmissions.length
                    )}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {filteredSubmissions.length}
                  </span>{" "}
                  submissions
                </div>

                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Trang{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {currentPage}
                  </span>{" "}
                  /{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab !== "problem") {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            This section is under development.
          </p>
        </div>
      </div>
    );
  }

  // Sample test cases (you can expand this based on your data structure)
  const sampleCases = [
    {
      input: "5",
      output: "1 1 2 3 5",
      explanation: "First 5 Fibonacci numbers",
    },
    {
      input: "8",
      output: "1 1 2 3 5 8 13 21",
      explanation: "First 8 Fibonacci numbers",
    },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
      <div className="p-8 space-y-8">
        {/* Problem Title */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {problem.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  problem.difficulty === "Dễ"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : problem.difficulty === "Trung bình"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {problem.difficulty}
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">2.0s</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <MemoryStick className="w-4 h-4" />
              <span className="text-sm">256MB</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{problem.points} điểm</span>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Mô tả bài toán
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Cho số nguyên dương <strong>N</strong>, liệt kê phi hàm euler của
              các số từ 1 tới N và in ra màn hình.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
              Phi hàm euler của số <strong>X</strong> hiển số lượng số nguyên tố
              cùng nhau với <strong>X</strong> nằm trong khoảng từ [1, X].
            </p>
          </div>
        </section>

        {/* Input Format */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Đầu vào
          </h2>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300">• Số nguyên N</p>
          </div>
        </section>

        {/* Constraints */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Giới hạn
          </h2>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300">• 1≤N≤10^6</p>
          </div>
        </section>

        {/* Output Format */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Đầu ra
          </h2>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300">
              • In ra phi hàm euler của các số từ 1 tới N
            </p>
          </div>
        </section>

        {/* Sample Cases */}
        <section>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Ví dụ
          </h2>
          {sampleCases.map((testCase, index) => (
            <div
              key={`testcase-${index}-${testCase.input.slice(0, 10)}`}
              className="mb-6 last:mb-0"
            >
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
                Test case {index + 1}
              </h3>

              {/* Input */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Input
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(testCase.input, index * 2)}
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copiedIndex === index * 2 ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">
                    {testCase.input}
                  </code>
                </div>
              </div>

              {/* Output */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Output
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(testCase.output, index * 2 + 1)
                    }
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copiedIndex === index * 2 + 1 ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">
                    {testCase.output}
                  </code>
                </div>
              </div>

              {/* Explanation */}
              {testCase.explanation && (
                <div className="text-sm text-slate-600 dark:text-slate-400 italic">
                  {testCase.explanation}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
