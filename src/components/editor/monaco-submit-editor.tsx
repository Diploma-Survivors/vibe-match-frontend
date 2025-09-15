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
  FileText,
  Maximize2,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Save,
  Send,
  Settings,
  Sun,
  X,
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

// Tab interface
interface CodeTab {
  id: string;
  name: string;
  language: string;
  code: string;
  isModified: boolean;
  icon?: string;
}

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
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Tab state
  const [tabs, setTabs] = useState<CodeTab[]>([
    {
      id: "tab-1",
      name: "Solution.py",
      language: "python",
      code: defaultCode.python,
      isModified: false,
      icon: "🐍",
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");

  // Get current active tab
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const currentCode = activeTab?.code || "";
  const currentLanguage = activeTab?.language || "python";

  // Tab functions
  const createNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const languageConfig = languages.find(
      (lang) => lang.value === selectedLanguage
    );
    const extension = languageConfig?.extension || ".py";
    const icon =
      selectedLanguage === "python"
        ? "🐍"
        : selectedLanguage === "cpp"
          ? "⚡"
          : selectedLanguage === "java"
            ? "☕"
            : selectedLanguage === "javascript"
              ? "🟡"
              : selectedLanguage === "csharp"
                ? "🔷"
                : selectedLanguage === "typescript"
                  ? "🔵"
                  : "📄";

    const newTab: CodeTab = {
      id: newTabId,
      name: `Solution${extension}`,
      language: selectedLanguage,
      code: defaultCode[selectedLanguage as keyof typeof defaultCode],
      isModified: false,
      icon,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Don't close last tab

    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const updateTabCode = (tabId: string, newCode: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              code: newCode,
              isModified:
                newCode !==
                defaultCode[tab.language as keyof typeof defaultCode],
            }
          : tab
      )
    );
  };

  const saveTab = (tabId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, isModified: false } : tab
      )
    );
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (activeTab) {
      const languageConfig = languages.find((lang) => lang.value === language);
      const extension = languageConfig?.extension || ".py";
      const icon =
        language === "python"
          ? "🐍"
          : language === "cpp"
            ? "⚡"
            : language === "java"
              ? "☕"
              : language === "javascript"
                ? "🟡"
                : language === "csharp"
                  ? "🔷"
                  : language === "typescript"
                    ? "🔵"
                    : "📄";

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                language,
                name: `Solution${extension}`,
                code: defaultCode[language as keyof typeof defaultCode],
                icon,
                isModified: false,
              }
            : tab
        )
      );
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleReset = () => {
    if (activeTab) {
      updateTabCode(
        activeTabId,
        defaultCode[activeTab.language as keyof typeof defaultCode]
      );
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
  };

  const handleRun = () => {
    onRun?.(currentCode, currentLanguage);
  };

  const handleSubmit = () => {
    onSubmit?.(currentCode, currentLanguage);
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
      languages.find((lang) => lang.value === currentLanguage)?.monacoLang ||
      "python"
    );
  };

  const getSelectedTheme = () => {
    return themes.find((t) => t.value === theme);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              Code Editor
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Language Selector */}
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-30 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm">
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
              onClick={() => activeTab && saveTab(activeTab.id)}
              className="border-slate-200 dark:border-slate-700"
              disabled={!activeTab?.isModified}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
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

      {/* Tabs Bar */}
      <div className="flex leading-[0.75] items-center bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-750 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex items-center min-w-0 flex-1">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={`group relative flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200 border-r border-slate-200 dark:border-slate-700 min-w-0 border-0 bg-transparent ${
                activeTabId === tab.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "hover:bg-white/70 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => switchTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  switchTab(tab.id);
                }
              }}
            >
              {/* Tab Indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-200 ${
                  activeTabId === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-transparent"
                }`}
              />

              {/* Tab Icon */}
              <span className="text-sm flex-shrink-0">{tab.icon}</span>

              {/* Tab Name */}
              <span className="text-sm font-medium truncate min-w-0">
                {tab.name}
                {tab.isModified && (
                  <span className="ml-1 w-1.5 h-1.5 bg-orange-500 rounded-full inline-block animate-pulse" />
                )}
              </span>

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="ml-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}
        </div>

        {/* New Tab Button */}
        <button
          type="button"
          onClick={createNewTab}
          className="flex items-center gap-1 px-3 py-1 m-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all duration-200 flex-shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getCurrentLanguage()}
          value={currentCode}
          onChange={(value) => updateTabCode(activeTabId, value || "")}
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
      <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-4">
            <span>Lines: {currentCode.split("\n").length}</span>
            <span>Chars: {currentCode.length}</span>
            <span>Theme: {getSelectedTheme()?.label}</span>
            <span>Tab: {activeTab?.name}</span>
            {activeTab?.isModified && (
              <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Modified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={isRunning || !currentCode.trim()}
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
              disabled={isSubmitting || !currentCode.trim()}
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
