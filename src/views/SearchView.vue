<template>
  <PageContent>
    <SearchResults
      :loading="loading"
      :loading-more="loadingMore"
      :queries="queries"
      :results="allResults"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </PageContent>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import SearchResults from '@/search/components/SearchResults.vue';
import type { SearchResult, SearchResponse } from '@/search/types';
import { apiV1Url } from '@/utils/api';

const route = useRoute();

const loading = ref(false);
const loadingMore = ref(false);

const query = ref((route.query.q as string) || '');
const queries = ref<string[]>([]);
const allResults = ref<SearchResult[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

const updateTitle = () => {
  document.title = route.query.q
    ? `${route.query.q} - 检索`
    : '米时典 SeeDict - 检索';
};

const performSearch = async () => {
  loading.value = true;
  allResults.value = [];
  nextCursor.value = null;
  hasMore.value = false;

  try {
    const response = await fetch(apiV1Url('/search/', { q: query.value }));

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    queries.value = data.data.queries;
    allResults.value = data.data.results;
    nextCursor.value = data.data.nextCursor;
    hasMore.value = data.data.hasMore;
  } catch (error) {
    console.error('搜索请求失败:', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (!nextCursor.value || loadingMore.value) return;

  loadingMore.value = true;

  try {
    const response = await fetch(
      apiV1Url('/search/', {
        q: query.value,
        cursor: nextCursor.value,
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    allResults.value.push(...data.data.results);
    nextCursor.value = data.data.nextCursor;
    hasMore.value = data.data.hasMore;
  } catch (error) {
    console.error('加载更多失败:', error);
  } finally {
    loadingMore.value = false;
  }
};

watch(
  () => route.query.q,
  (newQ) => {
    if (typeof newQ !== 'string') return;

    query.value = newQ;
    updateTitle();
    performSearch();
  },
  { immediate: true }
);
</script>
