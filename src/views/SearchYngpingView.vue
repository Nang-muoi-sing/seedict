<template>
  <DefaultLayout>
    <SearchResults
      :loading="loading"
      :loading-more="loadingMore"
      :queries="queries"
      :results="results"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import SearchResults from '@/modules/search/components/SearchResults.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

import { watch } from 'vue';
import { useRoute } from 'vue-router';

import type { SearchResponse } from '@/modules/search/types';
import {
  type SearchPageLoader,
  useSearchResults,
} from '@/modules/search/useSearchResults';
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
