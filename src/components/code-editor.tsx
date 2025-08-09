"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import {
  Brain,
  Clock,
  Code2,
  Copy,
  Download,
  Lightbulb,
  Maximize2,
  Play,
  RotateCcw,
  Save,
  Send,
  Settings,
  TestTube,
  Upload,
} from "lucide-react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

const languages = [
  {
    value: "python",
    label: "Python 3",
    extension: ".py",
    monacoLang: "python",
  },
  { value: "cpp", label: "C++17", extension: ".cpp", monacoLang: "cpp" },
  { value: "java", label: "Java 17", extension: ".java", monacoLang: "java" },
  {
    value: "javascript",
    label: "JavaScript",
    extension: ".js",
    monacoLang: "javascript",
  },
  { value: "csharp", label: "C# 10", extension: ".cs", monacoLang: "csharp" },
  {
    value: "typescript",
    label: "TypeScript",
    extension: ".ts",
    monacoLang: "typescript",
  },
];

const defaultCode = {
  python: `# Nhập N từ bàn phím
n = int(input())

# Code của bạn ở đây
for i in range(1, n + 1):
    print(i, end=" ")
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    // Code của bạn ở đây
    for (int i = 1; i <= n; i++) {
        cout << i << " ";
    }
    
    return 0;
}`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // Code của bạn ở đây
        for (int i = 1; i <= n; i++) {
            System.out.print(i + " ");
        }
        
        sc.close();
    }
}`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (n) => {
    n = parseInt(n);
    
    // Code của bạn ở đây
    for (let i = 1; i <= n; i++) {
        process.stdout.write(i + " ");
    }
    
    rl.close();
});`,
  csharp: `using System;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine());
        
        // Code của bạn ở đây
        for (int i = 1; i <= n; i++) {
            Console.Write(i + " ");
        }
    }
}`,
  typescript: `// TypeScript code
const n: number = parseInt(prompt("Enter N:") || "0");

// Code của bạn ở đây
for (let i = 1; i <= n; i++) {
    console.log(i);
}`,
};

export default function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);
  const [theme, setTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
  };

  const handleReset = () => {
    setCode(defaultCode[selectedLanguage as keyof typeof defaultCode]);
  };

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editorInstance;

    // Configure editor options
    editorInstance.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      lineNumbers: "on",
      folding: true,
      bracketPairColorization: { enabled: true },
      renderWhitespace: "boundary",
      cursorBlinking: "smooth",
      smoothScrolling: true,
    });

    // Add custom themes
    monaco.editor.defineTheme("vibrant-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
      ],
      colors: {
        "editor.background": "#0f172a",
        "editor.foreground": "#e2e8f0",
        "editorLineNumber.foreground": "#64748b",
        "editorLineNumber.activeForeground": "#f1f5f9",
        "editor.selectionBackground": "#1e40af40",
        "editor.lineHighlightBackground": "#1e293b40",
      },
    });

    monaco.editor.defineTheme("vibrant-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "008000", fontStyle: "italic" },
        { token: "keyword", foreground: "0000ff", fontStyle: "bold" },
        { token: "string", foreground: "a31515" },
        { token: "number", foreground: "098658" },
        { token: "type", foreground: "267f99" },
        { token: "function", foreground: "795e26" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",
        "editorLineNumber.foreground": "#237893",
        "editor.selectionBackground": "#add6ff",
        "editor.lineHighlightBackground": "#f0f0f0",
      },
    });
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Running code...\n");

    // Simulate code execution
    setTimeout(() => {
      setOutput("1 2 3 4 5 \n\n✅ Execution completed successfully");
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setOutput("Submitting code...\n");

    // Simulate code submission
    setTimeout(() => {
      setOutput(
        "✅ Code submitted successfully!\n\nResult: Accepted\nTime: 142ms\nMemory: 2.1MB"
      );
      setIsSubmitting(false);
    }, 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const lang = languages.find((l) => l.value === selectedLanguage);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution${lang?.extension || ".txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.value === selectedLanguage)?.monacoLang ||
      "python"
    );
  };
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl h-full flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white/40 to-slate-50/40 dark:from-slate-800/40 dark:to-slate-900/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Advanced Code Editor
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Monaco Editor với AI-powered features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              <Clock className="w-3 h-3 mr-1" />
              Auto-save
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-slate-600 dark:text-slate-400"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-44 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          lang.value === "python"
                            ? "bg-blue-500"
                            : lang.value === "cpp"
                              ? "bg-red-500"
                              : lang.value === "java"
                                ? "bg-orange-500"
                                : lang.value === "javascript"
                                  ? "bg-yellow-500"
                                  : lang.value === "csharp"
                                    ? "bg-purple-500"
                                    : "bg-cyan-500"
                        }`}
                      />
                      {lang.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>

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
                onClick={downloadCode}
                className="border-slate-200 dark:border-slate-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-dark">Dark</SelectItem>
                <SelectItem value="vs">Light</SelectItem>
                <SelectItem value="vibrant-dark">Vibrant Dark</SelectItem>
                <SelectItem value="vibrant-light">Vibrant Light</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={fontSize.toString()}
              onValueChange={(value) => setFontSize(Number.parseInt(value))}
            >
              <SelectTrigger className="w-20 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Monaco Editor Area */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
            <Editor
              height="100%"
              language={getCurrentLanguage()}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                fontSize: fontSize,
                fontFamily:
                  "'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                folding: true,
                bracketPairColorization: { enabled: true },
                renderWhitespace: "boundary",
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false,
                },
                tabCompletion: "on",
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>

          {/* Output Section */}
          {output && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <TestTube className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Output
                </h4>
              </div>
              <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                <pre className="text-green-400 dark:text-green-300 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Panel */}
        <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                AI Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Intelligent code suggestions and optimization tips
            </p>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* AI Suggestion Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
              <button
                type="button"
                className="px-2 py-1.5 text-xs bg-white dark:bg-slate-600 rounded text-slate-800 dark:text-slate-200 font-medium shadow-sm"
              >
                💡 Hints
              </button>
              <button
                type="button"
                className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50 rounded transition-colors"
              >
                🐛 Debug
              </button>
              <button
                type="button"
                className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-600/50 rounded transition-colors"
              >
                ⚡ Optimize
              </button>
            </div>

            {/* AI Content */}
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Smart Suggestion
                  </h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Consider using a more efficient loop structure:</p>
                  <div className="bg-slate-100 dark:bg-slate-900 rounded p-2 font-mono text-xs border">
                    <code className="text-blue-600 dark:text-blue-400">
                      for i in range(1, n+1):
                      <br />
                      &nbsp;&nbsp;print(i, end=" ")
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Code Quality
                  </h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Syntax: Perfect</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>Performance: Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Style: Excellent</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Algorithm Analysis
                  </h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <p className="mb-2">Time Complexity: O(n)</p>
                  <p className="mb-2">Space Complexity: O(1)</p>
                  <p>
                    This solution efficiently handles the problem requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Brain className="w-3 h-3 mr-1" />
                Get AI Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Optimize Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white/40 to-slate-50/40 dark:from-slate-800/40 dark:to-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Code"}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
            <span>•</span>
            <span>{code.split("\n").length} lines</span>
            <span>•</span>
            <span>{code.length} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
