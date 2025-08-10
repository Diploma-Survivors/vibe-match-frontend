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
  BarChart3,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Code2,
  Copy,
  FileText,
  Filter,
  MemoryStick,
  MessageCircle,
  Play,
  Search,
  Send,
  Share,
  Sparkles,
  TestTube,
  Timer,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import CodeEditor from "./code-editor";
import MonacoSubmitEditor from "./monaco-submit-editor";
import SimpleSubmitEditor from "./simple-submit-editor";
import TestPageContent from "./test-page-content";

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
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState<Record<number, string>>({});

  // Publish Solution Modal state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState<
    Array<{ role: "user" | "ai"; content: string; timestamp: string }>
  >([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 20;

  // Mock submissions data for Status tab - Current User Only
  const mockUserSubmissions = [
    {
      id: 1001,
      when: "2025-08-09 14:30:25",
      verdict: "Accepted",
      time: "124ms",
      memory: "2.1MB",
      testCase: null,
      lang: "Python 3.11",
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
    print(euler_phi(i), end=" ")`,
      result: "All test cases passed successfully",
    },
    {
      id: 1002,
      when: "2025-08-09 14:25:15",
      verdict: "Wrong Answer",
      time: "89ms",
      memory: "1.8MB",
      testCase: "Failed on test 5",
      lang: "Python 3.11",
      code: `n = int(input())
for i in range(1, n + 1):
    # Wrong implementation
    print(i, end=" ")`,
      result: "Expected output: 1 1 2 1 4 2 6 1 6 2\nActual output: 1 2 3 4 5 6 7 8 9 10",
    },
    {
      id: 1003,
      when: "2025-08-09 14:20:10",
      verdict: "Time Limit Exceeded",
      time: "2000ms",
      memory: "3.2MB",
      testCase: "Failed on test 12",
      lang: "Python 3.11",
      code: `def euler_phi(n):
    # Inefficient implementation
    count = 0
    for i in range(1, n + 1):
        if gcd(i, n) == 1:
            count += 1
    return count

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

n = int(input())
for i in range(1, n + 1):
    print(euler_phi(i), end=" ")`,
      result: "Time limit exceeded on test case with large input",
    },
    {
      id: 1004,
      when: "2025-08-09 14:15:05",
      verdict: "Compilation Error",
      time: "-",
      memory: "-",
      testCase: "Syntax error at line 15",
      lang: "Python 3.11",
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
    print(euler_phi(i), end=" "  # Missing closing parenthesis`,
      result: "SyntaxError: '(' was never closed",
    },
    {
      id: 1005,
      when: "2025-08-09 14:10:00",
      verdict: "Runtime Error",
      time: "67ms",
      memory: "1.8MB",
      testCase: "Runtime error on test 4",
      lang: "Python 3.11",
      code: `def euler_phi(n):
    result = n
    p = 2
    while p * p <= n:
        if n % p == 0:
            while n % p == 0:
                n //= p
            result -= result // p  # Division by zero possible
        p += 1
    if n > 1:
        result -= result // n
    return result

n = int(input())
for i in range(1, n + 1):
    print(euler_phi(i), end=" ")`,
      result: "ZeroDivisionError: integer division or modulo by zero",
    },
  ];

  // Get selected submission details
  const selectedSubmission = mockUserSubmissions.find(sub => sub.id === selectedSubmissionId);

  // Auto-select first submission if none selected
  if (!selectedSubmissionId && mockUserSubmissions.length > 0) {
    setSelectedSubmissionId(mockUserSubmissions[0].id);
  }

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
  const filteredSubmissions = mockUserSubmissions
    .filter((submission) => {
      const matchesSearch =
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
  const verdictStats = mockUserSubmissions.reduce(
    (acc, submission) => {
      acc[submission.verdict] = (acc[submission.verdict] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalSubmissions = mockUserSubmissions.length;
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

  // AI Assistant Functions
  const getAiResponse = (question: string): string => {
    if (
      question.toLowerCase().includes("giải thích") ||
      question.toLowerCase().includes("thuật toán")
    ) {
      return `Đây là bài toán về dãy con chẵn lẻ. Thuật toán giải quyết:

1. **Phân tích bài toán**: Cần liệt kê phi hàm euler của các số từ 1 tới N
2. **Công thức Euler**: φ(n) = n × ∏(1 - 1/p) với p là các số nguyên tố chia hết n
3. **Độ phức tạp**: O(N × sqrt(N)) cho việc tính toán

**Ý tưởng chính**: 
- Duyệt từ 1 đến N
- Với mỗi số, tính phi hàm euler
- In kết quả ra màn hình`;
    }

    if (
      question.toLowerCase().includes("gợi ý") ||
      question.toLowerCase().includes("code")
    ) {
      return `Đây là gợi ý code cho bài này:

\`\`\`python
def euler_phi(n):
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
    print(euler_phi(i), end=" ")
\`\`\`

**Giải thích**:
- Hàm \`euler_phi(n)\` tính phi hàm euler của n
- Duyệt từ 1 đến n và in kết quả`;
    }

    if (
      question.toLowerCase().includes("tối ưu") ||
      question.toLowerCase().includes("optimize")
    ) {
      return `Các cách tối ưu hóa solution:

**1. Sàng Euler Phi (O(N log log N))**:
\`\`\`python
def sieve_euler_phi(n):
    phi = list(range(n + 1))
    for i in range(2, n + 1):
        if phi[i] == i:  # i is prime
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    return phi

n = int(input())
phi = sieve_euler_phi(n)
for i in range(1, n + 1):
    print(phi[i], end=" ")
\`\`\`

**2. Tối ưu bộ nhớ**: Chỉ tính khi cần
**3. Tối ưu I/O**: Dùng sys.stdout.write thay vì print`;
    }

    if (
      question.toLowerCase().includes("debug") ||
      question.toLowerCase().includes("lỗi")
    ) {
      return `Các lỗi thường gặp và cách debug:

**1. Time Limit Exceeded**:
- Thuật toán O(N²) quá chậm
- Dùng sàng thay vì tính từng số

**2. Wrong Answer**:
- Kiểm tra công thức phi hàm euler
- Chú ý trường hợp n = 1 (φ(1) = 1)

**3. Runtime Error**:
- Kiểm tra chia cho 0
- Kiểm tra index mảng

**Cách debug**: Thử với test case nhỏ (n=5) để kiểm tra output`;
    }

    return `Tôi có thể giúp bạn:
- Giải thích thuật toán
- Đưa ra gợi ý code  
- Debug lỗi
- Tối ưu hóa solution

Hãy hỏi cụ thể hơn nhé!`;
  };

  const handleAiMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsAiThinking(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        role: "ai" as const,
        content: getAiResponse(message),
        timestamp: new Date().toLocaleTimeString(),
      };

      setAiMessages((prev) => [...prev, aiResponse]);
      setIsAiThinking(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const messages = {
      explain: "Hãy giải thích thuật toán cho bài này",
      hint: "Cho tôi gợi ý code để giải bài này",
      optimize: "Làm thế nào để tối ưu hóa solution này?",
    };

    handleAiMessage(messages[action as keyof typeof messages] || action);
  };

  // Publish Solution Functions
  const handlePublishSolution = () => {
    if (selectedSubmission) {
      setPublishTitle(`Optimal Solution for ${problem.title}`);
      setPublishDescription("This is my efficient solution that passes all test cases with good performance.");
      setIsPublishModalOpen(true);
    }
  };

  const handlePublishSubmit = async () => {
    if (!publishTitle.trim() || !publishDescription.trim()) {
      return;
    }

    setIsPublishing(true);

    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      setPublishTitle("");
      setPublishDescription("");
      // You could show a success notification here
      alert("Solution published successfully!");
    }, 2000);
  };

  const handlePublishCancel = () => {
    setIsPublishModalOpen(false);
    setPublishTitle("");
    setPublishDescription("");
  };

  // Submit Tab Content
  if (activeTab === "submit") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-0 py-0">
          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Code Editor */}
            <div className="xl:col-span-2">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
                <div className="h-[650px]">
                  <MonacoSubmitEditor
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                  />
                </div>

                {/* Output Section */}
                {output && (
                  <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Execution Result
                      </h4>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <pre className="text-green-400 dark:text-green-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {output}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Problem Info & Features */}
            <div className="space-y-6">
              {/* AI Assistant Card */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    AI Assistant
                  </h3>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        AI Powered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Chat Interface */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/20 rounded-lg p-5 border border-slate-200/50 dark:border-slate-700/50 max-h-80 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Welcome Message */}
                      {aiMessages.length === 0 && (
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              Xin chào! Tôi là AI Assistant. Tôi có thể giúp
                              bạn:
                            </p>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                              <li>• Giải thích thuật toán</li>
                              <li>• Đưa ra gợi ý code</li>
                              <li>• Debug lỗi</li>
                              <li>• Tối ưu hóa solution</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Chat Messages */}
                      {aiMessages.map((message) => (
                        <div
                          key={message.timestamp}
                          className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : "bg-gradient-to-br from-purple-500 to-pink-600"
                            }`}
                          >
                            {message.role === "user" ? (
                              <div className="w-3 h-3 bg-white rounded-full" />
                            ) : (
                              <Bot className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div
                            className={`bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 shadow-sm max-w-[90%] ${
                              message.role === "user"
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : ""
                            }`}
                          >
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* AI Thinking */}
                      {isAiThinking && (
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">
                                AI đang suy nghĩ...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAiMessage(aiInput);
                          }
                        }}
                        placeholder="Hỏi AI về thuật toán, debug code..."
                        className="flex-1 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50"
                        disabled={isAiThinking}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAiMessage(aiInput)}
                        disabled={isAiThinking || !aiInput.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("explain")}
                        disabled={isAiThinking}
                        className="text-xs bg-white/60 dark:bg-slate-800/60 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Giải thích bài này
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("hint")}
                        disabled={isAiThinking}
                        className="text-xs bg-white/60 dark:bg-slate-800/60 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        Gợi ý code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("optimize")}
                        disabled={isAiThinking}
                        className="text-xs bg-white/60 dark:bg-slate-800/60 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Tối ưu hóa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Submissions */}
              {submissions.length > 0 && (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Recent Submissions
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {submissions.slice(0, 5).map((submission) => (
                      <div
                        key={submission.id}
                        className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-3 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-slate-600 dark:text-slate-400">
                              #{submission.id}
                            </span>
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                submission.status === "Accepted"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : submission.status === "Wrong Answer"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : submission.status ===
                                        "Time Limit Exceeded"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              }`}
                            >
                              {submission.status === "Accepted" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : submission.status === "Wrong Answer" ? (
                                <XCircle className="w-3 h-3" />
                              ) : submission.status ===
                                "Time Limit Exceeded" ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {submission.status}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {submission.timestamp}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-3">
                            <span>⏱️ {submission.runtime}</span>
                            <span>💾 {submission.memory}</span>
                          </div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {submission.score}/100
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Test Tab Content
  if (activeTab === "test") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TestPageContent />
        </div>
      </div>
    );
  }

  // Status Tab Content
  if (activeTab === "status") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - User Submissions List */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    📊 My Submissions
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your submission history for {problem.title}
                  </p>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Verdict Filter */}
                    <Select value={verdictFilter} onValueChange={setVerdictFilter}>
                      <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="All verdicts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All verdicts</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
                        <SelectItem value="Time Limit Exceeded">Time Limit Exceeded</SelectItem>
                        <SelectItem value="Compilation Error">Compilation Error</SelectItem>
                        <SelectItem value="Runtime Error">Runtime Error</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Language Filter */}
                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                      <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All languages</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="C++">C++</SelectItem>
                        <SelectItem value="Java">Java</SelectItem>
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort Order */}
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Language
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Runtime
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Memory
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockUserSubmissions.map((submission) => (
                        <tr
                          key={submission.id}
                          onClick={() => setSelectedSubmissionId(submission.id)}
                          className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                            selectedSubmissionId === submission.id
                              ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          {/* Status */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(submission.verdict)}`}
                              >
                                {getVerdictIcon(submission.verdict)}
                                {submission.verdict}
                              </div>
                            </div>
                          </td>

                          {/* Language */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                              {submission.lang}
                            </span>
                          </td>

                          {/* Runtime */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                              {submission.time}
                            </span>
                          </td>

                          {/* Memory */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                              {submission.memory}
                            </span>
                          </td>

                          {/* Notes */}
                          <td className="px-4 py-4">
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                              {submissionNotes[submission.id] || "No notes"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* No submissions */}
                  {mockUserSubmissions.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-slate-400 dark:text-slate-500 mb-4">
                        <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        No submissions yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-500">
                        Submit your first solution to see it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Submission Details */}
            <div className="xl:col-span-1">
              {selectedSubmission ? (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Submission #{selectedSubmission.id}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {selectedSubmission.when}
                          </p>
                        </div>
                      </div>
                      
                      {/* Publish Solution Button - Only for Accepted submissions */}
                      {selectedSubmission.verdict === "Accepted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePublishSolution}
                          className="gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                        >
                          <Share className="w-4 h-4" />
                          Publish Solution
                        </Button>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${getVerdictColor(selectedSubmission.verdict)}`}
                    >
                      {getVerdictIcon(selectedSubmission.verdict)}
                      {selectedSubmission.verdict}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-6">
                    {/* Performance Metrics */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Runtime
                          </div>
                          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                            {selectedSubmission.time}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Memory
                          </div>
                          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                            {selectedSubmission.memory}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Language
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {selectedSubmission.lang}
                        </span>
                      </div>
                    </div>

                    {/* Result */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Result
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {selectedSubmission.result}
                        </pre>
                      </div>
                    </div>

                    {/* Code */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Submitted Code
                      </h4>
                      <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <pre className="text-xs text-green-400 dark:text-green-300 font-mono whitespace-pre-wrap overflow-x-auto">
                          {selectedSubmission.code}
                        </pre>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedSubmission.code, -1)}
                          className="text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Code
                        </Button>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Notes
                      </h4>
                      <textarea
                        value={submissionNotes[selectedSubmission.id] || ""}
                        onChange={(e) =>
                          setSubmissionNotes((prev) => ({
                            ...prev,
                            [selectedSubmission.id]: e.target.value,
                          }))
                        }
                        placeholder="Add your notes about this submission..."
                        className="w-full h-24 p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                      />
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Notes are saved automatically as you type
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 text-center">
                  <div className="text-slate-400 dark:text-slate-500 mb-4">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Select a submission
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Click on any submission from the left to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publish Solution Modal */}
        {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Share className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Publish Solution
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Share your accepted solution with the community
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePublishCancel}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Form */}
                  <div className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Solution Title
                      </label>
                      <Input
                        value={publishTitle}
                        onChange={(e) => setPublishTitle(e.target.value)}
                        placeholder="Enter a descriptive title for your solution"
                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                        Description
                      </label>
                      <textarea
                        value={publishDescription}
                        onChange={(e) => setPublishDescription(e.target.value)}
                        placeholder="Explain your approach, algorithm complexity, and any insights..."
                        rows={8}
                        className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* Solution Stats */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        Solution Performance
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Runtime</div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                            {selectedSubmission?.time}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Memory</div>
                          <div className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                            {selectedSubmission?.memory}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Language</div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {selectedSubmission?.lang}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Code Preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Code Preview
                    </h4>
                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-700 h-[400px] overflow-y-auto">
                      <pre className="text-xs text-green-400 dark:text-green-300 font-mono whitespace-pre-wrap">
                        {selectedSubmission?.code}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Your solution will be visible to other users in the community solutions section.
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePublishCancel}
                      disabled={isPublishing}
                      className="border-slate-200 dark:border-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePublishSubmit}
                      disabled={isPublishing || !publishTitle.trim() || !publishDescription.trim()}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
                    >
                      {isPublishing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Publishing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Share className="w-4 h-4" />
                          Publish Solution
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standing Tab Content
  if (activeTab === "standing") {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    🏆 Leaderboard
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Top performers for {problem.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all-time">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Leaderboard Content */}
          <div className="p-6">
            {/* Top 3 Podium */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                👑 Top 3 Champions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Place */}
                <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl order-2 md:order-1">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-yellow-800 font-bold text-sm">
                        🥇
                      </span>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=champion1"
                        alt="Champion 1"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <h4 className="font-bold text-lg">CodeMaster2024</h4>
                    <p className="text-yellow-100 text-sm mb-2">Expert Level</p>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-yellow-100">Best Time</div>
                      <div className="text-lg font-bold">47ms</div>
                      <div className="text-xs text-yellow-100">
                        Memory: 1.2MB
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Place */}
                <div className="relative bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl p-6 text-slate-800 transform hover:scale-105 transition-all duration-300 shadow-xl order-1 md:order-2">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-slate-600 font-bold text-sm">
                        🥈
                      </span>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="w-16 h-16 bg-white/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=runner1"
                        alt="Runner 1"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <h4 className="font-bold text-lg">AlgoNinja</h4>
                    <p className="text-slate-600 text-sm mb-2">
                      Advanced Level
                    </p>
                    <div className="bg-white/30 rounded-lg p-3">
                      <div className="text-xs text-slate-600">Best Time</div>
                      <div className="text-lg font-bold">52ms</div>
                      <div className="text-xs text-slate-600">
                        Memory: 1.3MB
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Place */}
                <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl order-3">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-amber-800 font-bold text-sm">
                        🥉
                      </span>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=runner2"
                        alt="Runner 2"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <h4 className="font-bold text-lg">PyThonista</h4>
                    <p className="text-amber-200 text-sm mb-2">
                      Advanced Level
                    </p>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-xs text-amber-200">Best Time</div>
                      <div className="text-lg font-bold">61ms</div>
                      <div className="text-xs text-amber-200">
                        Memory: 1.4MB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  📋 Full Rankings
                </h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="fastest">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fastest">Fastest Time</SelectItem>
                      <SelectItem value="memory">Lowest Memory</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Language
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Runtime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Memory
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {[
                        {
                          rank: 1,
                          user: "CodeMaster2024",
                          level: "Expert",
                          avatar: "champion1",
                          lang: "C++17",
                          runtime: "47ms",
                          memory: "1.2MB",
                          time: "2 hours ago",
                          badge: "🥇",
                        },
                        {
                          rank: 2,
                          user: "AlgoNinja",
                          level: "Advanced",
                          avatar: "runner1",
                          lang: "Python 3",
                          runtime: "52ms",
                          memory: "1.3MB",
                          time: "3 hours ago",
                          badge: "🥈",
                        },
                        {
                          rank: 3,
                          user: "PyThonista",
                          level: "Advanced",
                          avatar: "runner2",
                          lang: "Java 17",
                          runtime: "61ms",
                          memory: "1.4MB",
                          time: "5 hours ago",
                          badge: "🥉",
                        },
                        {
                          rank: 4,
                          user: "DevGuru",
                          level: "Intermediate",
                          avatar: "user4",
                          lang: "TypeScript",
                          runtime: "73ms",
                          memory: "1.5MB",
                          time: "6 hours ago",
                          badge: "🔥",
                        },
                        {
                          rank: 5,
                          user: "CodeNinja99",
                          level: "Intermediate",
                          avatar: "user5",
                          lang: "C++17",
                          runtime: "89ms",
                          memory: "1.6MB",
                          time: "8 hours ago",
                          badge: "⚡",
                        },
                        {
                          rank: 6,
                          user: "FastCoder",
                          level: "Beginner",
                          avatar: "user6",
                          lang: "Python 3",
                          runtime: "94ms",
                          memory: "1.7MB",
                          time: "1 day ago",
                          badge: "💪",
                        },
                        {
                          rank: 7,
                          user: "QuickSolver",
                          level: "Beginner",
                          avatar: "user7",
                          lang: "JavaScript",
                          runtime: "108ms",
                          memory: "1.8MB",
                          time: "1 day ago",
                          badge: "🚀",
                        },
                        {
                          rank: 8,
                          user: "BugHunter",
                          level: "Intermediate",
                          avatar: "user8",
                          lang: "C# 10",
                          runtime: "115ms",
                          memory: "1.9MB",
                          time: "2 days ago",
                          badge: "🎯",
                        },
                      ].map((entry) => (
                        <tr
                          key={entry.rank}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                #{entry.rank}
                              </span>
                              <span className="text-lg">{entry.badge}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.avatar}`}
                                alt={entry.user}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                  {entry.user}
                                </div>
                                <div
                                  className={`text-xs ${
                                    entry.level === "Expert"
                                      ? "text-purple-600 dark:text-purple-400"
                                      : entry.level === "Advanced"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : entry.level === "Intermediate"
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                >
                                  {entry.level}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.lang.includes("C++")
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : entry.lang.includes("Python")
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : entry.lang.includes("Java")
                                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                      : entry.lang.includes("JavaScript") ||
                                          entry.lang.includes("TypeScript")
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              }`}
                            >
                              {entry.lang}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                            {entry.runtime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono">
                            {entry.memory}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {entry.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Load More Button */}
              <div className="text-center mt-6">
                <Button variant="outline" className="px-8">
                  Load More Rankings
                </Button>
              </div>
            </div>
          </div>
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
        {/* Simple Problem Title Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
            {problem.title}
          </h1>
          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                problem.difficulty === "Dễ"
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                  : problem.difficulty === "Trung bình"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    : "bg-gradient-to-r from-red-400 to-red-500 text-white"
              }`}
            >
              {problem.difficulty}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <Timer className="w-4 h-4" />
              2.0s time limit
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <MemoryStick className="w-4 h-4" />
              256MB memory
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4" />
              {problem.points} điểm
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
