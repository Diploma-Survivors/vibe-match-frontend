'use client';

import { useDialog } from '@/components/providers/dialog-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/app-context';
import { SolutionsService } from '@/services/solutions-service';
import type { SolutionComment } from '@/types/solutions';
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

interface CommentItemProps {
  comment: SolutionComment;
  solutionId: string;
  onReplySuccess: (newComment: SolutionComment) => void;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({
  comment: initialComment,
  solutionId,
  onReplySuccess,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const { user } = useApp();
  const { confirm } = useDialog();
  const [comment, setComment] = useState(initialComment);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialComment.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const isAuthor = user?.userId === comment.authorId;

  const handleVote = async (type: 'up_vote' | 'down_vote') => {
    try {
      if (comment.myVote === type) {
        await SolutionsService.unreactComment(comment.id);
        setComment((prev) => ({
          ...prev,
          myVote: null,
          upvoteCount:
            type === 'up_vote' ? prev.upvoteCount - 1 : prev.upvoteCount,
          downvoteCount:
            type === 'down_vote' ? prev.downvoteCount - 1 : prev.downvoteCount,
        }));
      } else {
        await SolutionsService.reactComment(comment.id, type);
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
      const newReply = await SolutionsService.createComment(
        solutionId,
        replyContent,
        comment.id
      );
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
      const updatedComment = await SolutionsService.updateComment(
        comment.id,
        editContent
      );
      setComment(updatedComment);
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
      title: 'Xóa bình luận',
      message: 'Bạn có chắc chắn muốn xóa bình luận này không?',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      color: 'red',
    });

    if (result) {
      try {
        await SolutionsService.deleteComment(comment.id);
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="flex gap-3 group">
      <Avatar className="w-8 h-8 border border-slate-200 dark:border-slate-700 mt-1">
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
              <span className="text-slate-400 italic">(đã chỉnh sửa)</span>
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
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleEditSubmit}
                disabled={!editContent.trim() || isSubmittingEdit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmittingEdit ? 'Đang lưu...' : 'Lưu'}
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
            <span>Reply</span>
          </button>

          {isAuthor && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
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
              placeholder="Viết câu trả lời..."
              className="min-h-[80px] text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                Hủy
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isSubmittingReply}
              >
                {isSubmittingReply ? 'Đang gửi...' : 'Trả lời'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
