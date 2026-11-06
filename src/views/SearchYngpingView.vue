<template>
  <PageContent>
    <SearchResults
      :loading="loading"
      :loading-more="loadingMore"
      :queries="queries"
      :results="results"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </PageContent>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import SearchResults from '@/search/components/SearchResults.vue';
import type { SearchResponse } from '@/search/types';
import {
  type SearchPageLoader,
  useSearchResults,
} from '@/search/useSearchResults';
import { apiV2Url } from '@/utils/api';

const route = useRoute();

const loadPage: SearchPageLoader = async ({ query, cursor, signal }) => {
  const response = await fetch(
    apiV2Url('/search/yngping/', {
      q: query,
      ...(cursor ? { cursor } : {}),
    }),
    { signal }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = (await response.json()) as SearchResponse;

  return data.data;
};

const { loading, loadingMore, queries, results, hasMore, search, loadMore } =
  useSearchResults(loadPage);

const updateTitle = () => {
  document.title = route.query.q
    ? `${route.query.q} - 检索`
    : '米时典 SeeDict - 检索';
};

watch(
  () => route.query.q,
  (newQ) => {
    if (typeof newQ !== 'string') return;

    updateTitle();
    void search(newQ);
  },
  { immediate: true }
);
</script>
