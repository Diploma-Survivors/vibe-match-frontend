import { SolutionsService } from '@/services/solutions-service';
import {
  type PageInfo,
  type Solution,
  type SolutionFilters,
  type SolutionListRequest,
  type SolutionListResponse,
  SolutionSortBy,
} from '@/types/solutions';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 10;

interface UseSolutionsState {
  solutions: Solution[];
  pageInfo: PageInfo | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface UseSolutionsActions {
  handleFiltersChange: (newFilters: SolutionFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSortByChange: (newSortBy: SolutionSortBy) => void;
  handleSearch: () => void;
  handleReset: () => void;
  handleLoadMore: () => void;
  refresh: () => void;
}

interface UseSolutionsReturn extends UseSolutionsState, UseSolutionsActions {
  filters: SolutionFilters;
  keyword: string;
  sortBy: SolutionSortBy;
}

export default function useSolutions(problemId: string): UseSolutionsReturn {
  const [state, setState] = useState<UseSolutionsState>({
    solutions: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<SolutionFilters>({});
  const [keyword, setKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<SolutionSortBy>(SolutionSortBy.RECENT);

  const [request, setRequest] = useState<SolutionListRequest>({
    problemId,
    first: ITEMS_PER_PAGE,
    sortBy: SolutionSortBy.RECENT,
    filters: {},
  });

  const fetchSolutions = useCallback(async (req: SolutionListRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response: SolutionListResponse =
        await SolutionsService.getSolutions(req);

      const newSolutions = response.edges.map((edge) => edge.node);

      setState((prev) => ({
        ...prev,
        solutions: req.after
          ? [...prev.solutions, ...newSolutions]
          : newSolutions,
        pageInfo: response.pageInfos,
        totalCount: response.totalCount,
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error fetching solutions:', err);
      setState((prev) => ({
        ...prev,
        error: "Can't load solutions.",
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchSolutions(request);
  }, [request, fetchSolutions]);

  const updateRequest = useCallback(
    (updates: Partial<SolutionListRequest>, clearList = false) => {
      if (clearList) {
        setState((prev) => ({ ...prev, solutions: [] }));
      }
      setRequest((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleFiltersChange = useCallback(
    (newFilters: SolutionFilters) => {
      setFilters(newFilters);
      updateRequest({ filters: newFilters }, true);
    },
    [updateRequest]
  );

  const handleKeywordChange = useCallback(
    (newKeyword: string) => {
      setKeyword(newKeyword);
      updateRequest({ keyword: newKeyword.trim() || undefined }, true);
    },
    [updateRequest]
  );

  const handleSortByChange = useCallback(
    (newSortBy: SolutionSortBy) => {
      setSortBy(newSortBy);
      updateRequest({ sortBy: newSortBy }, true);
    },
    [updateRequest]
  );

  const handleSearch = useCallback(() => {
    updateRequest(
      {
        keyword: keyword.trim() || undefined,
        filters: { ...filters },
        after: undefined,
      },
      true
    );
  }, [keyword, filters, updateRequest]);

  const handleReset = useCallback(() => {
    setFilters({});
    setKeyword('');
    setSortBy(SolutionSortBy.RECENT);
    updateRequest(
      {
        keyword: undefined,
        filters: {},
        sortBy: SolutionSortBy.RECENT,
        after: undefined,
      },
      true
    );
  }, [updateRequest]);

  const handleLoadMore = useCallback(() => {
    if (state.isLoading || !state.pageInfo?.hasNextPage) return;
    updateRequest(
      {
        after: state.pageInfo.endCursor,
      },
      false
    );
  }, [state.isLoading, state.pageInfo, updateRequest]);

  const refresh = useCallback(() => {
    fetchSolutions(request);
  }, [fetchSolutions, request]);

  return {
    ...state,
    filters,
    keyword,
    sortBy,
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSearch,
    handleReset,
    handleLoadMore,
    refresh,
  };
}
