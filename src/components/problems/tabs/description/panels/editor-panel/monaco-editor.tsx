'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SubmissionsService } from '@/services/submissions-service';
import { toastService } from '@/services/toasts-service';
import { LANGUAGE_DEFINITIONS, type Language } from '@/types/submissions';
import Editor from '@monaco-editor/react';
import { Copy, Moon, Sun, Wand2 } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

interface MonacoEditorProps {
  currentLanguageId: number;
  setCurrentLanguageId: (languageId: number) => void;
  currentCode: string;
  setCurrentCode: (code: string) => void;
}

const getMonacoLanguageId = (backendName?: string): string => {
  if (!backendName) return 'plaintext';

  const name = backendName.toLowerCase();

  // Find the first configuration where:
  // 1. None of the 'exclude' keywords are present
  // 2. At least one of the 'keywords' is present
  const matchedLang = LANGUAGE_DEFINITIONS.find((config) => {
    const isExcluded = config.exclude?.some((term) => name.includes(term));
    if (isExcluded) return false;

    return config.keywords.some((term) => name.includes(term));
  });

  return matchedLang ? matchedLang.monacoId : 'plaintext';
};

export default function MonacoEditor({
  currentLanguageId,
  setCurrentLanguageId,
  currentCode,
  setCurrentCode,
}: MonacoEditorProps) {
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [editorTheme, setEditorTheme] = useState('light');

  // handle editor mount when editor is mounted (just call once when editor is mounted)
  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editorInstance;
  };

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  // Get language list
  useEffect(() => {
    const fetchLanguageList = async () => {
      const response = await SubmissionsService.getLanguageList();
      setLanguageList(response.data.data);
    };

    fetchLanguageList();
  }, []);

  // handle language change when user changes the language in the dropdown
  const handleLanguageChange = (languageName: string) => {
    const languageId =
      languageList.find((lang) => lang.name === languageName)?.id || 1;
    setCurrentLanguageId(languageId);
  };

  // handle editor change when user changes the code in the editor
  const handleEditorChange = (value?: string) => {
    const newSourceCode = value || '';
    setCurrentCode(newSourceCode);
  };

  const currentLanguageName = languageList.find(
    (lang) => lang.id === currentLanguageId
  )?.name;

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
    toastService.success('Đã copy vào clipboard!');
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
          <Select
            value={currentLanguageName}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-36 h-8 text-sm border-slate-300 dark:border-slate-600">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageList.map((lang) => (
                <SelectItem key={lang.id} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            {editorTheme === 'vs-dark' ? (
              <Sun className="w-4 h-4 mr-1" />
            ) : (
              <Moon className="w-4 h-4 mr-1" />
            )}
            Theme
          </Button>
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
          language={getMonacoLanguageId(currentLanguageName)}
          value={currentCode}
          onChange={handleEditorChange}
          theme={editorTheme}
          onMount={handleEditorDidMount}
          loading={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
          }
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
