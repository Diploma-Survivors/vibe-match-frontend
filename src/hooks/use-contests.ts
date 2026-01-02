// import { ContestsService } from '@/services/contests-service';
import { MOCK_CONTESTS } from '@/data/mock-contests';
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
import { useDebouncedCallback } from 'use-debounce';

const ITEMS_PER_PAGE = 20;

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
  handleReset: () => void;
  handleLoadMore: () => void;
}

interface UseContestsReturn extends UseContestsState, UseContestsActions {
  // Request params (exposed for UI)
  keyword: string;
  filters: ContestFilters;
}

export default function useContests(): UseContestsReturn {
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

        // const axiosResponse =
        //   await ContestsService.getContestList(requestParams);

        // const response: ContestListResponse = axiosResponse?.data?.data;

        // SIMULATE API CALL WITH MOCK DATA
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

        let filteredContests = [...MOCK_CONTESTS];

        // Apply keyword filter
        if (requestParams.keyword) {
          const lowerKeyword = requestParams.keyword.toLowerCase();
          filteredContests = filteredContests.filter(c =>
            c.name.toLowerCase().includes(lowerKeyword)
          );
        }

        // Apply status filter
        if (
          requestParams.filters?.status &&
          requestParams.filters.status.length > 0
        ) {
          filteredContests = filteredContests.filter((contest) =>
            requestParams.filters?.status?.includes(contest.status)
          );
        }

        const totalCount = filteredContests.length;

        // Mock pagination
        const itemsPerPage = requestParams.first || ITEMS_PER_PAGE;
        let startIndex = 0;

        if (requestParams.after) {
          const lastIndex = filteredContests.findIndex(c => c.id === requestParams.after);
          if (lastIndex !== -1) {
            startIndex = lastIndex + 1;
          }
        }

        const slicedContests = filteredContests.slice(startIndex, startIndex + itemsPerPage);

        const hasNextPage = startIndex + itemsPerPage < totalCount;
        const endCursor = slicedContests.length > 0 ? slicedContests[slicedContests.length - 1].id : '';

        // Extract contests from edges
        let contestsData: ContestListItem[] = slicedContests;

        /*
        let contestsData: ContestListItem[] =
          response?.edges?.map((edge) => ({
            ...edge.node,
          })) || [];

        // Filter by status on frontend if status filters are present (if backend doesn't support it fully or for extra safety)
        if (
          requestParams.filters?.status &&
          requestParams.filters.status.length > 0
        ) {
          contestsData = contestsData.filter((contest) =>
            requestParams.filters?.status?.includes(contest.status)
          );
        }
        */

        setState((prev) => ({
          ...prev,
          contests: requestParams.after
            ? [...prev.contests, ...contestsData]
            : contestsData,
          pageInfo: {
            hasNextPage,
            hasPreviousPage: false, // Not implementing previous page for infinite scroll usually
            startCursor: '',
            endCursor
          },
          totalCount: totalCount,
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

  // Debounced search for keyword
  const debouncedSearch = useDebouncedCallback((searchKeyword: string, currentFilters: ContestFilters) => {
    updateRequest(
      {
        keyword: searchKeyword.trim() || undefined,
        filters: currentFilters,
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
      },
      true
    );
  }, 500);

  // handle filter changes
  const handleFiltersChange = useCallback((newFilters: ContestFilters) => {
    setFilters(newFilters);
    updateRequest(
      {
        filters: newFilters,
        keyword: keyword.trim() || undefined,
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
      },
      true
    );
  }, [keyword, updateRequest]);

  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    debouncedSearch(newKeyword, filters);
  }, [filters, debouncedSearch]);

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

  const handleReset = useCallback(() => {
    setKeyword('');
    setFilters({
      startTime: undefined,
      endTime: undefined,
      minDurationMinutes: undefined,
      maxDurationMinutes: undefined,
      status: [],
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
    handleReset,
    handleLoadMore,
  };
}
