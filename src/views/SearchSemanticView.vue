<template>
  <DefaultLayout>
    <SearchResults
      :loading="loading"
      :loading-more="loadingMore"
      :queries="queries"
      :results="visibleResults"
      :has-more="hasMore"
      @load-more="handleLoadMore"
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
  </DefaultLayout>
</template>

<script setup lang="ts">
import SearchResults from '@/modules/search/components/SearchResults.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

import { computed, onScopeDispose, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { SearchResult, SearchResponse } from '@/modules/search/types';
import {
  type SearchPageLoader,
  useSearchResults,
} from '@/modules/search/useSearchResults';
import { apiV2Url } from '@/utils/api';

const route = useRoute();

const loadPage: SearchPageLoader = async ({ query, cursor, signal }) => {
  const response = await fetch(
    apiV2Url('/search/semantic/', {
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

const {
  query,
  loading,
  loadingMore,
  queries,
  results,
  hasMore,
  search,
  loadMore,
} = useSearchResults(loadPage);

const reranking = ref(false);
const reranked = ref(false);
const rerankedResults = ref<SearchResult[] | null>(null);

const visibleResults = computed(() =>
  reranked.value && rerankedResults.value
    ? rerankedResults.value
    : results.value
);

let es: EventSource | null = null;

const closeRerankStream = () => {
  es?.close();
  es = null;
};

const invalidateRerank = () => {
  closeRerankStream();

  reranking.value = false;
  reranked.value = false;
  rerankedResults.value = null;
};

const runRerank = () => {
  if (reranking.value || results.value.length === 0) {
    return;
  }

  if (rerankedResults.value) {
    reranked.value = true;
    return;
  }

  reranking.value = true;
  reranked.value = false;

  const wids = results.value.map((result) => result.w).join(',');

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
        results.value.map((result) => [String(result.w), result])
      );

      const ordered = (message.w as string[])
        .map((w) => byId.get(String(w)))
        .filter((result): result is SearchResult => result !== undefined);

      rerankedResults.value = ordered;
      reranked.value = true;
      reranking.value = false;

      closeRerankStream();
    } else if (message.type === 'error') {
      reranking.value = false;
      closeRerankStream();
    }
  };

  es.onerror = () => {
    reranking.value = false;
    closeRerankStream();
  };
};

const restoreOrder = () => {
  reranked.value = false;
};

const handleLoadMore = async () => {
  const appended = await loadMore();

  if (appended) {
    invalidateRerank();
  }
};

const updateTitle = () => {
  document.title = route.query.q
    ? `${route.query.q} - 检索`
    : '米时典 SeeDict - 检索';
};

watch(
  () => route.query.q,
  (newQ) => {
    if (typeof newQ !== 'string') {
      return;
    }

    updateTitle();
    invalidateRerank();

    void search(newQ);
  },
  { immediate: true }
);

onScopeDispose(() => {
  closeRerankStream();
});
</script>
