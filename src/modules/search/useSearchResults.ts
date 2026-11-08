import { onScopeDispose, ref } from 'vue';

import type { SearchResult } from './types';

export interface SearchPage {
  queries: string[];
  results: SearchResult[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SearchPageRequest {
  query: string;
  cursor: string | null;
  signal: AbortSignal;
}

export type SearchPageLoader = (
  request: SearchPageRequest
) => Promise<SearchPage>;

export function useSearchResults(loadPage: SearchPageLoader) {
  const query = ref('');

  const loading = ref(false);
  const loadingMore = ref(false);

  const queries = ref<string[]>([]);
  const results = ref<SearchResult[]>([]);
  const nextCursor = ref<string | null>(null);
  const hasMore = ref(false);

  let version = 0;
  let activeController: AbortController | null = null;

  const abortActiveRequest = () => {
    activeController?.abort();
    activeController = null;
  };

  const search = async (nextQuery: string): Promise<boolean> => {
    const requestVersion = ++version;

    abortActiveRequest();

    const controller = new AbortController();
    activeController = controller;

    query.value = nextQuery;

    loading.value = true;
    loadingMore.value = false;

    queries.value = [];
    results.value = [];
    nextCursor.value = null;
    hasMore.value = false;

    try {
      const page = await loadPage({
        query: nextQuery,
        cursor: null,
        signal: controller.signal,
      });

      if (controller.signal.aborted || requestVersion !== version) {
        return false;
      }

      queries.value = page.queries;
      results.value = page.results;
      nextCursor.value = page.nextCursor;
      hasMore.value = page.hasMore;

      return true;
    } catch (error) {
      if (controller.signal.aborted || requestVersion !== version) {
        return false;
      }

      console.error('failed to request: ', error);
      return false;
    } finally {
      if (requestVersion === version) {
        loading.value = false;

        if (activeController === controller) {
          activeController = null;
        }
      }
    }
  };

  const loadMore = async (): Promise<boolean> => {
    const cursor = nextCursor.value;

    if (!cursor || loading.value || loadingMore.value) {
      return false;
    }

    const requestVersion = version;
    const requestQuery = query.value;

    const controller = new AbortController();
    activeController = controller;

    loadingMore.value = true;

    try {
      const page = await loadPage({
        query: requestQuery,
        cursor,
        signal: controller.signal,
      });

      if (
        controller.signal.aborted ||
        requestVersion !== version ||
        requestQuery !== query.value
      ) {
        return false;
      }

      results.value.push(...page.results);
      nextCursor.value = page.nextCursor;
      hasMore.value = page.hasMore;

      return true;
    } catch (error) {
      if (controller.signal.aborted || requestVersion !== version) {
        return false;
      }

      console.error('failed to load more: ', error);
      return false;
    } finally {
      if (requestVersion === version) {
        loadingMore.value = false;

        if (activeController === controller) {
          activeController = null;
        }
      }
    }
  };

  onScopeDispose(() => {
    ++version;
    abortActiveRequest();
  });

  return {
    query,

    loading,
    loadingMore,

    queries,
    results,
    hasMore,

    search,
    loadMore,
  };
}
