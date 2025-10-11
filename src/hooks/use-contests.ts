import { ContestsService } from '@/services/contests-service';
import {
  type ContestFilters,
  type ContestListItem,
  type ContestListRequest,
  type ContestListResponse,
  MatchMode,
  type PageInfo,
  SortBy,
  SortOrder,
} from '@/types/contests';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 3;

interface UseContestsState {
  contests: ContestListItem[];
  pageInfo: PageInfo | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface UseContestsActions {
  handleFiltersChange: (newFilters: ContestFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSearch: () => void;
  handleReset: () => void;
  handleLoadMore: () => void;
}

interface UseContestsReturn extends UseContestsState, UseContestsActions {
  keyword: string;
  filters: ContestFilters;
}

export function useContests(): UseContestsReturn {
  // Main state to manage contests and loading/error states
  const [state, setState] = useState<UseContestsState>({
    contests: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  // states for filters and keyword to manage input values
  const [filters, setFilters] = useState<ContestFilters>({});
  const [keyword, setKeyword] = useState<string>('');

  // Request state to manage API request parameters
  const [request, setRequest] = useState<ContestListRequest>({
    first: ITEMS_PER_PAGE,
    sortBy: SortBy.START_TIME,
    sortOrder: SortOrder.DESC,
    matchMode: MatchMode.ANY,
    filters: {
      ...filters,
    },
  });

  // Fetch contests function
  const fetchContests = useCallback(
    async (requestParams: ContestListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const axiosResponse =
          await ContestsService.getContestList(requestParams);

        const response: ContestListResponse = axiosResponse?.data?.data;

        // Extract contests from edges
        const contestsData =
          response?.edges?.map((edge) => ({
            ...edge.node,
          })) || [];

        setState((prev) => ({
          ...prev,
          contests: requestParams.after
            ? [...prev.contests, ...contestsData]
            : contestsData,
          pageInfo: response?.pageInfos,
          totalCount: response?.totalCount,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Error fetching contests:', err);
        setState((prev) => ({
          ...prev,
          error: "Can't load the contests.",
          isLoading: false,
        }));
      }
    },
    []
  );

  // Effect to fetch contests when request changes
  useEffect(() => {
    fetchContests(request);
  }, [request, fetchContests]);

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<ContestListRequest>, clearContests = false) => {
      if (clearContests) {
        setState((prev) => ({ ...prev, contests: [] }));
      }

      setRequest((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // handle filter and keyword changes
  const handleFiltersChange = useCallback((newFilters: ContestFilters) => {
    setFilters(newFilters);
  }, []);

  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
  }, []);

  // Load more contests for pagination
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

  // Search and Reset handlers
  const handleSearch = useCallback(() => {
    const trimmedKeyword = keyword.trim();

    updateRequest(
      {
        filters: {
          ...filters,
        },
        keyword: trimmedKeyword || undefined,
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      true
    );
  }, [filters, keyword, updateRequest]);

  const handleReset = useCallback(() => {
    setKeyword('');
    setFilters({
      startTime: undefined,
      endTime: undefined,
      minDurationMinutes: undefined,
      maxDurationMinutes: undefined,
    });

    updateRequest(
      {
        filters: {},
        keyword: undefined,
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
    contests: state.contests,
    pageInfo: state.pageInfo,
    totalCount: state.totalCount,
    isLoading: state.isLoading,
    error: state.error,

    // Expose request state for UI
    keyword: keyword,
    filters: filters,

    // Actions
    handleKeywordChange,
    handleFiltersChange,
    handleSearch,
    handleReset,
    handleLoadMore,
  };
}
