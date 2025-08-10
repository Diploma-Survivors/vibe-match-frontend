"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  theme?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  height = "400px",
  theme = "vs-dark",
  readOnly = false,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const editorOptions = {
    readOnly,
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on" as const,
    lineNumbers: "on" as const,
    folding: true,
    selectOnLineNumbers: true,
    matchBrackets: "always" as const,
    autoClosingBrackets: "always" as const,
    autoClosingQuotes: "always" as const,
    autoIndent: "full" as const,
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 4,
    insertSpaces: true,
    theme: theme,
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <div className="text-sm">Loading Monaco Editor...</div>
          </div>
        </div>
      )}
      <Editor
        height={height}
        language={language === "cpp" ? "cpp" : language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <div className="text-sm">Initializing Editor...</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
