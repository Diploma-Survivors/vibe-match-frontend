import { ProblemsService } from '@/services/problems-service';
import {
  type GetProblemListRequest,
  type PageInfo,
  ProblemEndpointType,
  type ProblemFilters,
  type ProblemItemList,
  type ProblemListResponse,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface UseProblemsState {
  problems: ProblemItemList[];
  pageInfo: PageInfo | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface UseProblemsActions {
  handleFiltersChange: (newFilters: ProblemFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSearch: () => void;
  handleReset: () => void;
  handleSortChange: (field: SortBy, order: SortOrder) => void;
  handleLoadMore: () => void;
  handleRemoveFilter: (key: keyof ProblemFilters) => void;
  handleClearAllFilters: () => void;
}

interface UseProblemsReturn extends UseProblemsState, UseProblemsActions {
  // Expose request state for UI
  filters: ProblemFilters;
  keyword: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export function useProblems(): UseProblemsReturn {
  const [state, setState] = useState<UseProblemsState>({
    problems: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  const [request, setRequest] = useState<GetProblemListRequest>({
    first: ITEMS_PER_PAGE,
    sortBy: SortBy.TITLE,
    sortOrder: SortOrder.ASC,
    filters: {},
  });

  // Fetch problems function
  const fetchProblems = useCallback(
    async (requestParams: GetProblemListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        console.log('Fetching problems with request:', requestParams);

        const axiosResponse = await ProblemsService.getProblemList(
          requestParams,
          ProblemEndpointType.TRAINING
        );

        const response: ProblemListResponse = axiosResponse?.data?.data;

        // Extract problems from edges
        const problemsData =
          response?.edges?.map((edge) => ({
            ...edge.node,
          })) || [];

        console.log(`Fetched ${problemsData.length} problems`);

        setState((prev) => ({
          ...prev,
          problems: requestParams.after
            ? [...prev.problems, ...problemsData] // Append for pagination
            : problemsData, // Replace for new search/sort
          pageInfo: response?.pageInfos,
          totalCount: response?.totalCount,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Error fetching problems:', err);
        setState((prev) => ({
          ...prev,
          error: "Can't load the problems.",
          isLoading: false,
        }));
      }
    },
    []
  );

  // Effect to fetch problems when request changes
  useEffect(() => {
    fetchProblems(request);
  }, [request, fetchProblems]);

  // Helper function to clean filters (remove empty/undefined values)
  const cleanFilters = useCallback(
    (filters: ProblemFilters): ProblemFilters => {
      const cleaned: ProblemFilters = {};

      if (filters.difficulty) {
        cleaned.difficulty = filters.difficulty;
      }

      if (filters.topic) {
        cleaned.topic = filters.topic;
      }

      if (filters.tags && filters.tags.length > 0) {
        cleaned.tags = filters.tags;
      }

      if (filters.type) {
        cleaned.type = filters.type;
      }

      return cleaned;
    },
    []
  );

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetProblemListRequest>, clearProblems = false) => {
      if (clearProblems) {
        setState((prev) => ({ ...prev, problems: [] }));
      }

      setRequest((prev) => {
        const newRequest: GetProblemListRequest = {
          ...prev,
          ...updates,
        };

        // Clean filters if provided
        if (updates.filters !== undefined) {
          const cleanedFilters = cleanFilters(updates.filters);
          newRequest.filters =
            Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined;
        }

        // Clean keyword
        if (updates.keyword !== undefined) {
          newRequest.keyword = updates.keyword.trim() || undefined;
        }

        return newRequest;
      });
    },
    [cleanFilters]
  );

  // Actions
  const handleFiltersChange = useCallback(
    (newFilters: ProblemFilters) => {
      updateRequest({ filters: newFilters }, false);
      console.log('Filters changed:', newFilters);
    },
    [updateRequest]
  );

  const handleKeywordChange = useCallback(
    (newKeyword: string) => {
      updateRequest({ keyword: newKeyword }, false);
    },
    [updateRequest]
  );

  const handleSearch = useCallback(() => {
    // Reset to first page with current filters/keyword
    updateRequest(
      {
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      true
    );
  }, [updateRequest]);

  const handleReset = useCallback(() => {
    updateRequest(
      {
        keyword: undefined,
        filters: {},
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      true
    );
  }, [updateRequest]);

  const handleSortChange = useCallback(
    (field: SortBy, order: SortOrder) => {
      updateRequest(
        {
          sortBy: field,
          sortOrder: order,
          after: undefined,
          before: undefined,
          first: ITEMS_PER_PAGE,
          last: undefined,
        },
        true
      );
    },
    [updateRequest]
  );

  const handleLoadMore = useCallback(() => {
    console.log('handleLoadMore called', {
      isLoading: state.isLoading,
      hasNextPage: state.pageInfo?.hasNextPage,
      endCursor: state.pageInfo?.endCursor,
    });

    if (state.isLoading || !state.pageInfo?.hasNextPage) {
      console.log('Skipping load more - already loading or no more data');
      return;
    }

    console.log('Loading more problems...');

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

  const handleRemoveFilter = useCallback(
    (key: keyof ProblemFilters) => {
      const newFilters = { ...(request.filters || {}) };
      delete newFilters[key];

      updateRequest(
        {
          filters: newFilters,
          after: undefined,
          before: undefined,
          first: ITEMS_PER_PAGE,
          last: undefined,
        },
        true
      );
    },
    [request.filters, updateRequest]
  );

  const handleClearAllFilters = useCallback(() => {
    updateRequest(
      {
        keyword: undefined,
        filters: {},
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      true
    );
  }, [updateRequest]);

  return {
    // State
    problems: state.problems,
    pageInfo: state.pageInfo,
    totalCount: state.totalCount,
    isLoading: state.isLoading,
    error: state.error,

    // Request params (exposed for UI)
    filters: request.filters || {},
    keyword: request.keyword || '',
    sortBy: request.sortBy || SortBy.TITLE,
    sortOrder: request.sortOrder || SortOrder.ASC,

    // Actions
    handleFiltersChange,
    handleKeywordChange,
    handleSearch,
    handleReset,
    handleSortChange,
    handleLoadMore,
    handleRemoveFilter,
    handleClearAllFilters,
  };
}
