import { commentService } from '@/services/comment-service';
import {
  CreateProblemCommentRequest,
  ProblemCommentSortBy,
  ReportProblemCommentRequest,
  UpdateProblemCommentRequest,
  VoteProblemCommentRequest,
} from '@/types/comments';
import { useState } from 'react';
import useSWR from 'swr';

export function useComments(problemId: string | number) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortByState] = useState<ProblemCommentSortBy>(
    ProblemCommentSortBy.TOP
  );

  const setSortBy = (newSortBy: ProblemCommentSortBy) => {
    setSortByState(newSortBy);
    setPage(1); // Reset page when sort changes
  };

  const { data, error, isLoading, mutate } = useSWR(
    problemId ? [`/problems/${problemId}/comments`, page, limit, sortBy] : null,
    () =>
      commentService.getComments(problemId, {
        page,
        limit,
        sortBy,
      })
  );

  const createComment = async (data: CreateProblemCommentRequest) => {
    try {
      const newComment = await commentService.createComment(problemId, data);
      await mutate(); // Revalidate comments
      return newComment;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  };

  const updateComment = async (
    id: number,
    data: UpdateProblemCommentRequest
  ) => {
    try {
      const updatedComment = await commentService.updateComment(id, data);
      await mutate();
      return updatedComment;
    } catch (error) {
      console.error('Failed to update comment:', error);
      throw error;
    }
  };

  const deleteComment = async (id: number, parentId?: number | null) => {
    try {
      await commentService.deleteComment(id);
      
      // Optimistic update
      await mutate((currentData) => {
        if (!currentData) return currentData;

        // If it's a top-level comment
        if (!parentId) {
          return {
            ...currentData,
            data: currentData.data.filter((c) => c.id !== id),
            meta: {
              ...currentData.meta,
              total: currentData.meta.total - 1,
            },
          };
        }

        // If it's a reply, find the parent and remove the reply
        return {
          ...currentData,
          data: currentData.data.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies?.filter((r) => r.id !== id),
                replyCount: Math.max(0, comment.replyCount - 1),
              };
            }
            return comment;
          }),
        };
      }, false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  };

  const voteComment = async (id: number, data: VoteProblemCommentRequest) => {
    try {
      // Optimistic update could be implemented here, but for now we'll just revalidate
      await commentService.voteComment(id, data);
      await mutate();
    } catch (error) {
      console.error('Failed to vote comment:', error);
      throw error;
    }
  };

  const unvoteComment = async (id: number) => {
    try {
      await commentService.unvoteComment(id);
      await mutate();
    } catch (error) {
      console.error('Failed to unvote comment:', error);
      throw error;
    }
  };

  const reportComment = async (
    id: number,
    data: ReportProblemCommentRequest
  ) => {
    try {
      await commentService.reportComment(id, data);
    } catch (error) {
      console.error('Failed to report comment:', error);
      throw error;
    }
  };

  const fetchReplies = async (id: number) => {
    try {
      const commentWithReplies = await commentService.getComment(id);
      await mutate((currentData) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          data: currentData.data.map((c) =>
            c.id === id ? commentWithReplies : c
          ),
        };
      }, false);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
      throw error;
    }
  };

  return {
    comments: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    page,
    setPage,
    sortBy,
    setSortBy,
    createComment,
    updateComment,
    deleteComment,
    voteComment,
    unvoteComment,
    reportComment,
    fetchReplies,
  };
}
