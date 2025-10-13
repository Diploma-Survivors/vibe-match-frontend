// src/app/problems/[id]/submissions/page.tsx
'use client';

import { TestPageContent } from '@/components/common';
import { MonacoSubmitEditor } from '@/components/editor';
import { ProblemSidebar } from '@/components/problem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Problem } from '@/types/problem-test';
import {
  AlertCircle,
  BarChart3,
  Bot,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Code2,
  Copy,
  FileText,
  Filter,
  MemoryStick,
  MessageCircle,
  Play,
  Plus,
  Search,
  Send,
  Share,
  Sparkles,
  TestTube,
  Timer,
  X,
  XCircle,
} from 'lucide-react';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function StatusPage() {
  const params = useParams();
  const problemId = params.id as string;

  // TODO: Fetch problem data from API
  const problem = {
    id: problemId,
    title: 'Problem Title',
  };

  // Status tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);
  const [submissionNotes, setSubmissionNotes] = useState<
    Record<number, string>
  >({});

  // Publish Solution Modal state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishDescription, setPublishDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Sample Test Cases state
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      input: '5',
      output: '1 1 2 1 4',
      isEditing: false,
    },
    {
      id: 2,
      input: '10',
      output: '1 1 2 1 4 2 6 1 6 2',
      isEditing: false,
    },
    {
      id: 3,
      input: '3',
      output: '1 1 2',
      isEditing: false,
    },
  ]);
  const [activeTestCase, setActiveTestCase] = useState(0);

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState<
    Array<{ role: 'user' | 'ai'; content: string; timestamp: string }>
  >([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 20;

  const [submissions, setSubmissions] = useState<
    Array<{
      id: number;
      timestamp: string;
      status:
        | 'Accepted'
        | 'Wrong Answer'
        | 'Time Limit Exceeded'
        | 'Runtime Error';
      runtime: string;
      memory: string;
      score: number;
    }>
  >([]);

  // TODO: Fetch submissions from API
  const mockUserSubmissions: any[] = [];

  // Get selected submission details
  const selectedSubmission = mockUserSubmissions.find(
    (sub) => sub.id === selectedSubmissionId
  );

  // Auto-select first submission if none selected
  if (!selectedSubmissionId && mockUserSubmissions.length > 0) {
    setSelectedSubmissionId(mockUserSubmissions[0].id);
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'newbie':
        return 'text-gray-600';
      case 'pupil':
        return 'text-green-600';
      case 'specialist':
        return 'text-cyan-600';
      case 'expert':
        return 'text-blue-600';
      case 'candidate master':
        return 'text-purple-600';
      case 'master':
        return 'text-orange-600';
      case 'international master':
        return 'text-orange-500';
      case 'grandmaster':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Accepted':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Wrong Answer':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Time Limit Exceeded':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'Compilation Error':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      case 'Runtime Error':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'Memory Limit Exceeded':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'Wrong Answer':
        return <XCircle className="w-4 h-4" />;
      case 'Time Limit Exceeded':
        return <Timer className="w-4 h-4" />;
      case 'Compilation Error':
        return <AlertCircle className="w-4 h-4" />;
      case 'Runtime Error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState('');

  // Filter and sort submissions
  const filteredSubmissions = mockUserSubmissions
    .filter((submission) => {
      const matchesSearch = submission.id.toString().includes(searchTerm);
      const matchesVerdict =
        verdictFilter === 'all' || submission.verdict === verdictFilter;
      const matchesLanguage =
        languageFilter === 'all' || submission.lang.includes(languageFilter);

      return matchesSearch && matchesVerdict && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.when).getTime() - new Date(a.when).getTime();
      }
      return new Date(a.when).getTime() - new Date(b.when).getTime();
    });

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + submissionsPerPage
  );

  // Calculate verdict statistics
  const verdictStats = mockUserSubmissions.reduce(
    (acc, submission) => {
      acc[submission.verdict] = (acc[submission.verdict] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalSubmissions = mockUserSubmissions.length;
  const chartData = Object.entries(verdictStats)
    .map(([verdict, count]) => ({
      verdict,
      count,
      percentage: ((count / totalSubmissions) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRun = async () => {
    // TODO: Implement real run functionality
    console.log('Run button clicked - implement API call');
  };

  const handleSubmit = async () => {
    // TODO: Implement real submit functionality
    console.log('Submit button clicked - implement API call');
  };

  // AI Assistant Functions
  const getAiResponse = (question: string): string => {
    // TODO: Implement real AI assistant integration
    return 'AI assistant not implemented yet.';
  };

  const handleAiMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput('');
    setIsAiThinking(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        role: 'ai' as const,
        content: getAiResponse(message),
        timestamp: new Date().toLocaleTimeString(),
      };

      setAiMessages((prev) => [...prev, aiResponse]);
      setIsAiThinking(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const messages = {
      explain: 'Hãy giải thích thuật toán cho bài này',
      hint: 'Cho tôi gợi ý code để giải bài này',
      optimize: 'Làm thế nào để tối ưu hóa solution này?',
    };

    handleAiMessage(messages[action as keyof typeof messages] || action);
  };

  // Publish Solution Functions
  const handlePublishSolution = () => {
    if (selectedSubmission) {
      setPublishTitle(`Optimal Solution for ${problem.title}`);
      setPublishDescription(
        'This is my efficient solution that passes all test cases with good performance.'
      );
      setIsPublishModalOpen(true);
    }
  };

  const handlePublishSubmit = async () => {
    if (!publishTitle.trim() || !publishDescription.trim()) {
      return;
    }

    setIsPublishing(true);

    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      setPublishTitle('');
      setPublishDescription('');
      // You could show a success notification here
      alert('Solution published successfully!');
    }, 2000);
  };

  const handlePublishCancel = () => {
    setIsPublishModalOpen(false);
    setPublishTitle('');
    setPublishDescription('');
  };

  // Test Cases Functions
  const handleTestCaseChange = (
    id: number,
    field: 'input' | 'output',
    value: string
  ) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      )
    );
  };

  const handleTestCaseEdit = (id: number) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id
          ? { ...testCase, isEditing: !testCase.isEditing }
          : testCase
      )
    );
  };

  const handleTestCaseDelete = (id: number) => {
    setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
    // Adjust active test case if necessary
    if (activeTestCase >= testCases.length - 1) {
      setActiveTestCase(Math.max(0, testCases.length - 2));
    }
  };

  const handleTestCaseAdd = () => {
    const newTestCase = {
      id: Date.now(),
      input: '',
      output: '',
      isEditing: true,
    };
    setTestCases((prev) => [...prev, newTestCase]);
    setActiveTestCase(testCases.length); // Set to the new test case
  };

  const handleTestCaseSave = (id: number) => {
    // Here you can add any validation if needed
    handleTestCaseEdit(id);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - User Submissions List */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  📊 My Submissions
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your submission history for {problem.title}
                </p>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Verdict Filter */}
                  <Select
                    value={verdictFilter}
                    onValueChange={setVerdictFilter}
                  >
                    <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="All verdicts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All verdicts</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
                      <SelectItem value="Time Limit Exceeded">
                        Time Limit Exceeded
                      </SelectItem>
                      <SelectItem value="Compilation Error">
                        Compilation Error
                      </SelectItem>
                      <SelectItem value="Runtime Error">
                        Runtime Error
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Language Filter */}
                  <Select
                    value={languageFilter}
                    onValueChange={setLanguageFilter}
                  >
                    <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All languages</SelectItem>
                      <SelectItem value="Python">Python</SelectItem>
                      <SelectItem value="C++">C++</SelectItem>
                      <SelectItem value="Java">Java</SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Order */}
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Runtime
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Memory
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {mockUserSubmissions.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedSubmissionId(submission.id)}
                        className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          selectedSubmissionId === submission.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                            : ''
                        }`}
                      >
                        {/* Status */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(
                                submission.verdict
                              )}`}
                            >
                              {getVerdictIcon(submission.verdict)}
                              {submission.verdict}
                            </div>
                          </div>
                        </td>

                        {/* Language */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {submission.lang}
                          </span>
                        </td>

                        {/* Runtime */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                            {submission.time}
                          </span>
                        </td>

                        {/* Memory */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                            {submission.memory}
                          </span>
                        </td>

                        {/* Notes */}
                        <td className="px-4 py-4">
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                            {submissionNotes[submission.id] || 'No notes'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* No submissions */}
                {mockUserSubmissions.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-slate-400 dark:text-slate-500 mb-4">
                      <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      No submissions yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500">
                      Submit your first solution to see it here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Submission Details */}
          <div className="xl:col-span-1">
            {selectedSubmission ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                          Submission #{selectedSubmission.id}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedSubmission.when}
                        </p>
                      </div>
                    </div>

                    {/* Publish Solution Button - Only for Accepted submissions */}
                    {selectedSubmission.verdict === 'Accepted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePublishSolution}
                        className="gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      >
                        <Share className="w-4 h-4" />
                        Publish Solution
                      </Button>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${getVerdictColor(
                      selectedSubmission.verdict
                    )}`}
                  >
                    {getVerdictIcon(selectedSubmission.verdict)}
                    {selectedSubmission.verdict}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Runtime
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                          {selectedSubmission.time}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Memory
                        </div>
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                          {selectedSubmission.memory}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Language
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {selectedSubmission.lang}
                      </span>
                    </div>
                  </div>

                  {/* Result */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Result
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                      <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {selectedSubmission.result}
                      </pre>
                    </div>
                  </div>

                  {/* Code */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Submitted Code
                    </h4>
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <pre className="text-xs text-green-400 dark:text-green-300 font-mono whitespace-pre-wrap overflow-x-auto">
                        {selectedSubmission.code}
                      </pre>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(selectedSubmission.code, -1)
                        }
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Code
                      </Button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Notes
                    </h4>
                    <textarea
                      value={submissionNotes[selectedSubmission.id] || ''}
                      onChange={(e) =>
                        setSubmissionNotes((prev) => ({
                          ...prev,
                          [selectedSubmission.id]: e.target.value,
                        }))
                      }
                      placeholder="Add your notes about this submission..."
                      className="w-full h-24 p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                    />
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Notes are saved automatically as you type
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 text-center">
                <div className="text-slate-400 dark:text-slate-500 mb-4">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Select a submission
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  Click on any submission from the left to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Solution Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Share className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      Publish Solution
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Share your accepted solution with the community
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePublishCancel}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Solution Title
                    </label>
                    <Input
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      placeholder="Enter a descriptive title for your solution"
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                      Description
                    </label>
                    <textarea
                      value={publishDescription}
                      onChange={(e) => setPublishDescription(e.target.value)}
                      placeholder="Explain your approach, algorithm complexity, and any insights..."
                      rows={8}
                      className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Solution Stats */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      Solution Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Runtime
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                          {selectedSubmission?.time}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Memory
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                          {selectedSubmission?.memory}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Language
                      </div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {selectedSubmission?.lang}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Code Preview */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Code Preview
                  </h4>
                  <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 border border-slate-200 dark:border-slate-700 h-[400px] overflow-y-auto">
                    <pre className="text-xs text-green-400 dark:text-green-300 font-mono whitespace-pre-wrap">
                      {selectedSubmission?.code}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Your solution will be visible to other users in the community
                  solutions section.
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePublishCancel}
                    disabled={isPublishing}
                    className="border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePublishSubmit}
                    disabled={
                      isPublishing ||
                      !publishTitle.trim() ||
                      !publishDescription.trim()
                    }
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Publishing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Share className="w-4 h-4" />
                        Publish Solution
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
