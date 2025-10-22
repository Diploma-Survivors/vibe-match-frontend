'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface SubmissionDetailData {
  id: number;
  status: string;
  score: number;
  runtime: number;
  memory: number;
  sourceCode: string;
  createdAt: string;
  totalTests: number;
  passedTests: number;
  language: {
    id: number;
    name: string;
  };
  resultDescription: {
    message: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SubmissionDetailProps {
  submission: SubmissionDetailData | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'WRONG_ANSWER':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'TIME_LIMIT_EXCEEDED':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'RUNTIME_ERROR':
    case 'COMPILATION_ERROR':
    case 'NZEC':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':
    case 'RUNNING':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatRuntime = (runtime: number) => {
  if (runtime === 0) return '0ms';
  return `${(runtime * 1000).toFixed(0)}ms`;
};

const formatMemory = (memory: number) => {
  if (memory === 0) return '0 KB';
  return `${(memory / 1024).toFixed(0)} KB`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function SubmissionDetail({
  submission,
}: SubmissionDetailProps) {
  const [isCodeExpanded, setIsCodeExpanded] = useState(true);

  // Calculate code height based on number of lines
  const getCodeHeight = () => {
    if (!submission) return { height: '192px' }; // h-48 equivalent

    const lines = submission.sourceCode.split('\n').length;
    const lineHeight = 22; // Match SyntaxHighlighter line-height
    const padding = 40; // Matches customStyle padding top+bottom (20px * 2)

    // Always expanded height
    const totalHeight = Math.max(lines * lineHeight + padding, 200);
    return { height: `${totalHeight}px` };
  };

  if (!submission) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No Submission Selected</h3>
          <p className="text-sm">
            Select a submission from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.sourceCode);
  };

  const getSyntaxLanguage = (languageName: string) => {
    // Highlight.js language keys
    if (languageName.includes('C++')) return 'cpp';
    if (languageName.includes('Python')) return 'python';
    if (languageName.includes('Java')) return 'java';
    if (languageName.includes('JavaScript')) return 'javascript';
    if (languageName.includes('TypeScript')) return 'typescript';
    if (languageName.includes('C#')) return 'csharp';
    if (languageName.includes('Go')) return 'go';
    if (languageName.includes('Rust')) return 'rust';
    return 'plaintext';
  };

  return (
    <div className="overflow-y-auto h-full pb-4">
      <div className="pr-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="p-8 space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Submission #{submission.id}
              </h2>
            </div>

            {/* Status */}
            <div
              className={`p-5 rounded-lg border ${getStatusColor(submission.status)}`}
            >
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span>{submission.status}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-2">
                {submission.passedTests}/{submission.totalTests} test cases
                passed
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <div className="text-xs text-slate-500">SCORE</div>
                <div className="text-xl font-semibold">
                  {submission.score} / 100
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <div className="text-xs text-slate-500">RUNTIME</div>
                <div className="text-xl font-semibold">
                  {formatRuntime(submission.runtime)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-5">
                <div className="text-xs text-slate-500">MEMORY</div>
                <div className="text-xl font-semibold">
                  {formatMemory(submission.memory)}
                </div>
              </div>
            </div>

            {/* Source Code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <span>Source Code</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900">
                <div className="relative">
                  <div
                    className="transition-all duration-300 ease-in-out relative overflow-hidden"
                    style={getCodeHeight()}
                  >
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(submission.language.name)}
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0',
                        fontSize: '14px',
                        lineHeight: '22px',
                        fontFamily:
                          "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
                        letterSpacing: '0.3px',
                        background: '#f5f5f5',
                        color: '#24292e',
                        padding: '20px',
                        overflow: isCodeExpanded ? 'auto' : 'hidden',
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6a737d',
                        marginRight: '16px',
                        userSelect: 'none',
                        fontSize: '12px',
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {submission.sourceCode}
                    </SyntaxHighlighter>
                  </div>

                  {/* Show More/Less Button - only show if code has more than 9 lines */}
                  {/* Show More/Less temporarily removed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
