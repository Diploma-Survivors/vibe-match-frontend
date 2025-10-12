'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Editor from '@monaco-editor/react';
import { Copy, Play, Send } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useRef, useState } from 'react';

const languages = [
  {
    value: 'python',
    label: 'Python 3',
    monacoLang: 'python',
  },
  { value: 'cpp', label: 'C++17', monacoLang: 'cpp' },
  { value: 'java', label: 'Java 17', monacoLang: 'java' },
  {
    value: 'javascript',
    label: 'JavaScript',
    monacoLang: 'javascript',
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
};

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
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(defaultCode.python);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
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
    editorInstance: editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editorInstance;

    // Track cursor position
    editorInstance.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.value === selectedLanguage)?.monacoLang ||
      'python'
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
      {/* Header - LeetCode style */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 h-8 text-sm border-slate-300 dark:border-slate-600">
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
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getCurrentLanguage()}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="light"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}
