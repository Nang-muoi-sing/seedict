<template>
  <PageContent>
    <SearchSkeleton v-if="loading"></SearchSkeleton>
    <template v-else>
      <div
        class="mb-2.5 w-fit rounded-lg bg-wheat-300 px-2 py-1 text-xl text-white"
      >
        查询：{{ searchedResponse.data.queries }}
      </div>

      <!-- on-demand smart re-rank (cross-encoder under the hood) -->
      <div
        v-if="allResults.length > 0"
        class="mb-4 flex min-h-[2.25rem] items-center gap-3"
      >
        <button
          v-if="!reranking"
          @click="reranked ? restoreOrder() : startRerank()"
          :title="
            reranked
              ? '切回默认顺序'
              : 'AI 模型逐条比对查询和词条，给出更精准的排序（约 5–10 秒）'
          "
          class="relative flex shrink-0 items-center gap-1 rounded-lg bg-wheat-300 px-3 py-1.5 text-sm text-white transition-all hover:bg-wheat-400"
        >
          <!-- New-feature indicator: pulsing red dot + 「新」 badge, dismissed forever after first click -->
          <span
            v-if="!rerankSeen && !reranked"
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
          <i-material-symbols-sort-rounded style="font-size: 16px" />
          {{ reranked ? '恢复默认顺序' : '智能排序' }}
        </button>

        <div v-if="reranking" class="flex-1">
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

        <span v-else-if="reranked" class="text-xs text-wheat-500">
          已按相关度重新排序
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

// on-demand smart re-rank (cross-encoder under the hood)
const reranking = ref(false);
const reranked = ref(false);
const rerankDone = ref(0);
const rerankTotal = ref(0);
const rerankPercent = computed(() =>
  rerankTotal.value ? Math.round((rerankDone.value / rerankTotal.value) * 100) : 0
);
let preRerankOrder: any[] = [];
let rerankedOrder: any[] = []; // cache of last rerank result for the current query
let es: EventSource | null = null;

// "New feature" badge: dismissed forever once the user clicks the button once
const RERANK_SEEN_KEY = 'seedict.smartRankSeen';
const rerankSeen = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem(RERANK_SEEN_KEY) === '1'
);

const resetRerank = () => {
  if (es) {
    es.close();
    es = null;
  }
  reranking.value = false;
  reranked.value = false;
  rerankDone.value = 0;
  rerankTotal.value = 0;
  preRerankOrder = [];
  rerankedOrder = []; // new search invalidates the cache
};

const markRerankSeen = () => {
  if (rerankSeen.value) return;
  rerankSeen.value = true;
  try {
    localStorage.setItem(RERANK_SEEN_KEY, '1');
  } catch {
    /* private mode / SSR — ignore */
  }
};

const startRerank = () => {
  if (reranking.value || allResults.value.length === 0) return;
  markRerankSeen();

  // Cache hit: re-apply the previously computed order instantly (no fetch, no
  // cross-encoder work). Cache is cleared on every new search via resetRerank.
  if (rerankedOrder.length > 0) {
    allResults.value = [...rerankedOrder];
    reranked.value = true;
    return;
  }

  preRerankOrder = [...allResults.value];
  reranking.value = true;
  reranked.value = false;
  rerankDone.value = 0;
  rerankTotal.value = allResults.value.length;

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
      const byId = new Map(preRerankOrder.map((r) => [String(r.w), r]));
      const ordered = (msg.w as string[])
        .map((w) => byId.get(String(w)))
        .filter(Boolean);
      rerankedOrder = ordered; // cache for "switch back & forth" without recompute
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
    const params = new URLSearchParams();
    params.append('q', state.value.q);

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
};

const loadMore = async () => {
  if (!nextCursor.value || loadingMore.value) return;

  loadingMore.value = true;

  try {
    const params = new URLSearchParams();
    params.append('q', state.value.q);
    params.append('cursor', nextCursor.value!);

    const response = await fetch(`${apiUrl}/search/?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const data = (await response.json()) as SearchResponse;

    // 追加新结果到现有列表
    allResults.value = [...allResults.value, ...(data.data.results || [])];
    nextCursor.value = data.data.nextCursor || null;
    hasMore.value = data.data.hasMore || false;
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
      performSearch();
    }
  },
  { immediate: true }
);
</script>
