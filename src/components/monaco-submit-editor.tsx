"use client";

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
  Code2,
  Copy,
  Maximize2,
  Moon,
  Play,
  RotateCcw,
  Send,
  Settings,
  Sun,
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

const themes = [
  { value: "vs-dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "hc-black", label: "High Contrast", icon: Settings },
];

interface MonacoSubmitEditorProps {
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export default function MonacoSubmitEditor({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}: MonacoSubmitEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleReset = () => {
    setCode(defaultCode[selectedLanguage as keyof typeof defaultCode]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleRun = () => {
    onRun?.(code, selectedLanguage);
  };

  const handleSubmit = () => {
    onSubmit?.(code, selectedLanguage);
  };

  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editorInstance;

    // Define custom themes
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
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editorLineNumber.foreground": "#7d8590",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#264f78",
      },
    });

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
      fontFamily:
        "'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
      fontLigatures: true,
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
    });
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.value === selectedLanguage)?.monacoLang ||
      "python"
    );
  };

  const getSelectedTheme = () => {
    return themes.find((t) => t.value === theme);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Code Editor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Write and test your solution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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

          {/* Theme Selector */}
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
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
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-slate-200 dark:border-slate-700"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getCurrentLanguage()}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme={theme}
          onMount={handleEditorDidMount}
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
            automaticLayout: true,
          }}
        />
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Lines: {code.split("\n").length} | Chars: {code.length} | Theme:{" "}
            {getSelectedTheme()?.label}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              variant="outline"
              size="sm"
              className="border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Run
                </>
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Solution
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
