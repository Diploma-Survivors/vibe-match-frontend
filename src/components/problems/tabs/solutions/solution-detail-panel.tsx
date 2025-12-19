'use client';

import { useDialog } from '@/components/providers/dialog-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { Tooltip } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/app-context';
import { ContestsService } from '@/services/contests-service';
import { LanguagesService } from '@/services/languages';
import { SolutionsService } from '@/services/solutions-service';
import { SubmissionsService } from '@/services/submissions-service';
import type { Solution } from '@/types/solutions';
import type { Language } from '@/types/submissions';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowBigDown, ArrowBigUp, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommentSection from './comments/comment-section';

interface SolutionDetailPanelProps {
  solution: Solution;
  onDelete: () => void;
}

export default function SolutionDetailPanel({
  solution: initialSolution,
  onDelete,
}: SolutionDetailPanelProps) {
  const { user } = useApp();
  const { confirm } = useDialog();
  const router = useRouter();
  const params = useParams();
  const [solution, setSolution] = useState(initialSolution);
  const [languages, setLanguages] = useState<Language[]>([]);

  const isAuthor = user?.userId === solution.authorId;

  useEffect(() => {
    setSolution(initialSolution);
  }, [initialSolution]);

  useEffect(() => {
    const fetchLanguageList = async () => {
      const response = await SubmissionsService.getLanguageList();
      setLanguages(response.data.data);
    };
    fetchLanguageList();
  }, []);

  const solutionLangs = languages.filter((l) =>
    solution.languageIds.includes(l.id)
  );

  const handleVote = async (type: 'up_vote' | 'down_vote') => {
    try {
      if (solution.myVote === type) {
        await SolutionsService.unreactSolution(solution.id);
        setSolution((prev) => ({
          ...prev,
          myVote: null,
          upvoteCount:
            type === 'up_vote' ? prev.upvoteCount - 1 : prev.upvoteCount,
          downvoteCount:
            type === 'down_vote' ? prev.downvoteCount - 1 : prev.downvoteCount,
        }));
      } else {
        await SolutionsService.reactSolution(solution.id, type);
        setSolution((prev) => ({
          ...prev,
          myVote: type,
          upvoteCount:
            type === 'up_vote'
              ? prev.upvoteCount + 1
              : prev.myVote === 'up_vote'
                ? prev.upvoteCount - 1
                : prev.upvoteCount,
          downvoteCount:
            type === 'down_vote'
              ? prev.downvoteCount + 1
              : prev.myVote === 'down_vote'
                ? prev.downvoteCount - 1
                : prev.downvoteCount,
        }));
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Xóa giải pháp',
      message:
        'Bạn có chắc chắn muốn xóa giải pháp này không? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      color: 'red',
    });

    if (result) {
      try {
        await SolutionsService.deleteSolution(solution.id);
        onDelete();
      } catch (error) {
        console.error('Error deleting solution:', error);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {solution.title}
          </h1>

          {isAuthor && (
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip content="Sửa">
                <Link
                  href={`/problems/${params.id}/solutions/edit/${solution.id}`}
                  target="_blank"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip content="Xóa">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              userId={solution.authorId}
              className="w-10 h-10 border border-slate-200 dark:border-slate-700"
            >
              <AvatarImage src={solution.author?.avatarUrl} />
              <AvatarFallback>
                {solution.author?.firstName?.[0]}
                {solution.author?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-200">
                {solution.author?.firstName} {solution.author?.lastName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {formatDistanceToNow(new Date(solution.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('up_vote')}
              className={`gap-2 ${
                solution.myVote === 'up_vote'
                  ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  : ''
              }`}
            >
              <ArrowBigUp
                className={`w-5 h-5 ${
                  solution.myVote === 'up_vote' ? 'fill-current' : ''
                }`}
              />
              {solution.upvoteCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('down_vote')}
              className={`gap-2 ${
                solution.myVote === 'down_vote'
                  ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                  : ''
              }`}
            >
              <ArrowBigDown
                className={`w-5 h-5 ${
                  solution.myVote === 'down_vote' ? 'fill-current' : ''
                }`}
              />
              {solution.downvoteCount}
            </Button>
          </div>
        </div>

        {/* Tags & Languages */}
        <div className="flex flex-wrap gap-2">
          {solutionLangs.map((lang) => (
            <span
              key={lang.id}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {lang.name}
            </span>
          ))}
          {solution.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700" />

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <MarkdownRenderer content={solution.content} />
      </div>

      {/* Comments Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
        <CommentSection solutionId={solution.id} />
      </div>
    </div>
  );
}
