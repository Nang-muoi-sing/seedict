<template>
  <PageContent :on-search-submit="handleSearchSubmit">
    <SearchSkeleton v-if="loading"></SearchSkeleton>
    <template v-else>
      <div
        class="mb-2.5 w-fit rounded-lg bg-wheat-300 px-2 py-1 text-xl text-white"
      >
        查询：{{ searchedResponse.data.queries }}
      </div>

      <div
        v-if="allResults.length > 0"
        class="mb-4 flex min-h-[2.25rem] items-center justify-end"
      >
        <button
          @click="reranked ? restoreOrder() : runRerank()"
          :disabled="reranking"
          :title="reranked ? '恢复旧版排序' : '根据语义列举最接近的结果'"
          class="relative flex h-8 shrink-0 items-center justify-center rounded-lg px-3 text-sm text-rosybrown-600 transition-all hover:bg-wheat-100 disabled:cursor-wait disabled:bg-wheat-50"
        >
          <template v-if="reranking">
            <i-svg-spinners-180-ring-with-bg
              style="font-size: 16px"
              class="text-rosybrown-600"
            />
          </template>
          <template v-else>
            <i-material-symbols-sort-rounded style="font-size: 16px" />
          </template>
          <span class="ml-1">{{
            reranked ? '恢复旧版排序' : '试用新版排序'
          }}</span>
        </button>
      </div>

      <RouterLink
        class="block"
        v-for="result in searchedResponse.data.results"
        :to="{ name: 'word', query: { w: result.w } }"
        :key="result.w"
      >
        <div class="my-5 bg-wheat-100 px-5 py-4">
          <div class="flex flex-wrap justify-end gap-2 text-sm text-wheat-500">
            <span
              class="flex items-center"
              v-if="result.refs?.length == 0 && !result.brief"
              ><i-material-symbols-contact-support-rounded
                style="font-size: 16px"
              />
              暂未释义</span
            >

            <span
              class="flex items-center"
              v-else
              v-for="(book, index) in result.refs"
              :key="index"
              ><i-material-symbols-book-2-rounded style="font-size: 16px" />
              {{ sourceMap[book] ?? '' }}</span
            >
          </div>
          <RubyText
            class="xxl:text-4xl whitespace-normal text-3xl font-bold text-rosybrown-800"
            :text="result.text"
            :yngping="result.pron"
          ></RubyText>
          <p class="mt-2 text-wheat-600">
            <FormatText :text="result.brief" />
          </p></div
      ></RouterLink>

      <div class="mt-6 text-center text-sm text-wheat-400">
        没有找到想找的词汇？尝试<a
          href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnfDrtD7nlpJdryFlYFUU3Lf"
          target="_blank"
          class="underline underline-offset-4 transition-all hover:text-wheat-600"
          >向我们反馈</a
        >或<a
          href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnAQ3W3DjmPV7ycTJ1ekiFBf"
          target="_blank"
          class="underline underline-offset-4 transition-all hover:text-wheat-600"
          >向我们提交数据</a
        >
      </div>

      <div v-if="hasMore" class="mt-6 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="rounded-lg bg-wheat-300 px-6 py-3 text-white hover:bg-wheat-400 disabled:bg-wheat-200"
        >
          <div :class="{ 'animate-bounce': loadingMore }">加载更多</div>
        </button>
      </div>

      <div
        v-if="!hasMore && allResults.length > 0"
        class="mt-6 text-center text-wheat-500"
      >
        已显示所有 {{ allResults.length }} 条相关结果
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RubyText from '../components/common/RubyText.vue';
import PageContent from '../components/PageContent.vue';
import SearchSkeleton from '../components/SearchSkeleton.vue';
import { apiV2Url } from '../utils/api';
import { sourceMap } from '../utils/mapping';
import type { SearchResponse } from '../utils/typing';
import FormatText from '../components/common/FormatText.vue';
import { buildSearchRoute, useSearchModeStore } from '../store/searchModeStore';

const route = useRoute();
const router = useRouter();
const searchModeStore = useSearchModeStore();

const loading = ref(false);
const loadingMore = ref(false);

const queries = ref<string[]>([]);
const allResults = ref<any[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

const handleSearchSubmit = (query: string) => {
  router.push(buildSearchRoute(searchModeStore.mode, query));
};

// 排蜀下 (cross-encoder rerank) — on-demand button. Hybrid recall (BM25 +
// vector RRF) is always on at the api side, so /search already returns the
// semantic candidate set. The button reranks that set with the cross-encoder.
//
// Each query is reranked AT MOST ONCE: the pre-rerank ordering AND the
// post-rerank ordering are both cached as per-query snapshots, so repeatedly
// flipping between "排蜀下" and "恢复默认顺序" for the same query is free.
const SMART_SEEN_KEY = 'seedict.smartSeen';
const smartSeen = ref(
  typeof localStorage !== 'undefined' &&
    localStorage.getItem(SMART_SEEN_KEY) === '1'
);

const reranking = ref(false);
const reranked = ref(false);
const rerankDone = ref(0);
const rerankTotal = ref(0);
let es: EventSource | null = null;

// Per-query rerank cache (cleared on every new query via clearRerankCache).
let preRerankOrder: any[] = []; // results as fetched, pre-rerank
let postRerankOrder: any[] = []; // results after cross-encoder reorder

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
  rerankDone.value = 0;
  rerankTotal.value = 0;
};

const markSmartSeen = () => {
  if (smartSeen.value) return;
  smartSeen.value = true;
  try {
    localStorage.setItem(SMART_SEEN_KEY, '1');
  } catch {
    /* private mode / SSR — ignore */
  }
};

const runRerank = () => {
  if (reranking.value || allResults.value.length === 0) return;
  markSmartSeen();

  // Cache hit: re-apply the cached post-rerank order instantly. No /search
  // call, no SSE, no GPU work. Cache is cleared on every new query.
  if (postRerankOrder.length > 0) {
    allResults.value = [...postRerankOrder];
    reranked.value = true;
    return;
  }

  preRerankOrder = [...allResults.value];
  reranking.value = true;
  reranked.value = false;
  rerankDone.value = 0;
  rerankTotal.value = allResults.value.length;

  const wids = allResults.value.map((r) => r.w).join(',');
  const url = apiV2Url('/rerank/', { q: state.value.q, w: wids });
  es = new EventSource(url);
  es.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === 'start') {
      rerankTotal.value = msg.total;
      rerankDone.value = 0;
    } else if (msg.type === 'progress') {
      rerankDone.value = msg.done;
      rerankTotal.value = msg.total;
    } else if (msg.type === 'result') {
      const byId = new Map(preRerankOrder.map((r) => [String(r.w), r]));
      const ordered = (msg.w as string[])
        .map((w) => byId.get(String(w)))
        .filter(Boolean);
      postRerankOrder = ordered;
      allResults.value = ordered;
      reranked.value = true;
      reranking.value = false;
      es?.close();
      es = null;
    } else if (msg.type === 'error') {
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
  if (preRerankOrder.length) {
    allResults.value = [...preRerankOrder];
    reranked.value = false;
  }
};

const state = ref({
  q: (route.query.q as string) || '',
});

const searchedResponse = computed(() => ({
  status: 0,
  data: {
    queries: queries.value.join('、'),
    results: allResults.value,
    nextCursor: nextCursor.value,
    hasMore: hasMore.value,
  },
}));

const updateTitle = () => {
  document.title = route.query.q
    ? `${route.query.q} - 检索`
    : `米时典 SeeDict - 检索`;
};

const performSearch = async () => {
  loading.value = true;
  allResults.value = [];
  nextCursor.value = null;
  hasMore.value = false;
  resetRerank();

  try {
    const url = apiV2Url('/search/semantic/', { q: state.value.q });
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    queries.value = data.data.queries || [];
    allResults.value = data.data.results || [];
    nextCursor.value = data.data.nextCursor || null;
    hasMore.value = data.data.hasMore || false;
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
        q: state.value.q,
        cursor: nextCursor.value,
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    // Append new results to the visible list. Note: pagination after the
    // user has clicked 排蜀下 invalidates the rerank cache for this query
    // — the cached order doesn't include the newly fetched entries.
    allResults.value = [...allResults.value, ...(data.data.results || [])];
    nextCursor.value = data.data.nextCursor || null;
    hasMore.value = data.data.hasMore || false;
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
    searchModeStore.setMode('semantic');
    if (typeof newQ === 'string') {
      state.value.q = newQ;
      updateTitle();
      // New query — last rerank result is stale.
      clearRerankCache();
      performSearch();
    }
  },
  { immediate: true }
);
</script>
