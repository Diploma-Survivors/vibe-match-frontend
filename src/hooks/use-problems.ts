import { ProblemsService } from '@/services/problems-service';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import {
  type GetProblemListRequest,
  MatchMode,
  type PageInfo,
  type ProblemFilters,
  type ProblemListItem,
  type ProblemListResponse,
  SortBy,
  SortOrder,
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const ITEMS_PER_PAGE = 20;

interface UseProblemsState {
  problems: ProblemListItem[];
  pageInfo: PageInfo | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface UseProblemsActions {
  handleFiltersChange: (newFilters: ProblemFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSortByChange: (newSortBy: SortBy) => void;
  handleSortOrderChange: (newSortOrder: SortOrder) => void;
  handleReset: () => void;
  handleLoadMore: () => void;
}

interface UseProblemsReturn extends UseProblemsState, UseProblemsActions {
  // Request params (exposed for UI)
  filters: ProblemFilters;
  keyword: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  // Metadata
  tags: Tag[];
  topics: Topic[];
  isMetadataLoading: boolean;
}

export default function useProblems(): UseProblemsReturn {
  // Main state to manage problems and loading/error states
  const [state, setState] = useState<UseProblemsState>({
    problems: [],
    pageInfo: null,
    totalCount: 0,
    isLoading: false,
    error: null,
  });

  // Metadata state
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);

  // states for filters and keyword to manage input values
  const [filters, setFilters] = useState<ProblemFilters>({});
  const [keyword, setKeyword] = useState<string>('');

  // state for sorting
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.TITLE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  // Request state to manage API request parameters
  const [request, setRequest] = useState<GetProblemListRequest>({
    first: ITEMS_PER_PAGE,
    sortBy: sortBy || SortBy.TITLE,
    sortOrder: sortOrder || SortOrder.ASC,
    matchMode: MatchMode.ANY,
    filters: {
      ...filters,
    },
  });

  // Fetch Metadata
  const fetchMetadata = useCallback(async () => {
    setIsMetadataLoading(true);
    try {
      const [tagsData, topicsData] = await Promise.all([
        TagsService.getAllTags(),
        TopicsService.getAllTopics(),
      ]);
      setTags(tagsData);
      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching tags or topics:', error);
    } finally {
      setIsMetadataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Fetch problems function
  const fetchProblems = useCallback(
    async (requestParams: GetProblemListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const axiosResponse =
          await ProblemsService.getProblemListForTraining(requestParams);
        const response: ProblemListResponse = axiosResponse?.data?.data;

        // Extract problems from edges
        const problemsData: ProblemListItem[] =
          response?.edges?.map((edge) => ({
            ...edge.node,
          })) || [];

        setState((prev) => ({
          ...prev,
          problems: requestParams.after
            ? [...prev.problems, ...problemsData]
            : problemsData,
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

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetProblemListRequest>, clearProblems = false) => {
      if (clearProblems) {
        setState((prev) => ({ ...prev, problems: [] }));
      }

      setRequest((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // Debounced search for keyword
  const debouncedSearch = useDebouncedCallback((searchKeyword: string, currentFilters: ProblemFilters) => {
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

  // handle filter changes - Instant update
  const handleFiltersChange = useCallback((newFilters: ProblemFilters) => {
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

  // handle keyword changes - Debounced update
  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    debouncedSearch(newKeyword, filters);
  }, [filters, debouncedSearch]);

  // handle sorting changes
  const handleSortByChange = useCallback(
    (newSortBy: SortBy) => {
      setSortBy(newSortBy);
      updateRequest({ sortBy: newSortBy }, false);
    },
    [updateRequest]
  );

  const handleSortOrderChange = useCallback(
    (newSortOrder: SortOrder) => {
      setSortOrder(newSortOrder);
      updateRequest({ sortOrder: newSortOrder }, false);
    },
    [updateRequest]
  );

  // handle load more for pagination
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

  // handle reset
  const handleReset = useCallback(() => {
    setFilters({});
    setKeyword('');

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

    // Metadata
    tags,
    topics,
    isMetadataLoading,

    // Request params (exposed for UI)
    filters,
    keyword,
    sortBy,
    sortOrder,

    // Handlers
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSortOrderChange,
    handleReset,
    handleLoadMore,
  };
}
