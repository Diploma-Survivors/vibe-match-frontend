"use client";

import { CodeEditorNew } from "@/components/editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Code2,
    Lightbulb,
    MemoryStick,
    Play,
    PlayCircle,
    RotateCcw,
    Save,
    Target,
    TestTube,
    TrendingUp,
    XCircle,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    userOutput?: string;
    status?: "passed" | "failed" | "running" | "pending";
    executionTime?: number;
    memoryUsage?: number;
    isHidden?: boolean;
}

interface ExecutionResult {
    output: string;
    executionTime: number;
    memoryUsage: number;
    error?: string;
}

const LANGUAGES = [
    { value: "python", label: "Python", extension: "py" },
    { value: "javascript", label: "JavaScript", extension: "js" },
    { value: "cpp", label: "C++", extension: "cpp" },
    { value: "java", label: "Java", extension: "java" },
    { value: "typescript", label: "TypeScript", extension: "ts" },
];

const DEFAULT_CODE = {
    python: `# Enter your Python code here
def solution(nums):
    # Your implementation
    return sum(nums)

# Test your function
if __name__ == "__main__":
    test_input = [1, 2, 3, 4, 5]
    result = solution(test_input)
    print(result)`,
    javascript: `// Enter your JavaScript code here
function solution(nums) {
    // Your implementation
    return nums.reduce((sum, num) => sum + num, 0);
}

// Test your function
const testInput = [1, 2, 3, 4, 5];
const result = solution(testInput);
console.log(result);`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int solution(vector<int>& nums) {
    // Your implementation
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }
    return sum;
}

int main() {
    vector<int> testInput = {1, 2, 3, 4, 5};
    int result = solution(testInput);
    cout << result << endl;
    return 0;
}`,
    java: `public class Solution {
    public static int solution(int[] nums) {
        // Your implementation
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        return sum;
    }
    
    public static void main(String[] args) {
        int[] testInput = {1, 2, 3, 4, 5};
        int result = solution(testInput);
        System.out.println(result);
    }
}`,
    typescript: `// Enter your TypeScript code here
function solution(nums: number[]): number {
    // Your implementation
    return nums.reduce((sum, num) => sum + num, 0);
}

// Test your function
const testInput: number[] = [1, 2, 3, 4, 5];
const result = solution(testInput);
console.log(result);`,
};

const DEFAULT_TEST_CASES: TestCase[] = [
    {
        id: "1",
        input: "[1, 2, 3, 4, 5]",
        expectedOutput: "15",
    },
    {
        id: "2",
        input: "[10, -5, 3]",
        expectedOutput: "8",
    },
    {
        id: "3",
        input: "[]",
        expectedOutput: "0",
    },
    {
        id: "hidden1",
        input: "[1, 1, 1, 1]",
        expectedOutput: "4",
        isHidden: true,
    },
    {
        id: "hidden2",
        input: "[-1, -2, -3]",
        expectedOutput: "-6",
        isHidden: true,
    },
];

export default function TestPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("python");
    const [code, setCode] = useState(DEFAULT_CODE.python);
    const [customInput, setCustomInput] = useState("");
    const [testCases, setTestCases] = useState<TestCase[]>(DEFAULT_TEST_CASES);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState("editor");
    const [autoSaved, setAutoSaved] = useState(false);

    // Auto-save functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(`test-code-${selectedLanguage}`, code);
            setAutoSaved(true);
            setTimeout(() => setAutoSaved(false), 2000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [code, selectedLanguage]);

    // Load saved code
    useEffect(() => {
        const savedCode = localStorage.getItem(`test-code-${selectedLanguage}`);
        if (savedCode) {
            setCode(savedCode);
        } else {
            setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE]);
        }
    }, [selectedLanguage]);

    const simulateCodeExecution = async (
        input: string
    ): Promise<ExecutionResult> => {
        // Simulate network delay
        await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 1000 + 500)
        );

        // Mock execution results
        const executionTime = Math.random() * 100 + 10;
        const memoryUsage = Math.random() * 50 + 10;

        // Simple simulation for sum function
        try {
            const nums = JSON.parse(input);
            if (Array.isArray(nums)) {
                const output = nums
                    .reduce((sum: number, num: number) => sum + num, 0)
                    .toString();
                return {
                    output,
                    executionTime,
                    memoryUsage,
                };
            }
        } catch (error) {
            return {
                output: "",
                executionTime,
                memoryUsage,
                error: "Invalid input format",
            };
        }

        return {
            output: "Error: Could not parse input",
            executionTime,
            memoryUsage,
            error: "Parse error",
        };
    };

    const runSingleTest = async (testCase: TestCase) => {
        setTestCases((prev) =>
            prev.map((tc) =>
                tc.id === testCase.id ? { ...tc, status: "running" } : tc
            )
        );

        try {
            const result = await simulateCodeExecution(testCase.input);

            const status = result.error
                ? "failed"
                : result.output.trim() === testCase.expectedOutput.trim()
                    ? "passed"
                    : "failed";

            setTestCases((prev) =>
                prev.map((tc) =>
                    tc.id === testCase.id
                        ? {
                            ...tc,
                            status,
                            userOutput: result.output,
                            executionTime: result.executionTime,
                            memoryUsage: result.memoryUsage,
                        }
                        : tc
                )
            );
        } catch (error) {
            setTestCases((prev) =>
                prev.map((tc) =>
                    tc.id === testCase.id
                        ? {
                            ...tc,
                            status: "failed",
                            userOutput: "Runtime Error",
                            executionTime: 0,
                            memoryUsage: 0,
                        }
                        : tc
                )
            );
        }
    };

    const runAllTests = async () => {
        setIsRunning(true);

        // Reset all test cases
        setTestCases((prev) =>
            prev.map((tc) => ({ ...tc, status: "pending" as const }))
        );

        // Run tests sequentially
        for (const testCase of testCases) {
            await runSingleTest(testCase);
        }

        setIsRunning(false);
    };

    const runCustomInput = async () => {
        if (!customInput.trim()) return;

        try {
            const result = await simulateCodeExecution(customInput);
            console.log("Custom input result:", result);
        } catch (error) {
            console.error("Error running custom input:", error);
        }
    };

    const resetCode = () => {
        setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE]);
        localStorage.removeItem(`test-code-${selectedLanguage}`);
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "passed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "running":
                return (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                );
            default:
                return (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                );
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "passed":
                return "bg-green-50 border-green-200";
            case "failed":
                return "bg-red-50 border-red-200";
            case "running":
                return "bg-blue-50 border-blue-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const passedTests = testCases.filter((tc) => tc.status === "passed").length;
    const totalTests = testCases.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        🚀 Code Testing Lab
                    </h1>
                    <p className="text-gray-600">
                        Test your code with custom inputs and advanced analysis
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">
                                {passedTests}/{totalTests} Passed
                            </span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Performance Ready</span>
                        </motion.div>
                        {autoSaved && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200"
                            >
                                <Save className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-green-700">
                                    Auto-saved
                                </span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border">
                        <TabsTrigger
                            value="editor"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                            <Code2 className="w-4 h-4" />
                            Code Editor
                        </TabsTrigger>
                        <TabsTrigger
                            value="tests"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
                        >
                            <TestTube className="w-4 h-4" />
                            Test Cases
                        </TabsTrigger>
                        <TabsTrigger
                            value="results"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                                            <span className="font-medium text-gray-700">
                                                Language:
                                            </span>
                                        </div>
                                        <Select
                                            value={selectedLanguage}
                                            onValueChange={setSelectedLanguage}
                                        >
                                            <SelectTrigger className="w-48 bg-white/90">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LANGUAGES.map((lang) => (
                                                    <SelectItem key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                variant="outline"
                                                onClick={resetCode}
                                                className="bg-white/90"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Reset
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={runAllTests}
                                                disabled={isRunning}
                                                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                {isRunning ? "Running..." : "Run All Tests"}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden shadow-inner">
                                    <CodeEditorNew
                                        language={selectedLanguage}
                                        value={code}
                                        onChange={setCode}
                                        height="400px"
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                                        <PlayCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Custom Input Testing
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <textarea
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder="Enter your custom input here (e.g., [1, 2, 3, 4, 5])"
                                        className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                                    />
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={runCustomInput}
                                            variant="outline"
                                            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-none hover:from-orange-500 hover:to-pink-600"
                                        >
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                            Run Custom Input
                                        </Button>
                                    </motion.div>
                                </div>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="tests" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                                            <TestTube className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Test Cases</h3>
                                            <p className="text-sm text-gray-600">
                                                {passedTests}/{totalTests} tests passed
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-green-400 to-teal-500"
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(passedTests / totalTests) * 100}%`,
                                                    }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">
                                                {Math.round((passedTests / totalTests) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={runAllTests}
                                            disabled={isRunning}
                                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {isRunning ? "Running..." : "Run All"}
                                        </Button>
                                    </motion.div>
                                </div>

                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {testCases.map((testCase, index) => (
                                            <motion.div
                                                key={testCase.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <Card
                                                    className={`p-4 border transition-all duration-200 hover:shadow-md ${getStatusColor(testCase.status)}`}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <motion.div
                                                                animate={
                                                                    testCase.status === "running"
                                                                        ? { rotate: 360 }
                                                                        : { rotate: 0 }
                                                                }
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat:
                                                                        testCase.status === "running"
                                                                            ? Number.POSITIVE_INFINITY
                                                                            : 0,
                                                                }}
                                                            >
                                                                {getStatusIcon(testCase.status)}
                                                            </motion.div>
                                                            <span className="font-medium">
                                                                {testCase.isHidden
                                                                    ? `🔒 Hidden Test Case ${index + 1}`
                                                                    : `📝 Test Case ${index + 1}`}
                                                            </span>
                                                            {testCase.isHidden && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-purple-100 text-purple-700"
                                                                >
                                                                    Hidden
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => runSingleTest(testCase)}
                                                                disabled={testCase.status === "running"}
                                                                className="bg-white/90"
                                                            >
                                                                <PlayCircle className="w-4 h-4 mr-1" />
                                                                Run
                                                            </Button>
                                                        </motion.div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                                <span>📥</span> Input:
                                                            </div>
                                                            <div className="bg-white p-2 rounded border font-mono text-blue-600">
                                                                {testCase.input}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                                <span>✅</span> Expected:
                                                            </div>
                                                            <div className="bg-white p-2 rounded border font-mono text-green-600">
                                                                {testCase.isHidden &&
                                                                    testCase.status !== "passed" &&
                                                                    testCase.status !== "failed"
                                                                    ? "***"
                                                                    : testCase.expectedOutput}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                                <span>📤</span> Your Output:
                                                            </div>
                                                            <div
                                                                className={`bg-white p-2 rounded border font-mono ${testCase.status === "passed"
                                                                        ? "text-green-600"
                                                                        : testCase.status === "failed"
                                                                            ? "text-red-600"
                                                                            : ""
                                                                    }`}
                                                            >
                                                                {testCase.userOutput || "-"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {testCase.executionTime && (
                                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                            <motion.div
                                                                className="flex items-center gap-1"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                                {testCase.executionTime.toFixed(2)}ms
                                                            </motion.div>
                                                            <motion.div
                                                                className="flex items-center gap-1"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                <MemoryStick className="w-4 h-4" />
                                                                {testCase.memoryUsage?.toFixed(2)}MB
                                                            </motion.div>
                                                        </div>
                                                    )}

                                                    <AnimatePresence>
                                                        {testCase.status === "failed" && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-2 text-yellow-700">
                                                                    <Lightbulb className="w-4 h-4" />
                                                                    <span className="font-medium">
                                                                        💡 Debug Hint:
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-yellow-600 mt-1">
                                                                    Check your logic for edge cases and ensure
                                                                    your function handles all input types
                                                                    correctly.
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="results" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative overflow-hidden"
                            >
                                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <motion.div
                                                className="text-3xl font-bold text-green-600"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    delay: 0.2,
                                                }}
                                            >
                                                {passedTests}
                                            </motion.div>
                                            <div className="text-sm text-green-700 font-medium">
                                                Tests Passed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-green-600">
                                        {passedTests === totalTests
                                            ? "🎉 Perfect Score!"
                                            : "Keep going!"}
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative overflow-hidden"
                            >
                                <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-xl flex items-center justify-center">
                                            <XCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <motion.div
                                                className="text-3xl font-bold text-red-600"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    delay: 0.3,
                                                }}
                                            >
                                                {totalTests - passedTests}
                                            </motion.div>
                                            <div className="text-sm text-red-700 font-medium">
                                                Tests Failed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-red-600">
                                        {totalTests - passedTests === 0
                                            ? "No failures!"
                                            : "Review & improve"}
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative overflow-hidden"
                            >
                                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <motion.div
                                                className="text-3xl font-bold text-blue-600"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    delay: 0.4,
                                                }}
                                            >
                                                {testCases.filter((tc) => tc.executionTime).length > 0
                                                    ? Math.max(
                                                        ...testCases
                                                            .filter((tc) => tc.executionTime)
                                                            .map((tc) => tc.executionTime || 0)
                                                    ).toFixed(0)
                                                    : "0"}
                                                ms
                                            </motion.div>
                                            <div className="text-sm text-blue-700 font-medium">
                                                Max Time
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        {testCases.some(
                                            (tc) => tc.executionTime && tc.executionTime > 50
                                        )
                                            ? "⚠️ Consider optimization"
                                            : "🚀 Fast execution"}
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm border shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">
                                        Performance Analysis
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {testCases.some(
                                            (tc) => tc.executionTime && tc.executionTime > 50
                                        ) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span className="font-medium">
                                                            ⚠️ Performance Warning
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-yellow-600">
                                                        Some test cases are taking longer than expected.
                                                        Consider optimizing your algorithm for better
                                                        performance.
                                                    </p>
                                                </motion.div>
                                            )}
                                    </AnimatePresence>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                                            <Lightbulb className="w-5 h-5" />
                                            <span className="font-medium">💡 Optimization Tips</span>
                                        </div>
                                        <ul className="text-sm text-blue-600 space-y-1">
                                            <li>• Consider using more efficient data structures</li>
                                            <li>
                                                • Look for opportunities to reduce time complexity
                                            </li>
                                            <li>• Check for redundant operations in loops</li>
                                            <li>• Consider edge cases and error handling</li>
                                        </ul>
                                    </motion.div>

                                    {passedTests === totalTests && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center"
                                        >
                                            <div className="text-2xl mb-2">🎉</div>
                                            <div className="font-bold text-green-700 mb-1">
                                                Congratulations!
                                            </div>
                                            <div className="text-sm text-green-600">
                                                All test cases passed successfully!
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
