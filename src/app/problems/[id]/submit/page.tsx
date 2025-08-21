// src/app/problems/[id]/submit/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { MonacoSubmitEditor } from "@/components/editor";
import { mockProblems } from "@/lib/data/mock-problems";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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
    Plus,
    Search,
    Send,
    Share,
    Sparkles,
    TestTube,
    Timer,
    X,
    XCircle,
} from "lucide-react";

export default function SubmitPage() {
    const params = useParams();
    const problemId = params.id as string;
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState("");

    const problem = mockProblems.find((p) => p.id === problemId);
    const [activeTestCase, setActiveTestCase] = useState(0);

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

    const handleQuickAction = (action: string) => {
        const messages = {
            explain: "Hãy giải thích thuật toán cho bài này",
            hint: "Cho tôi gợi ý code để giải bài này",
            optimize: "Làm thế nào để tối ưu hóa solution này?",
        };

        handleAiMessage(messages[action as keyof typeof messages] || action);
    };

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

    const handleTestCaseAdd = () => {
        const newTestCase = {
            id: Date.now(),
            input: "",
            output: "",
            isEditing: true,
        };
        setTestCases((prev) => [...prev, newTestCase]);
        setActiveTestCase(testCases.length); // Set to the new test case
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

    const handleTestCaseSave = (id: number) => {
        // Here you can add any validation if needed
        handleTestCaseEdit(id);
    };

    // Test Cases Functions
    const handleTestCaseChange = (
        id: number,
        field: "input" | "output",
        value: string
    ) => {
        setTestCases((prev) =>
            prev.map((testCase) =>
                testCase.id === id ? { ...testCase, [field]: value } : testCase
            )
        );
    };

    const handleTestCaseEdit = (id: number) => {
        setTestCases((prev) =>
            prev.map((testCase) =>
                testCase.id === id
                    ? { ...testCase, isEditing: !testCase.isEditing }
                    : testCase
            )
        );
    };

    const handleTestCaseDelete = (id: number) => {
        setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
        // Adjust active test case if necessary
        if (activeTestCase >= testCases.length - 1) {
            setActiveTestCase(Math.max(0, testCases.length - 2));
        }
    };

    // Sample Test Cases state
    const [testCases, setTestCases] = useState([
        {
            id: 1,
            input: "5",
            output: "1 1 2 1 4",
            isEditing: false,
        },
        {
            id: 2,
            input: "10",
            output: "1 1 2 1 4 2 6 1 6 2",
            isEditing: false,
        },
        {
            id: 3,
            input: "3",
            output: "1 1 2",
            isEditing: false,
        },
    ]);

    if (!problem) return null;

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running...");

        setTimeout(() => {
            setOutput(
                "Sample Input: 5\\nSample Output: 1 1 2 3 5\\n\\nExecution time: 0.12s\\nMemory used: 2.4 MB\\n\\n✅ Test passed!"
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
                `✅ Submission #${newSubmission.id} completed!\n\nStatus: ${newSubmission.status
                }\nRuntime: ${newSubmission.runtime}\nMemory: ${newSubmission.memory
                }\nScore: ${newSubmission.score
                }/100\n\nTest case 1: Passed (0.08s)\nTest case 2: Passed (0.12s)\nTest case 3: ${newSubmission.status === "Accepted" ? "Passed" : "Failed"
                } (0.15s)`
            );
            setIsSubmitting(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-0 py-0">
                {/* Main Content - Two Columns */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Code Editor */}
                    <div className="xl:col-span-2 space-y-6">
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

                        {/* Sample Test Cases Section */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <TestTube className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                Sample Test Cases
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Test your code with these examples
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
                                    >
                                        {isRunning ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Test Run
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Test Case Tabs */}
                                <div className="flex items-center gap-2 mb-6 overflow-x-auto">
                                    {testCases.map((testCase, index) => (
                                        <button
                                            key={testCase.id}
                                            onClick={() => setActiveTestCase(index)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTestCase === index
                                                    ? "bg-blue-500 text-white shadow-md"
                                                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                                                }`}
                                        >
                                            Case {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleTestCaseAdd}
                                        className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-sm font-medium">Add</span>
                                    </button>
                                </div>

                                {/* Active Test Case Content */}
                                {testCases[activeTestCase] && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Input Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    <span className="text-blue-500">📥</span>
                                                    Input
                                                </h4>
                                                {testCases.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleTestCaseDelete(testCases[activeTestCase].id)
                                                        }
                                                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                            {testCases[activeTestCase].isEditing ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={testCases[activeTestCase].input}
                                                        onChange={(e) =>
                                                            handleTestCaseChange(
                                                                testCases[activeTestCase].id,
                                                                "input",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter input values..."
                                                        className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleTestCaseSave(testCases[activeTestCase].id)
                                                            }
                                                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleTestCaseEdit(testCases[activeTestCase].id)
                                                            }
                                                            className="text-xs"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        handleTestCaseEdit(testCases[activeTestCase].id)
                                                    }
                                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            Click to edit
                                                        </span>
                                                        <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                                                    </div>
                                                    <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                                        {testCases[activeTestCase].input ||
                                                            "Enter input..."}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>

                                        {/* Output Section */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <span className="text-green-500">📤</span>
                                                Expected Output
                                            </h4>
                                            {testCases[activeTestCase].isEditing ? (
                                                <textarea
                                                    value={testCases[activeTestCase].output}
                                                    onChange={(e) =>
                                                        handleTestCaseChange(
                                                            testCases[activeTestCase].id,
                                                            "output",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter expected output..."
                                                    className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        handleTestCaseEdit(testCases[activeTestCase].id)
                                                    }
                                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            Click to edit
                                                        </span>
                                                        <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                                                    </div>
                                                    <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                                        {testCases[activeTestCase].output ||
                                                            "Enter expected output..."}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Test Case Navigation */}
                                {testCases.length > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setActiveTestCase(Math.max(0, activeTestCase - 1))
                                            }
                                            disabled={activeTestCase === 0}
                                            className="flex items-center gap-2"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {activeTestCase + 1} of {testCases.length}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setActiveTestCase(
                                                    Math.min(testCases.length - 1, activeTestCase + 1)
                                                )
                                            }
                                            disabled={activeTestCase === testCases.length - 1}
                                            className="flex items-center gap-2"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
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
                                                        Xin chào! Tôi là AI Assistant. Tôi có thể giúp bạn:
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
                                                className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""
                                                    }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${message.role === "user"
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
                                                    className={`bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 shadow-sm max-w-[90%] ${message.role === "user"
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
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${submission.status === "Accepted"
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : submission.status === "Wrong Answer"
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                    : submission.status === "Time Limit Exceeded"
                                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                            }`}
                                                    >
                                                        {submission.status === "Accepted" ? (
                                                            <CheckCircle className="w-3 h-3" />
                                                        ) : submission.status === "Wrong Answer" ? (
                                                            <XCircle className="w-3 h-3" />
                                                        ) : submission.status === "Time Limit Exceeded" ? (
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
