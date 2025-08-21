"use client";

import { CodeEditorNew } from "@/components/editor";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Code2,
    Copy,
    Maximize2,
    Monitor,
    Moon,
    Play,
    RotateCcw,
    Save,
    Settings,
    Sun,
    Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";

const PROGRAMMING_LANGUAGES = [
    {
        value: "python",
        label: "Python 3",
        extension: ".py",
        defaultCode: `# Your Python code here
def solution():
    # Read input
    n = int(input())
    
    # Your logic here
    result = n * 2
    print(result)

if __name__ == "__main__":
    solution()`,
    },
    {
        value: "cpp",
        label: "C++17",
        extension: ".cpp",
        defaultCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Your code here
    cout << n * 2 << endl;
    
    return 0;
}`,
    },
    {
        value: "java",
        label: "Java 17",
        extension: ".java",
        defaultCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        // Your code here
        System.out.println(n * 2);
        
        scanner.close();
    }
}`,
    },
    {
        value: "javascript",
        label: "JavaScript",
        extension: ".js",
        defaultCode: `// Your JavaScript code here
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (input) => {
    const n = parseInt(input);
    
    // Your logic here
    console.log(n * 2);
    
    rl.close();
});`,
    },
];

const themes = [
    {
        value: "light",
        label: "Light",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        icon: Moon,
    },
    {
        value: "system",
        label: "System",
        icon: Monitor,
    },
];

export default function TestPageContent() {
    const { theme, setTheme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState("python");
    const [code, setCode] = useState(PROGRAMMING_LANGUAGES[0].defaultCode);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        const langConfig = PROGRAMMING_LANGUAGES.find(
            (lang) => lang.value === language
        );
        if (langConfig) {
            setCode(langConfig.defaultCode);
        }
        setOutput(""); // Clear output when changing language
    };

    const resetCode = () => {
        const langConfig = PROGRAMMING_LANGUAGES.find(
            (lang) => lang.value === selectedLanguage
        );
        if (langConfig) {
            setCode(langConfig.defaultCode);
        }
        setOutput("");
        setInput("");
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file size (256KB = 262144 bytes)
            if (file.size > 262144) {
                alert("File size must be less than 256KB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setInput(content);
            };
            reader.readAsText(file);
        }
    };

    const runCode = async () => {
        if (!code.trim()) {
            setOutput("Error: No code to run");
            return;
        }

        setIsRunning(true);
        setOutput("Running...");

        // Simulate code execution
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock output based on language and input
            let mockOutput = "";
            if (input.trim()) {
                mockOutput = `Input received: ${input.trim()}\n`;
            }

            switch (selectedLanguage) {
                case "python":
                    mockOutput +=
                        "Python code executed successfully!\nOutput: Hello from Python";
                    break;
                case "cpp":
                    mockOutput +=
                        "C++ code compiled and executed!\nOutput: Hello from C++";
                    break;
                case "java":
                    mockOutput +=
                        "Java code compiled and executed!\nOutput: Hello from Java";
                    break;
                case "javascript":
                    mockOutput +=
                        "JavaScript code executed!\nOutput: Hello from JavaScript";
                    break;
                default:
                    mockOutput += "Code executed successfully!";
            }

            mockOutput += `\nExecution time: ${Math.floor(Math.random() * 1000)}ms`;
            setOutput(mockOutput);
        } catch (error) {
            setOutput(`Error: ${error}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex h-full p-4">
                    {/* Left Panel - Code Editor */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mr-4">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Code2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        Test Code Editor
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Write and test your solution
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Language Selector */}
                                <Select
                                    value={selectedLanguage}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAMMING_LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${lang.value === "python"
                                                                ? "bg-blue-500"
                                                                : lang.value === "cpp"
                                                                    ? "bg-red-500"
                                                                    : lang.value === "java"
                                                                        ? "bg-orange-500"
                                                                        : lang.value === "javascript"
                                                                            ? "bg-yellow-500"
                                                                            : "bg-purple-500"
                                                            }`}
                                                    />
                                                    {lang.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Theme Selector */}
                                <Select value={theme} onValueChange={handleThemeChange}>
                                    <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {themes.map((themeOption) => (
                                            <SelectItem
                                                key={themeOption.value}
                                                value={themeOption.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <themeOption.icon className="w-3 h-3" />
                                                    {themeOption.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyCode}
                                        className="border-slate-200 dark:border-slate-700"
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Copy
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetCode}
                                        className="border-slate-200 dark:border-slate-700"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        Reset
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-slate-200 dark:border-slate-700"
                                    >
                                        <Settings className="w-4 h-4 mr-1" />
                                        Settings
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-slate-200 dark:border-slate-700"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Tab Bar */}
                        <div className="flex items-center bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-750 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                            <div className="flex items-center min-w-0 flex-1">
                                <button
                                    type="button"
                                    className="group relative flex items-center gap-2 px-4 py-3 cursor-pointer transition-all duration-200 border-r border-slate-200 dark:border-slate-700 min-w-0 border-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                                >
                                    {/* Tab Indicator */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600" />

                                    {/* Tab Icon */}
                                    <span className="text-sm flex-shrink-0">
                                        {selectedLanguage === "python"
                                            ? "🐍"
                                            : selectedLanguage === "cpp"
                                                ? "⚡"
                                                : selectedLanguage === "java"
                                                    ? "☕"
                                                    : selectedLanguage === "javascript"
                                                        ? "🟡"
                                                        : "📄"}
                                    </span>

                                    {/* Tab Name */}
                                    <span className="text-sm font-medium truncate min-w-0">
                                        Solution
                                        {PROGRAMMING_LANGUAGES.find(
                                            (lang) => lang.value === selectedLanguage
                                        )?.extension || ".py"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 relative">
                            <CodeEditorNew
                                language={selectedLanguage}
                                value={code}
                                onChange={setCode}
                                height="100%"
                                theme="vs-dark"
                            />
                        </div>

                        {/* Footer with Status Info */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-4">
                                    <span>Lines: {code.split("\n").length}</span>
                                    <span>Chars: {code.length}</span>
                                    <span>
                                        Language:{" "}
                                        {
                                            PROGRAMMING_LANGUAGES.find(
                                                (lang) => lang.value === selectedLanguage
                                            )?.label
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                        Ready
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Test Controls */}
                    <div className="w-80 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Input Section */}
                        <div className="flex-1 flex flex-col">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                                            <Upload className="w-3 h-3 text-white" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            Test Input
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".txt,.in"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-7 px-2 text-xs border-slate-200 dark:border-slate-700"
                                        >
                                            <Upload className="w-3 h-3 mr-1" />
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-4">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter your test input here..."
                                    className="w-full h-full p-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Max file size: 256KB
                                </p>
                            </div>
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 flex flex-col border-t border-slate-200 dark:border-slate-700">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center">
                                        <Code2 className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Output
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-1 p-4">
                                <div className="w-full h-full p-3 bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-auto">
                                    <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                                        {output ||
                                            "Output will appear here after running your code..."}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Run Button Section */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
                                    <span>Ready to run</span>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                </div>
                                <div className="text-xs text-slate-500">
                                    {selectedLanguage === "python"
                                        ? "🐍"
                                        : selectedLanguage === "cpp"
                                            ? "⚡"
                                            : selectedLanguage === "java"
                                                ? "☕"
                                                : selectedLanguage === "javascript"
                                                    ? "🟡"
                                                    : "📄"}
                                    {
                                        PROGRAMMING_LANGUAGES.find(
                                            (lang) => lang.value === selectedLanguage
                                        )?.label
                                    }
                                </div>
                            </div>
                            <Button
                                onClick={runCode}
                                disabled={isRunning}
                                className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg"
                            >
                                {isRunning ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Run Code
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
