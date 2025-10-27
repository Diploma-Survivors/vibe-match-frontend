import { SubmissionsService } from '@/services/submissions-service';
import {
  type GetSubmissionListRequest,
  type PageInfo,
  type SubmissionEdge,
  type SubmissionFilters,
  type SubmissionListItem,
  type SubmissionListResponse,
  SubmissionStatus,
} from '@/types/submissions';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 10;

interface UseSubmissionsState {
  submissions: SubmissionEdge[];
  pageInfo: PageInfo | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface UseSubmissionsActions {
  handleFiltersChange: (newFilters: SubmissionFilters) => void;
  handleLoadMore: () => void;
}

interface UseSubmissionsReturn
  extends UseSubmissionsState,
    UseSubmissionsActions {
  // Request params (exposed for UI)
  filters: SubmissionFilters;
  problemId: string;
}

export default function useSubmissions(
  problemId: string
): UseSubmissionsReturn {
  // Main state to manage submissions and loading/error states
  const [state, setState] = useState<UseSubmissionsState>({
    submissions: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  // Request state to manage API request parameters
  const [request, setRequest] = useState<GetSubmissionListRequest>({
    first: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    matchMode: 'any',
  });

  // Filters state to manage filters
  const [filters, setFilters] = useState<SubmissionFilters>({});

  // Fetch submissions function
  const fetchSubmissions = useCallback(
    async (requestParams: GetSubmissionListRequest) => {
      if (!problemId) return;

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const axiosResponse = await SubmissionsService.getSubmissionList(
          requestParams,
          problemId
        );
        const response: SubmissionListResponse = axiosResponse?.data?.data;

        // Extract submissions from edges
        const submissionsData: SubmissionEdge[] =
          response?.edges?.map(
            (edge: { node: SubmissionListItem; cursor: string }) => ({
              node: edge.node,
              cursor: edge.cursor,
            })
          ) || [];

        setState((prev) => ({
          ...prev,
          submissions: requestParams.after
            ? [...prev.submissions, ...submissionsData]
            : submissionsData,
          pageInfo: response?.pageInfos,
          totalCount: response?.totalCount,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setState((prev) => ({
          ...prev,
          error: "Can't load the submissions.",
          isLoading: false,
        }));
      }
    },
    [problemId]
  );

  // Effect to fetch submissions when request or problemId changes
  useEffect(() => {
    if (problemId) {
      fetchSubmissions(request);
    }
  }, [request, fetchSubmissions, problemId]);

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetSubmissionListRequest>, clearSubmissions = false) => {
      if (clearSubmissions) {
        setState((prev) => ({ ...prev, submissions: [] }));
      }

      setRequest((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (filters: SubmissionFilters) => {
      // Filter out undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
          ([_, value]) => value !== undefined
        )
      );

      setFilters(cleanFilters);
      updateRequest({ filters: cleanFilters }, true);
    },
    [updateRequest]
  );

  // Handle load more for pagination
  const handleLoadMore = useCallback(() => {
    if (state.isLoading || !state.pageInfo?.hasNextPage) {
      return;
    }
    updateRequest(
      {
        after: state.pageInfo.endCursor,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      false
    );
  }, [state.isLoading, state.pageInfo, updateRequest]);

  return {
    // State
    submissions: state.submissions,
    pageInfo: state.pageInfo,
    totalCount: state.totalCount,
    isLoading: state.isLoading,
    error: state.error,

    // Request params (exposed for UI)
    filters,
    problemId,

    // Handlers
    handleFiltersChange,
    handleLoadMore,
  };
}
