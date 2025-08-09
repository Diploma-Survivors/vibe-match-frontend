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
import { Clock, Play, RotateCcw, Save, Send, Settings } from "lucide-react";
import { useState } from "react";

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

export default function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
  };

  const handleReset = () => {
    setCode(defaultCode[selectedLanguage as keyof typeof defaultCode]);
  };
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Code Editor
          </h2>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <Clock className="w-3 h-3 mr-1" />
            Auto-save
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            className="border-slate-200 dark:border-slate-700"
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            className="w-full h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                // Run code logic will be in Submit tab
                console.log("Run code:", code);
              }}
              className="bg-green-600 hover:bg-green-700 text-white border-0"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>

            <Button
              variant="outline"
              className="border-slate-200 dark:border-slate-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
