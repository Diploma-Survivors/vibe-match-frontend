"use client";

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
  Play,
  RotateCcw,
  Send,
  Settings,
} from "lucide-react";
import { useRef, useState } from "react";

const languages = [
  { value: "python", label: "Python 3", extension: ".py" },
  { value: "cpp", label: "C++17", extension: ".cpp" },
  { value: "java", label: "Java 17", extension: ".java" },
  { value: "javascript", label: "JavaScript", extension: ".js" },
  { value: "csharp", label: "C# 10", extension: ".cs" },
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
};

interface SimpleSubmitEditorProps {
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

export default function SimpleSubmitEditor({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}: SimpleSubmitEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
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
                                : "bg-purple-500"
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
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Code Editor */}
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-slate-900 dark:bg-slate-800 text-slate-100 font-mono text-sm p-4 rounded-lg border border-slate-300 dark:border-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          placeholder="Write your code here..."
          spellCheck={false}
          style={{
            fontFamily:
              "'Fira Code', 'Cascadia Code', 'SF Mono', Consolas, monospace",
            lineHeight: "1.5",
            tabSize: 4,
          }}
        />
      </div>

      {/* Footer with Action Buttons */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Lines: {code.split("\n").length} | Chars: {code.length}
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
