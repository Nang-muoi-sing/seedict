<template>
  <PageContent>
    <SearchSkeleton v-if="loading"></SearchSkeleton>
    <template v-else>
      <div
        class="mb-2.5 w-fit rounded-lg bg-wheat-300 px-2 py-1 text-xl text-white"
      >
        查询：{{ searchedResponse.data.queries }}
      </div>

      <!-- Sticky "智能排序" toggle: when ON, /search uses BM25 + 向量召回
           and results are auto re-ranked by cross-encoder. When OFF, falls back
           to the precision-only Postgres pipeline. The reranked result is
           cached per-query so toggling ON/OFF after the first compute is free. -->
      <div class="mb-4 flex min-h-[2.25rem] flex-wrap items-center gap-3">
        <label
          class="relative inline-flex shrink-0 cursor-pointer select-none items-center gap-2 rounded-lg bg-wheat-100 px-3 py-1.5 text-sm text-wheat-600 transition-all hover:bg-wheat-200"
          :title="
            smartMode
              ? '已开启：向量召回 + AI 精排（每个查询仅计算一次，再切换瞬间生效）'
              : '开启后使用向量召回 + AI 精排，结果更贴合自然语言查询'
          "
        >
          <!-- New-feature indicator: pulsing red dot + 「新」 badge, dismissed forever after first interaction -->
          <span
            v-if="!smartSeen"
            class="absolute -right-2 -top-2 flex items-center gap-0.5"
            aria-hidden="true"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex h-2 w-2 rounded-full bg-red-500"
              ></span>
            </span>
            <span
              class="rounded-sm bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
              >新</span
            >
          </span>
          <input
            type="checkbox"
            class="h-4 w-4 cursor-pointer accent-wheat-400"
            :checked="smartMode"
            @change="onSmartToggle"
          />
          <i-material-symbols-sort-rounded style="font-size: 16px" />
          智能排序
        </label>

        <div v-if="reranking" class="flex-1 min-w-[160px]">
          <div class="mb-1 text-xs text-wheat-500">
            智能排序中… {{ rerankDone }}/{{ rerankTotal }}（{{
              rerankPercent
            }}%）
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-wheat-100">
            <div
              class="h-full bg-wheat-400 transition-all duration-200"
              :style="{ width: rerankPercent + '%' }"
            ></div>
          </div>
        </div>

        <span
          v-else-if="smartMode && reranked && allResults.length > 0"
          class="text-xs text-wheat-500"
        >
          已按智能排序
        </span>
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
          <div
            class="xxl:text-4xl whitespace-normal break-all text-3xl font-bold text-rosybrown-800"
          >
            <RubyText :text="result.text" :yngping="result.pron"></RubyText>
          </div>
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
import { useRoute } from 'vue-router';
import RubyText from '../components/common/RubyText.vue';
import PageContent from '../components/PageContent.vue';
import SearchSkeleton from '../components/SearchSkeleton.vue';
import { sourceMap } from '../utils/mapping';
import type { SearchResponse } from '../utils/typing';
import FormatText from '../components/common/FormatText.vue';
const apiUrl = import.meta.env.VITE_API_URL || '/';

const route = useRoute();

const loading = ref(false);
const loadingMore = ref(false);

const queries = ref<string[]>([]);
const allResults = ref<any[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

// 智能排序 (vector recall + cross-encoder rerank) — sticky opt-in setting.
// When ON: /search?smart=1 returns BM25 + vector candidates, then we auto-fire
// /rerank_stream/ to reorder by cross-encoder. When OFF: precision-only /search
// (the old upstream behaviour). Each query is computed at most ONCE per mode:
// snapshots are cached and applied instantly on subsequent toggles, so
// switching ON ↔ OFF for the same query is free.
const SMART_KEY = 'seedict.smartMode';
const SMART_SEEN_KEY = 'seedict.smartSeen';
const smartMode = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem(SMART_KEY) === '1'
);
const smartSeen = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem(SMART_SEEN_KEY) === '1'
);

const reranking = ref(false);
const reranked = ref(false);
const rerankDone = ref(0);
const rerankTotal = ref(0);
const rerankPercent = computed(() =>
  rerankTotal.value ? Math.round((rerankDone.value / rerankTotal.value) * 100) : 0
);
let es: EventSource | null = null;

// Per-query result snapshots for each mode. Cleared when the query changes;
// populated when the active mode finishes its fetch (+ rerank for smart). A
// hit on toggle means no /search and no rerank — restore is O(1).
type ResultSnap = {
  queries: string[];
  results: any[];
  nextCursor: string | null;
  hasMore: boolean;
  reranked: boolean;
};
let precisionSnap: ResultSnap | null = null;
let smartSnap: ResultSnap | null = null;

const takeSnap = (): ResultSnap => ({
  queries: [...queries.value],
  results: [...allResults.value],
  nextCursor: nextCursor.value,
  hasMore: hasMore.value,
  reranked: reranked.value,
});

const applySnap = (s: ResultSnap) => {
  queries.value = [...s.queries];
  allResults.value = [...s.results];
  nextCursor.value = s.nextCursor;
  hasMore.value = s.hasMore;
  reranked.value = s.reranked;
};

const clearSnaps = () => {
  precisionSnap = null;
  smartSnap = null;
};

const saveActiveSnap = () => {
  if (smartMode.value) {
    if (!reranking.value) smartSnap = takeSnap();
  } else {
    precisionSnap = takeSnap();
  }
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

const startRerank = () => {
  if (reranking.value || allResults.value.length === 0) return;

  reranking.value = true;
  reranked.value = false;
  rerankDone.value = 0;
  rerankTotal.value = allResults.value.length;

  const preOrder = [...allResults.value];
  const wids = allResults.value.map((r) => r.w).join(',');
  const url = `${apiUrl}/rerank_stream/?q=${encodeURIComponent(
    state.value.q
  )}&w=${encodeURIComponent(wids)}`;
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
      const byId = new Map(preOrder.map((r) => [String(r.w), r]));
      const ordered = (msg.w as string[])
        .map((w) => byId.get(String(w)))
        .filter(Boolean);
      if (ordered.length) {
        allResults.value = ordered;
      }
      reranked.value = true;
      reranking.value = false;
      es?.close();
      es = null;
      // Cache the post-rerank state so a future toggle ON for this query
      // is instant (no /search, no SSE).
      smartSnap = takeSnap();
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

const onSmartToggle = (ev: Event) => {
  smartMode.value = (ev.target as HTMLInputElement).checked;
  try {
    localStorage.setItem(SMART_KEY, smartMode.value ? '1' : '0');
    if (!smartSeen.value) {
      smartSeen.value = true;
      localStorage.setItem(SMART_SEEN_KEY, '1');
    }
  } catch {
    /* private mode / SSR — ignore */
  }

  // Cache hit for the new mode → restore instantly, no fetch / rerank.
  const snap = smartMode.value ? smartSnap : precisionSnap;
  if (snap) {
    resetRerank();
    applySnap(snap);
    return;
  }

  // Cache miss → fetch under the new mode (will populate the snapshot on done).
  if (state.value.q) {
    performSearch();
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
    const params = new URLSearchParams();
    params.append('q', state.value.q);
    if (smartMode.value) params.append('smart', '1');

    const url = `${import.meta.env.VITE_API_URL || '/'}/search/?${params}`;
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

  if (smartMode.value && allResults.value.length > 0) {
    // Auto-fire cross-encoder rerank; smartSnap is saved in the SSE result
    // handler so the snapshot reflects the post-rerank ordering.
    startRerank();
  } else if (!smartMode.value) {
    precisionSnap = takeSnap();
  }
};

const loadMore = async () => {
  if (!nextCursor.value || loadingMore.value) return;

  loadingMore.value = true;

  try {
    const params = new URLSearchParams();
    params.append('q', state.value.q);
    params.append('cursor', nextCursor.value!);
    if (smartMode.value) params.append('smart', '1');

    const response = await fetch(`${apiUrl}/search/?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    // 追加新结果到现有列表
    allResults.value = [...allResults.value, ...(data.data.results || [])];
    nextCursor.value = data.data.nextCursor || null;
    hasMore.value = data.data.hasMore || false;
    // Keep the active-mode snapshot in sync with paginated state so toggling
    // away and back preserves the user's "loaded more" position.
    saveActiveSnap();
  } catch (error) {
    console.error('加载更多失败:', error);
  } finally {
    loadingMore.value = false;
  }
};

watch(
  () => route.query.q,
  (newQ) => {
    if (typeof newQ === 'string') {
      state.value.q = newQ;
      updateTitle();
      // New query — both per-mode caches are stale.
      clearSnaps();
      performSearch();
    }
  },
  { immediate: true }
);
</script>
