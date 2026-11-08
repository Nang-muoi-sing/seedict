<template>
  <SearchSkeleton v-if="loading" />

  <template v-else>
    <div
      class="mb-2.5 w-fit rounded-lg bg-wheat-300 px-2 py-1 text-xl text-white"
    >
      查询：{{ queries.join('、') }}
    </div>

    <div
      v-if="$slots.toolbar && results.length > 0"
      class="mb-4 flex min-h-[2.25rem] items-center justify-end"
    >
      <slot name="toolbar" />
    </div>

    <RouterLink
      v-for="result in results"
      :key="result.w"
      class="block"
      :to="{ name: 'word', query: { w: result.w } }"
    >
      <div class="my-5 bg-wheat-100 px-5 py-4">
        <div class="flex flex-wrap justify-end gap-2 text-sm text-wheat-500">
          <span
            v-if="result.refs.length === 0 && !result.brief"
            class="flex items-center"
          >
            <i-material-symbols-contact-support-rounded
              style="font-size: 16px"
            />
            暂未释义
          </span>

          <span
            v-for="(book, index) in result.refs"
            v-else
            :key="index"
            class="flex items-center"
          >
            <i-material-symbols-book-2-rounded style="font-size: 16px" />
            {{ sourceLabels[book] ?? '' }}
          </span>
        </div>

        <div
          class="xxl:text-4xl whitespace-normal break-all text-3xl font-bold text-rosybrown-800"
        >
          <RubyText :text="result.text" :yngping="result.pron" />
        </div>

        <p class="mt-2 text-wheat-600">
          <FormatText :text="result.brief" />
        </p>
      </div>
    </RouterLink>

    <div class="mt-6 text-center text-sm text-wheat-400">
      没有找到想找的词汇？尝试
      <a
        href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnfDrtD7nlpJdryFlYFUU3Lf"
        target="_blank"
        class="underline underline-offset-4 transition-all hover:text-wheat-600"
      >
        向我们反馈
      </a>
      或
      <a
        href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnAQ3W3DjmPV7ycTJ1ekiFBf"
        target="_blank"
        class="underline underline-offset-4 transition-all hover:text-wheat-600"
      >
        向我们提交数据
      </a>
    </div>

    <div v-if="hasMore" class="mt-6 text-center">
      <button
        :disabled="loadingMore"
        class="rounded-lg bg-wheat-300 px-6 py-3 text-white hover:bg-wheat-400 disabled:bg-wheat-200"
        @click="emit('loadMore')"
      >
        <div :class="{ 'animate-bounce': loadingMore }">加载更多</div>
      </button>
    </div>

    <div
      v-if="!hasMore && results.length > 0"
      class="mt-6 text-center text-wheat-500"
    >
      已显示所有 {{ results.length }} 条相关结果
    </div>
  </template>
</template>

<script setup lang="ts">
import FormatText from '@/components/common/FormatText.vue';
import RubyText from '@/components/common/RubyText.vue';
import SearchSkeleton from './SearchSkeleton.vue';

import type { SearchResult } from '@/search/types';

defineProps<{
  loading: boolean;
  loadingMore: boolean;
  queries: readonly string[];
  results: SearchResult[];
  hasMore: boolean;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const sourceLabels: Record<string, string> = {
  feng: '福州方言词典',
  cikling: '戚林八音校注',
};
</script>
