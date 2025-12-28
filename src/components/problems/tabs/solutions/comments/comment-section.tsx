'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-context';
import { SolutionsService } from '@/services/solutions-service';
import { UserService } from '@/services/user-service';
import { type SolutionComment, SolutionCommentSortBy } from '@/types/solutions';
import type { UserProfile } from '@/types/user';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CommentItem from './comment-item';
import { useTranslation } from 'react-i18next';
interface CommentSectionProps {
  solutionId: string;
}

export default function CommentSection({ solutionId }: CommentSectionProps) {
  const { user } = useApp();
  const { t } = useTranslation('problems');
  const [comments, setComments] = useState<SolutionComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SolutionCommentSortBy>(
    SolutionCommentSortBy.RECENT
  );
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Fetch current user for the avatar in the input
    if (!user) return;
    UserService.getUserProfile(user.id).then((res) => setCurrentUser(res));
  }, [user]);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const data = await SolutionsService.getComments(solutionId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [solutionId]);

  const handleSortChange = (newSort: SolutionCommentSortBy) => {
    setSortBy(newSort);
    // Client-side sort
    const sorted = [...comments].sort((a, b) => {
      if (newSort === SolutionCommentSortBy.RECENT) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return b.upvoteCount - a.upvoteCount;
    });
    setComments(sorted);
  };

  const handleSubmitComment = async () => {
    if (!newCommentContent.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await SolutionsService.createComment(
        solutionId,
        newCommentContent
      );
      setComments((prev) => [newComment, ...prev]);
      setNewCommentContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySuccess = (newReply: SolutionComment) => {
    setComments((prev) => [...prev, newReply]);
    // Auto expand the parent to show the new reply
    if (newReply.parentCommentId) {
      const parentId = newReply.parentCommentId;
      setExpandedReplies((prev) => {
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    }
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

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, content, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Filter top-level comments for the main list
  // In a real app with nested comments, we'd likely have a recursive structure or filter by parentId === null
  const topLevelComments = comments.filter((c) => !c.parentCommentId);

  // Helper to get replies for a comment
  const getReplies = (parentId: string) => {
    return comments.filter((c) => c.parentCommentId === parentId);
  };

  return (
    <div className="space-y-6">
      {/* Header: Count & Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold">{comments.length} {t('comments')}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-600 dark:text-slate-400"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>
                {sortBy === SolutionCommentSortBy.RECENT
                  ? t('sort_newest')
                  : t('sort_most_voted')}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleSortChange(SolutionCommentSortBy.RECENT)}
            >
              {t('sort_newest')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange(SolutionCommentSortBy.MOST_VOTED)}
            >
              {t('sort_most_voted')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Input Section */}
      <div className="flex gap-4">
        <Avatar
          userId={currentUser?.id}
          className="w-10 h-10 border border-slate-200 dark:border-slate-700"
        >
          <AvatarImage src={currentUser?.avatarUrl} />
          <AvatarFallback>
            {currentUser?.firstName?.[0]}
            {currentUser?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={t('write_reply')}
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmitComment}
              disabled={!newCommentContent.trim() || isSubmitting}
            >
              {isSubmitting ? t('sending') : t('reply')}
            </Button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6">
        {isLoading
          ? // Skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          : topLevelComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4"
              >
                <CommentItem
                  comment={comment}
                  solutionId={solutionId}
                  onReplySuccess={handleReplySuccess}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
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
                        {t('view_replies', { count: comment.replyCounts || getReplies(comment.id).length })}
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
                          {t('hide_replies')}
                        </Button>

                        {getReplies(comment.id).map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg"
                          >
                            <CommentItem
                              comment={reply}
                              solutionId={solutionId}
                              onReplySuccess={handleReplySuccess}
                              onUpdate={handleUpdateComment}
                              onDelete={handleDeleteComment}
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
