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
import Editor from '@monaco-editor/react';
import { Copy, Wand2 } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

interface Language {
  id: number;
  name: string;
}

interface MonacoEditorProps {
  currentLanguageId: number;
  setCurrentLanguageId: (languageId: number) => void;
  currentCode: string;
  setCurrentCode: (code: string) => void;
}

export default function MonacoEditor({
  currentLanguageId,
  setCurrentLanguageId,
  currentCode,
  setCurrentCode,
}: MonacoEditorProps) {
  const [languageList, setLanguageList] = useState<Language[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // handle editor mount when editor is mounted (just call once when editor is mounted)
  const handleEditorDidMount = (
    editorInstance: editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editorInstance;
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

  // get current language name for the selected language in the dropdown
  const getCurrentLanguageName = () => {
    return languageList.find((lang) => lang.id === currentLanguageId)?.name;
  };

  // map language name to Monaco language id
  const mapLanguageNameToMonaco = (languageName?: string) => {
    if (!languageName) return 'plaintext';
    const name = languageName.toLowerCase();
    if (name.includes('python')) return 'python';
    if (name.includes('c++') || name.includes('cpp')) return 'cpp';
    if (name.includes('java') && !name.includes('javascript')) return 'java';
    if (name.includes('javascript') || name === 'js') return 'javascript';
    return 'plaintext';
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
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
            value={getCurrentLanguageName()}
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
          language={mapLanguageNameToMonaco(getCurrentLanguageName())}
          value={currentCode}
          onChange={handleEditorChange}
          theme="light"
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
