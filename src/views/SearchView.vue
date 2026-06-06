<template>
  <PageContent>
    <SearchSkeleton v-if="loading"></SearchSkeleton>
    <template v-else>
      <div
        class="mb-2.5 w-fit rounded-lg bg-wheat-300 px-2 py-1 text-xl text-white"
      >
        查询：{{ searchedResponse.data.queries }}
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
