'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { ProblemsService } from '@/services/problems-service';
import { SubmissionsService } from '@/services/submissions-service';
import { ProblemDifficulty, type ProblemListItem, ProblemStatus } from '@/types/problems';
import { type SubmissionListItem, SubmissionStatus } from '@/types/submissions';
import { format } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Cpu,
  Filter,
  Flame,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, use, useEffect, useMemo, useState } from 'react';

// Types for the view
interface ProblemWithSubmissions extends Omit<ProblemListItem, 'status'> {
  submissions: SubmissionListItem[];
  lastSubmittedAt: string | null;
  status: ProblemStatus;
  lastResult: SubmissionStatus | null;
  submissionCount: number;
}

type SortField = 'lastSubmittedAt' | 'submissionCount';
type SortOrder = 'asc' | 'desc' | null;

export default function PracticeHistoryPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: userIdString } = use(params);
  const userId = Number(userIdString);

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<ProblemWithSubmissions[]>([]);

  // Filtering
  const [statusFilter, setStatusFilter] = useState<ProblemStatus[]>([
    ProblemStatus.SOLVED,
    ProblemStatus.ATTEMPTED,
  ]);
  const [difficultyFilter, setDifficultyFilter] = useState<ProblemDifficulty[]>(
    [ProblemDifficulty.EASY, ProblemDifficulty.MEDIUM, ProblemDifficulty.HARD]
  );

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Expanded Rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProblems, allSubmissions] = await Promise.all([
          ProblemsService.getAllProblems(),
          SubmissionsService.getAllSubmissions(userId),
        ]);

        // Process data
        const problemsMap = new Map<string, ProblemWithSubmissions>();

        // Initialize map with problems that have submissions
        // Optimization: We only care about problems that have at least one submission
        // But wait, the requirement says "This list shows only problems with submissions"
        // So we iterate through submissions first?
        // Or we iterate through all problems and check if they have submissions?
        // Iterating through submissions is better if we only want problems with submissions.

        // Group submissions by problemId
        const submissionsByProblem = new Map<string, SubmissionListItem[]>();
        for (const sub of allSubmissions) {
          if (sub.problemId) {
            const existing = submissionsByProblem.get(sub.problemId) || [];
            existing.push(sub);
            submissionsByProblem.set(sub.problemId, existing);
          }
        }

        const processedProblems: ProblemWithSubmissions[] = [];

        for (const [problemId, subs] of submissionsByProblem.entries()) {
          const problemDef = allProblems.find((p) => p.id === problemId);
          if (!problemDef) continue;

          // Sort submissions by date desc
          subs.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );

          const lastSubmission = subs[0];
          const isSolved = subs.some(
            (s) => s.status === SubmissionStatus.ACCEPTED
          );

          processedProblems.push({
            ...problemDef,
            submissions: subs,
            lastSubmittedAt: lastSubmission.createdAt || null,
            status: isSolved ? ProblemStatus.SOLVED : ProblemStatus.ATTEMPTED,
            lastResult: lastSubmission.status,
            submissionCount: subs.length,
          });
        }

        setProblems(processedProblems);
      } catch (error) {
        console.error('Error fetching practice history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Filter, Sort, Paginate
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (!statusFilter.includes(p.status)) return false;
      if (!difficultyFilter.includes(p.difficulty)) return false;
      return true;
    });
  }, [problems, statusFilter, difficultyFilter]);

  const sortedProblems = useMemo(() => {
    if (!sortField || !sortOrder) return filteredProblems;

    return [...filteredProblems].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'lastSubmittedAt') {
        valA = new Date(a.lastSubmittedAt || 0).getTime();
        valB = new Date(b.lastSubmittedAt || 0).getTime();
      } else if (sortField === 'submissionCount') {
        valA = a.submissionCount;
        valB = b.submissionCount;
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });
  }, [filteredProblems, sortField, sortOrder]);

  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProblems, currentPage]);

  const totalPages = Math.ceil(sortedProblems.length / itemsPerPage);

  // Stats
  const stats = useMemo(() => {
    const totalSolved = problems.filter((p) => p.status === ProblemStatus.SOLVED).length;
    const totalSubmissions = problems.reduce(
      (acc, curr) => acc + curr.submissionCount,
      0
    );

    // Acceptance Rate: (Total Accepted Submissions / Total Submissions) * 100
    // Or is it (Solved Problems / Total Attempted Problems)?
    // Usually it's based on submissions.
    const totalAcceptedSubmissions = problems.reduce(
      (acc, curr) =>
        acc +
        curr.submissions.filter((s) => s.status === SubmissionStatus.ACCEPTED)
          .length,
      0
    );
    const acceptanceRate =
      totalSubmissions > 0
        ? ((totalAcceptedSubmissions / totalSubmissions) * 100).toFixed(1)
        : '0.0';

    const easySolved = problems.filter(
      (p) => p.status === ProblemStatus.SOLVED && p.difficulty === ProblemDifficulty.EASY
    ).length;
    const mediumSolved = problems.filter(
      (p) => p.status === ProblemStatus.SOLVED && p.difficulty === ProblemDifficulty.MEDIUM
    ).length;
    const hardSolved = problems.filter(
      (p) => p.status === ProblemStatus.SOLVED && p.difficulty === ProblemDifficulty.HARD
    ).length;

    return {
      totalSolved,
      totalSubmissions,
      acceptanceRate,
      easySolved,
      mediumSolved,
      hardSolved,
    };
  }, [problems]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === null) setSortOrder('desc');
      else if (sortOrder === 'desc') setSortOrder('asc');
      else setSortOrder(null);
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleRow = (problemId: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(problemId)) {
      newSet.delete(problemId);
    } else {
      newSet.add(problemId);
    }
    setExpandedRows(newSet);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    if (sortOrder === 'asc') return <ArrowUp className="w-4 h-4 ml-1" />;
    if (sortOrder === 'desc') return <ArrowDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className="w-4 h-4 ml-1" />;
  };

  const getDifficultyStyles = (diff: ProblemDifficulty) => {
    switch (diff) {
      case ProblemDifficulty.EASY:
        return 'text-green-600 bg-green-50 border-green-200';
      case ProblemDifficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-orange-200';
      case ProblemDifficulty.HARD:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case SubmissionStatus.ACCEPTED:
        return 'text-green-600';
      case SubmissionStatus.WRONG_ANSWER:
        return 'text-red-600';
      case SubmissionStatus.TIME_LIMIT_EXCEEDED:
        return 'text-red-600';
      case SubmissionStatus.COMPILATION_ERROR:
        return 'text-red-600';
      case SubmissionStatus.RUNTIME_ERROR:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const router = useRouter();
  const handleProblemClick = (problemId: string) => {
    router.push(`/problems/${problemId}/submissions`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* Left Section Skeleton */}
          <div className="col-span-1 lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Card className="border-none shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i + new Date().getTime()}
                    className="grid grid-cols-4 gap-4 items-center"
                  >
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <div className="flex justify-end">
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Section Skeleton */}
          <div className="col-span-1 lg:col-span-4 space-y-6 pt-[52px]">
            <Card className="border-none shadow-md gap-2">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-10 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32 mt-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex flex-col items-center gap-1 border-l border-r">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Practice History Table (70%) */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Lịch sử luyện tập
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <DropdownMenuLabel className="px-0 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </DropdownMenuLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                          statusFilter.includes(ProblemStatus.SOLVED) &&
                          !statusFilter.includes(ProblemStatus.ATTEMPTED)
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                        onClick={() => setStatusFilter([ProblemStatus.SOLVED])}
                      >
                        <CheckCircle
                          className={`w-4 h-4 ${
                            statusFilter.includes(ProblemStatus.SOLVED) &&
                            !statusFilter.includes(ProblemStatus.ATTEMPTED)
                              ? 'text-green-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm font-medium">Solved</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                          statusFilter.includes(ProblemStatus.ATTEMPTED) &&
                          !statusFilter.includes(ProblemStatus.SOLVED)
                            ? 'bg-gray-100 border-gray-300 text-gray-900'
                            : 'hover:bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                        onClick={() => setStatusFilter([ProblemStatus.ATTEMPTED])}
                      >
                        <Circle
                          className={`w-4 h-4 ${
                            statusFilter.includes(ProblemStatus.ATTEMPTED) &&
                            !statusFilter.includes(ProblemStatus.SOLVED)
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm font-medium">Attempted</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <DropdownMenuLabel className="px-0 text-xs font-semibold text-gray-500 uppercase">
                      Difficulty
                    </DropdownMenuLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          value: ProblemDifficulty.EASY,
                          label: 'Easy',
                          color: getDifficultyStyles(ProblemDifficulty.EASY),
                          hover: 'hover:bg-green-50/50',
                        },
                        {
                          value: ProblemDifficulty.MEDIUM,
                          label: 'Med.',
                          color: getDifficultyStyles(ProblemDifficulty.MEDIUM),
                          hover: 'hover:bg-orange-50/50',
                        },
                        {
                          value: ProblemDifficulty.HARD,
                          label: 'Hard',
                          color: getDifficultyStyles(ProblemDifficulty.HARD),
                          hover: 'hover:bg-red-50/50',
                        },
                      ].map((diff) => {
                        const isSelected = difficultyFilter.includes(
                          diff.value
                        );
                        return (
                          <div
                            key={diff.value}
                            className={`flex items-center justify-center p-2 rounded-md border cursor-pointer transition-all ${
                              isSelected
                                ? diff.color
                                : `border-gray-200 text-gray-500 ${diff.hover}`
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setDifficultyFilter(
                                  difficultyFilter.filter(
                                    (d) => d !== diff.value
                                  )
                                );
                              } else {
                                setDifficultyFilter([
                                  ...difficultyFilter,
                                  diff.value,
                                ]);
                              }
                            }}
                          >
                            <span className="text-sm font-medium">
                              {diff.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Reset Button */}
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-900"
                    onClick={() => {
                      setStatusFilter([ProblemStatus.SOLVED, ProblemStatus.ATTEMPTED]);
                      setDifficultyFilter([
                        ProblemDifficulty.EASY,
                        ProblemDifficulty.MEDIUM,
                        ProblemDifficulty.HARD,
                      ]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 w-[180px]"
                    onClick={() => handleSort('lastSubmittedAt')}
                  >
                    <div className="flex items-center">
                      Lần nộp cuối
                      {getSortIcon('lastSubmittedAt')}
                    </div>
                  </TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Kết quả gần nhất</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 text-right"
                    onClick={() => handleSort('submissionCount')}
                  >
                    <div className="flex items-center justify-end">
                      Submissions
                      {getSortIcon('submissionCount')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProblems.map((problem) => (
                  <Fragment key={problem.id}>
                    <TableRow className="group ">
                      <TableCell className="text-gray-500 font-medium">
                        {problem.lastSubmittedAt
                          ? format(
                              new Date(problem.lastSubmittedAt),
                              'MMM d, yyyy'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-start gap-3 cursor-pointer"
                          onClick={() => handleProblemClick(problem.id)}
                        >
                          {problem.status === ProblemStatus.SOLVED ? (
                            <Tooltip content="Solved">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            </Tooltip>
                          ) : (
                            <Tooltip content="Attempted">
                              <Circle className="w-5 h-5 text-gray-300 mt-0.5" />
                            </Tooltip>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {problem.title}
                            </div>
                            <Badge
                              variant="outline"
                              className={`mt-1 text-xs font-normal border ${getDifficultyStyles(problem.difficulty)}`}
                            >
                              {problem.difficulty === ProblemDifficulty.EASY
                                ? 'Easy'
                                : problem.difficulty ===
                                    ProblemDifficulty.MEDIUM
                                  ? 'Med.'
                                  : 'Hard'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${getStatusColor(problem.lastResult || SubmissionStatus.UNKNOWN_ERROR)}`}
                        >
                          {problem.lastResult}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className="flex items-center justify-end gap-2 cursor-pointer select-none"
                          onClick={() => toggleRow(problem.id)}
                        >
                          <span className="font-medium">
                            {problem.submissionCount}
                          </span>
                          {expandedRows.has(problem.id) ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(problem.id) && (
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-4 pl-12 pr-8">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b border-gray-200">
                                  <TableHead className="text-xs uppercase">
                                    Thời gian
                                  </TableHead>
                                  <TableHead className="text-xs uppercase">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-xs uppercase">
                                    Language
                                  </TableHead>
                                  <TableHead className="text-xs uppercase">
                                    Runtime
                                  </TableHead>
                                  <TableHead className="text-xs uppercase">
                                    Memory
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {problem.submissions.map((sub) => (
                                  <TableRow
                                    key={sub.id}
                                    className="border-none hover:bg-transparent"
                                  >
                                    <TableCell className="text-gray-500">
                                      {sub.createdAt
                                        ? format(
                                            new Date(sub.createdAt),
                                            'yyyy.MM.dd'
                                          )
                                        : '-'}
                                    </TableCell>
                                    <TableCell
                                      className={getStatusColor(sub.status)}
                                    >
                                      {sub.status}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="secondary"
                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      >
                                        {sub.language.name}
                                      </Badge>
                                    </TableCell>

                                    <TableCell className="text-gray-500">
                                      {/* Use flex and items-center to align them horizontally and vertically center them */}
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-900" />
                                        <span>
                                          {sub.runtime
                                            ? `${sub.runtime} ms`
                                            : 'N/A'}
                                        </span>
                                      </div>
                                    </TableCell>

                                    <TableCell className="text-gray-500">
                                      <div className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-gray-900" />
                                        <span>
                                          {sub.memory
                                            ? `${sub.memory} MB`
                                            : 'N/A'}
                                        </span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Section: Summary Sidebar (30%) */}
        <div className="col-span-1 lg:col-span-4 space-y-6 pt-[52px]">
          {/* Total Solved Card */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 text-sm font-medium">
                Bài tập đã giải
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-blue-600">
                    {stats.totalSolved}{' '}
                    <span className="text-lg text-gray-400 font-normal">
                      Problems
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      Easy
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {stats.easySolved}
                    </div>
                  </div>
                  <div className="text-center border-l border-r">
                    <div className="text-sm font-medium text-orange-600">
                      Med.
                    </div>
                    <div className="text-lg font-bold text-gray-700">
                      {stats.mediumSolved}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-600">Hard</div>
                    <div className="text-lg font-bold text-gray-700">
                      {stats.hardSolved}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-500 text-xs font-medium uppercase">
                  Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalSubmissions}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-500 text-xs font-medium uppercase">
                  Acceptance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.acceptanceRate}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
