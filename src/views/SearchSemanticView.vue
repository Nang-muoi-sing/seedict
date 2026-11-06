<template>
  <PageContent :on-search-submit="handleSearchSubmit">
    <SearchResults
      :loading="loading"
      :loading-more="loadingMore"
      :queries="queries"
      :results="allResults"
      :has-more="hasMore"
      @load-more="loadMore"
    >
      <template #toolbar>
        <button
          :disabled="reranking"
          :title="reranked ? '恢复旧版排序' : '根据语义列举最接近的结果'"
          class="relative flex h-8 shrink-0 items-center justify-center rounded-lg px-3 text-sm text-rosybrown-600 transition-all hover:bg-wheat-100 disabled:cursor-wait disabled:bg-wheat-50"
          @click="reranked ? restoreOrder() : runRerank()"
        >
          <template v-if="reranking">
            <i-svg-spinners-180-ring-with-bg
              class="text-rosybrown-600"
              style="font-size: 16px"
            />
          </template>

          <template v-else>
            <i-material-symbols-sort-rounded style="font-size: 16px" />
          </template>

          <span class="ml-1">
            {{ reranked ? '恢复旧版排序' : '试用新版排序' }}
          </span>
        </button>
      </template>
    </SearchResults>
  </PageContent>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import SearchResults from '@/search/components/SearchResults.vue';
import type { SearchResult, SearchResponse } from '@/search/types';
import { useSearchNavigation } from '@/search/useSearchNavigation';
import { apiV2Url } from '@/utils/api';

const route = useRoute();
const { search } = useSearchNavigation();

const loading = ref(false);
const loadingMore = ref(false);

const query = ref((route.query.q as string) || '');
const queries = ref<string[]>([]);
const allResults = ref<SearchResult[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

const handleSearchSubmit = (query: string) => {
  search(query);
};

const SMART_SEEN_KEY = 'seedict.smartSeen';

const smartSeen = ref(
  typeof localStorage !== 'undefined' &&
    localStorage.getItem(SMART_SEEN_KEY) === '1'
);

const reranking = ref(false);
const reranked = ref(false);

let es: EventSource | null = null;

let preRerankOrder: SearchResult[] = [];
let postRerankOrder: SearchResult[] = [];

const clearRerankCache = () => {
  preRerankOrder = [];
  postRerankOrder = [];
};

const resetRerank = () => {
  if (es) {
    es.close();
    es = null;
  }

  reranking.value = false;
  reranked.value = false;
};

const markSmartSeen = () => {
  if (smartSeen.value) return;

  smartSeen.value = true;

  try {
    localStorage.setItem(SMART_SEEN_KEY, '1');
  } catch {
    // private mode / SSR — ignore
  }
};

const runRerank = () => {
  if (reranking.value || allResults.value.length === 0) return;

  markSmartSeen();

  if (postRerankOrder.length > 0) {
    allResults.value = [...postRerankOrder];
    reranked.value = true;
    return;
  }

  preRerankOrder = [...allResults.value];

  reranking.value = true;
  reranked.value = false;

  const wids = allResults.value.map((result) => result.w).join(',');

  es = new EventSource(
    apiV2Url('/rerank/', {
      q: query.value,
      w: wids,
    })
  );

  es.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'result') {
      const byId = new Map(
        preRerankOrder.map((result) => [String(result.w), result])
      );

      const ordered = (message.w as string[])
        .map((w) => byId.get(String(w)))
        .filter((result): result is SearchResult => result !== undefined);

      postRerankOrder = ordered;
      allResults.value = ordered;

      reranked.value = true;
      reranking.value = false;

      es?.close();
      es = null;
    } else if (message.type === 'error') {
      reranking.value = false;

      es?.close();
      es = null;
    }
  };

  es.onerror = () => {
    reranking.value = false;

    es?.close();
    es = null;
  };
};

const restoreOrder = () => {
  if (preRerankOrder.length === 0) return;

  allResults.value = [...preRerankOrder];
  reranked.value = false;
};

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

  resetRerank();

  try {
    const response = await fetch(
      apiV2Url('/search/semantic/', {
        q: query.value,
      })
    );

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
      apiV2Url('/search/semantic/', {
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

    clearRerankCache();
    reranked.value = false;
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
    clearRerankCache();
    performSearch();
  },
  { immediate: true }
);
</script>
