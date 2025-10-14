'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_CODE, LANGUAGES } from '@/lib/apis/constants/code-editor';
import Editor from '@monaco-editor/react';
import { Copy, Wand2 } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

const languages = LANGUAGES;
const defaultCode = DEFAULT_CODE;

interface MonacoEditorProps {
  onCodeChange?: (sourceCode: string, language: string) => void;
}

export default function MonacoEditor({ onCodeChange }: MonacoEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [sourceCode, setSourceCode] = useState(defaultCode.cpp);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Notify parent when source code changes
  useEffect(() => {
    onCodeChange?.(sourceCode, selectedLanguage);
  }, [sourceCode, selectedLanguage, onCodeChange]);

  // handle language change when user changes the language in the dropdown
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const newSourceCode =
      defaultCode[language as keyof typeof defaultCode] || '';
    setSourceCode(newSourceCode);
    onCodeChange?.(newSourceCode, language);
  };

  // handle editor change when user changes the code in the editor
  const handleEditorChange = (value?: string) => {
    const newSourceCode = value || '';
    setSourceCode(newSourceCode);
    onCodeChange?.(newSourceCode, selectedLanguage);
  };

  // handle editor mount when editor is mounted (just call once when editor is mounted)
  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editorInstance;
    onCodeChange?.(sourceCode, selectedLanguage);
  };

  // get current language
  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.value === selectedLanguage)?.monacoLang ||
      'python'
    );
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode);
  };

  // Format code using Monaco editor ref (unsupported for python/cpp/java)
  const handleFormatCode = () => {
    const instance = editorRef.current;
    if (!instance) return;

    const action = instance.getAction?.('editor.action.formatDocument');
    if (action) action.run();
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
          {/* Format Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormatCode}
            className="h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Wand2 className="w-4 h-4 mr-1" />
            Format
          </Button>
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
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
          value={sourceCode}
          onChange={handleEditorChange}
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
