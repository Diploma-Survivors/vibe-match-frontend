'use client';

import { useDialog } from '@/components/providers/dialog-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-context';
import type { ProblemComment } from '@/types/problems';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageSquare,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProblemCommentItemProps {
  comment: ProblemComment;
  problemId: string;
  onReplySuccess: (newComment: ProblemComment) => void;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export default function ProblemCommentItem({
  comment: initialComment,
  problemId,
  onReplySuccess,
  onUpdate,
  onDelete,
}: ProblemCommentItemProps) {
  const { user } = useApp();
  const { confirm } = useDialog();
  const { t } = useTranslation('problems');
  const [comment, setComment] = useState(initialComment);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialComment.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const isAuthor = user?.id === comment.authorId;

  const handleVote = async (type: 'up_vote' | 'down_vote') => {
    // Mock voting logic
    try {
      if (comment.myVote === type) {
        // Unvote
        setComment((prev) => ({
          ...prev,
          myVote: null,
          upvoteCount:
            type === 'up_vote' ? prev.upvoteCount - 1 : prev.upvoteCount,
          downvoteCount:
            type === 'down_vote' ? prev.downvoteCount - 1 : prev.downvoteCount,
        }));
      } else {
        // Vote
        setComment((prev) => ({
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
      console.error('Error voting comment:', error);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setIsSubmittingReply(true);
    try {
      // Mock reply creation
      const newReply: ProblemComment = {
        id: Math.random().toString(36).substr(2, 9),
        problemId,
        authorId: user?.id || 0,
        content: replyContent,
        upvoteCount: 0,
        downvoteCount: 0,
        myVote: null,
        parentCommentId: comment.id,
        replyCounts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onReplySuccess(newReply);
      setIsReplying(false);
      setReplyContent('');
    } catch (error) {
      console.error('Error replying:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    setIsSubmittingEdit(true);
    try {
      // Mock update
      await new Promise((resolve) => setTimeout(resolve, 500));

      setComment((prev) => ({
        ...prev,
        content: editContent,
        updatedAt: new Date().toISOString(),
      }));
      onUpdate(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    const result = await confirm({
      title: t('delete_comment'),
      message: t('confirm_delete_comment'),
      confirmText: t('delete'),
      cancelText: t('cancel'),
      color: 'red',
    });

    if (result) {
      try {
        // Mock delete
        await new Promise((resolve) => setTimeout(resolve, 500));
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="flex gap-3 group">
      <Avatar
        userId={comment.authorId}
        className="w-8 h-8 border border-slate-200 dark:border-slate-700 mt-1"
      >
        <AvatarImage src={comment.author?.avatarUrl} />
        <AvatarFallback>
          {comment.author?.firstName?.[0]}
          {comment.author?.lastName?.[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {comment.author?.firstName} {comment.author?.lastName}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-slate-400 italic">({t('edited')})</span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleEditSubmit}
                disabled={!editContent.trim() || isSubmittingEdit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmittingEdit ? t('saving') : t('save')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap">
            {comment.content}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote('up_vote')}
              className={`flex cursor-pointer items-center gap-1 hover:text-green-600 transition-colors ${
                comment.myVote === 'up_vote' ? 'text-green-600' : ''
              }`}
            >
              <ArrowBigUp
                className={`w-4 h-4 ${
                  comment.myVote === 'up_vote' ? 'fill-current' : ''
                }`}
              />
              <span>{comment.upvoteCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote('down_vote')}
              className={`flex cursor-pointer items-center gap-1 hover:text-red-600 transition-colors ${
                comment.myVote === 'down_vote' ? 'text-red-600' : ''
              }`}
            >
              <ArrowBigDown
                className={`w-4 h-4 ${
                  comment.myVote === 'down_vote' ? 'fill-current' : ''
                }`}
              />
              <span>{comment.downvoteCount}</span>
            </button>
          </div>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('reply')}</span>
          </button>

          {isAuthor && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{t('edit')}</span>
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('delete')}</span>
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Textarea
              value={replyContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReplyContent(e.target.value)
              }
              placeholder={t('write_reply')}
              className="min-h-[80px] text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isSubmittingReply}
              >
                {isSubmittingReply ? t('sending') : t('reply')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
