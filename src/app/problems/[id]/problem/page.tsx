// src/app/problems/[id]/problem/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { mockProblems } from "@/lib/data/mock-problems";
import { Copy, Timer, MemoryStick, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProblemSidebar } from "@/components/problem";

export default function ProblemDescriptionPage() {
    const params = useParams();
    const problemId = params.id as string;
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const problem = mockProblems.find((p) => p.id === problemId);

    if (!problem) return null;

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Sample test cases
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Problem Description */}
            <div className="lg:col-span-8 xl:col-span-9">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <div className="p-8 space-y-8">
                        {/* Problem Title Header */}
                        <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                                {problem.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${problem.difficulty === "Dễ"
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
                                    Cho số nguyên dương <strong>N</strong>, liệt kê phi hàm euler
                                    của các số từ 1 tới N và in ra màn hình.
                                </p>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                                    Phi hàm euler của số <strong>X</strong> hiển số lượng số
                                    nguyên tố cùng nhau với <strong>X</strong> nằm trong khoảng từ
                                    [1, X].
                                </p>
                            </div>
                        </section>

                        {/* Input Format */}
                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                Đầu vào
                            </h2>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-700 dark:text-slate-300">
                                    • Số nguyên N
                                </p>
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
                                                onClick={() =>
                                                    copyToClipboard(testCase.input, index * 2)
                                                }
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
            </div>

            {/* Right Column - Problem Sidebar (only for problem tab) */}
            <div className="lg:col-span-4 xl:col-span-3">
                <ProblemSidebar problem={problem} />
            </div>
        </div>
    );
}
