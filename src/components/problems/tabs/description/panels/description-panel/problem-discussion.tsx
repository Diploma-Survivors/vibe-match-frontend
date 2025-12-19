'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/contexts/app-context';
import { type ProblemComment, ProblemCommentSortBy } from '@/types/problems';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ProblemCommentItem from './problem-comment-item';

interface ProblemDiscussionProps {
  problemId: string;
}

// Mock data generator
const generateMockComments = (
  count: number,
  problemId: string
): ProblemComment[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `comment-${i}`,
    problemId,
    authorId: i + 1,
    author: {
      userId: i + 1,
      id: i + 1,
      firstName: 'User',
      lastName: `${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      address: '123 Mock St',
      phone: '123-456-7890',
      rank: 1,
    },
    content: `This is a mock comment ${i + 1} for problem ${problemId}. It has some interesting insights.`,
    upvoteCount: Math.floor(Math.random() * 100),
    downvoteCount: Math.floor(Math.random() * 10),
    myVote: null,
    parentCommentId: i % 4 === 0 ? null : `comment-${Math.floor(i / 4) + 1}`,
    replyCounts: 0,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

export function ProblemDiscussion({ problemId }: ProblemDiscussionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<ProblemComment[]>([]);
  const [sortBy, setSortBy] = useState<ProblemCommentSortBy>(
    ProblemCommentSortBy.MOST_VOTED
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockComments = generateMockComments(10, problemId);

      // Sort logic
      if (sortBy === ProblemCommentSortBy.MOST_VOTED) {
        mockComments.sort(
          (a, b) =>
            b.upvoteCount - b.downvoteCount - (a.upvoteCount - a.downvoteCount)
        );
      } else {
        mockComments.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      setComments(mockComments);
      setIsLoading(false);
    };

    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, sortBy, problemId]);

  const handleReplySuccess = (newComment: ProblemComment) => {
    setComments((prev) => [newComment, ...prev]);
    // Auto expand the parent to show the new reply
    if (newComment.parentCommentId) {
      const parentId = newComment.parentCommentId;
      setExpandedReplies((prev) => {
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    }
  };

  const handleUpdate = (commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content } : c))
    );
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  // Filter top-level comments
  const topLevelComments = comments.filter((c) => !c.parentCommentId);

  // Helper to get replies for a comment
  const getReplies = (parentId: string) => {
    return comments.filter((c) => c.parentCommentId === parentId);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-t border-slate-200 dark:border-slate-700"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-1">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
          <MessageSquare className="w-4 h-4" />
          <span>
            Thảo luận ({comments.length > 0 ? comments.length : '1K'})
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 pt-2 px-1 space-y-4">
          <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 dark:text-slate-400"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>
                    {sortBy === ProblemCommentSortBy.RECENT
                      ? 'Mới nhất'
                      : 'Được bình chọn nhiều nhất'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSortBy(ProblemCommentSortBy.MOST_VOTED)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Được bình chọn nhiều nhất</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy(ProblemCommentSortBy.RECENT)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Mới nhất</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {topLevelComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4"
                >
                  <ProblemCommentItem
                    comment={comment}
                    problemId={problemId}
                    onReplySuccess={handleReplySuccess}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />

                  {/* Replies */}
                  {(comment.replyCounts > 0 ||
                    getReplies(comment.id).length > 0) && (
                    <div className="pl-11 space-y-4">
                      {!expandedReplies.has(comment.id) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplies(comment.id)}
                          className="text-slate-500 h-auto p-0 hover:bg-transparent hover:text-slate-800 dark:hover:text-slate-300"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Xem{' '}
                          {comment.replyCounts || getReplies(comment.id).length}{' '}
                          câu trả lời
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplies(comment.id)}
                            className="text-slate-500 h-auto p-0 hover:bg-transparent hover:text-slate-800 dark:hover:text-slate-300 mb-2"
                          >
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Ẩn câu trả lời
                          </Button>

                          {getReplies(comment.id).map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg"
                            >
                              <ProblemCommentItem
                                comment={reply}
                                problemId={problemId}
                                onReplySuccess={handleReplySuccess}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
