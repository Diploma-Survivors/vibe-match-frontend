import { ContestsService } from '@/services/contests-service';
import {
  type ContestItemList,
  type ContestListResponse,
  type GetContestListRequest,
  MatchMode,
  type PageInfo,
  SortBy,
  SortOrder,
} from '@/types/contests';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface ContestFilters {
  startTime?: string;
  endTime?: string;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
}

interface UseContestsState {
  contests: ContestItemList[];
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
  handleSortChange: (field: SortBy, order: SortOrder) => void;
  handleLoadMore: () => void;
  handleRemoveFilter: (key: keyof ContestFilters) => void;
  handleClearAllFilters: () => void;
}

interface UseContestsReturn extends UseContestsState, UseContestsActions {
  // Expose request state for UI
  filters: ContestFilters;
  keyword: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  matchMode: MatchMode;
}

export function useContests(): UseContestsReturn {
  const [state, setState] = useState<UseContestsState>({
    contests: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  const [request, setRequest] = useState<GetContestListRequest>({
    first: ITEMS_PER_PAGE,
    sortBy: SortBy.START_TIME,
    sortOrder: SortOrder.DESC,
    matchMode: MatchMode.ANY,
  });

  // Fetch contests function
  const fetchContests = useCallback(
    async (requestParams: GetContestListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        console.log('Fetching contests with request:', requestParams);

        const axiosResponse =
          await ContestsService.getContestList(requestParams);

        const response: ContestListResponse = axiosResponse?.data?.data;

        // Extract contests from edges
        const contestsData =
          response?.edges?.map((edge) => ({
            ...edge.node,
          })) || [];

        console.log(`Fetched ${contestsData.length} contests`);

        setState((prev) => ({
          ...prev,
          contests: requestParams.after
            ? [...prev.contests, ...contestsData] // Append for pagination
            : contestsData, // Replace for new search/sort
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

  // Helper function to clean filters (remove empty/undefined values)
  const cleanFilters = useCallback(
    (filters: ContestFilters): ContestFilters => {
      const cleaned: ContestFilters = {};

      if (filters.startTime) {
        cleaned.startTime = filters.startTime;
      }

      if (filters.endTime) {
        cleaned.endTime = filters.endTime;
      }

      if (filters.minDurationMinutes !== undefined) {
        cleaned.minDurationMinutes = filters.minDurationMinutes;
      }

      if (filters.maxDurationMinutes !== undefined) {
        cleaned.maxDurationMinutes = filters.maxDurationMinutes;
      }

      return cleaned;
    },
    []
  );

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetContestListRequest>, clearContests = false) => {
      if (clearContests) {
        setState((prev) => ({ ...prev, contests: [] }));
      }

      setRequest((prev) => {
        const newRequest: GetContestListRequest = {
          ...prev,
          ...updates,
        };

        // Apply filters to request
        if (updates.startTime !== undefined) {
          newRequest.startTime = updates.startTime || undefined;
        }

        if (updates.endTime !== undefined) {
          newRequest.endTime = updates.endTime || undefined;
        }

        if (updates.minDurationMinutes !== undefined) {
          newRequest.minDurationMinutes = updates.minDurationMinutes;
        }

        if (updates.maxDurationMinutes !== undefined) {
          newRequest.maxDurationMinutes = updates.maxDurationMinutes;
        }

        // Clean keyword
        if (updates.keyword !== undefined) {
          newRequest.keyword = updates.keyword.trim() || undefined;
        }

        return newRequest;
      });
    },
    []
  );

  // Actions
  const handleFiltersChange = useCallback(
    (newFilters: ContestFilters) => {
      updateRequest(
        {
          startTime: newFilters.startTime,
          endTime: newFilters.endTime,
          minDurationMinutes: newFilters.minDurationMinutes,
          maxDurationMinutes: newFilters.maxDurationMinutes,
        },
        false
      );
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
        startTime: undefined,
        endTime: undefined,
        minDurationMinutes: undefined,
        maxDurationMinutes: undefined,
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

    console.log('Loading more contests...');

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
    (key: keyof ContestFilters) => {
      updateRequest(
        {
          [key]: undefined,
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

  const handleClearAllFilters = useCallback(() => {
    updateRequest(
      {
        keyword: undefined,
        startTime: undefined,
        endTime: undefined,
        minDurationMinutes: undefined,
        maxDurationMinutes: undefined,
        after: undefined,
        before: undefined,
        first: ITEMS_PER_PAGE,
        last: undefined,
      },
      true
    );
  }, [updateRequest]);

  // Extract current filters from request
  const filters: ContestFilters = {
    startTime: request.startTime,
    endTime: request.endTime,
    minDurationMinutes: request.minDurationMinutes,
    maxDurationMinutes: request.maxDurationMinutes,
  };

  return {
    // State
    contests: state.contests,
    pageInfo: state.pageInfo,
    totalCount: state.totalCount,
    isLoading: state.isLoading,
    error: state.error,

    // Request params (exposed for UI)
    filters,
    keyword: request.keyword || '',
    sortBy: request.sortBy || SortBy.START_TIME,
    sortOrder: request.sortOrder || SortOrder.DESC,
    matchMode: request.matchMode || MatchMode.ANY,

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
