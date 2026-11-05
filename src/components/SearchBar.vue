<template>
  <div>
    <div
      class="fixed left-0 top-0 z-20 h-screen w-screen"
      :class="toggleDimmer"
    ></div>
    <form
      class="relative z-40 flex h-12 flex-row items-center bg-white px-3 outline outline-2 outline-rosybrown-300 hover:outline-[3px] hover:outline-rosybrown-400"
      :class="toggleInputFocusStyle"
      @submit.prevent="handleSubmit"
      @click="onFormClick"
      v-on-click-outside="handleClickOutside"
    >
      <div class="relative mx-2 h-full flex-1">
        <RotatingPlaceholder
          :active="!searchQuery && !isComposing"
          :items="currentPlaceholders"
          :interval-ms="5000"
          :paused="isInputFocused"
          @change="currentPlaceholderText = $event"
        />
        <input
          class="h-full w-full bg-transparent text-rosybrown-800"
          v-model.trim="searchQuery"
          @input="filterHistory"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @keydown.down.prevent="handleKeyDown('down')"
          @keydown.up.prevent="handleKeyDown('up')"
          @keydown.enter.prevent="handleKeyEnter"
        />
      </div>
      <SearchModePicker v-model:open="isModeMenuOpen" />
      <button
        type="submit"
        class="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-wheat-100 text-rosybrown-800"
      >
        <i-material-symbols-search-rounded width="20" height="20" />
      </button>
      <ul
        ref="historyList"
        v-show="isHistoryVisible && filteredHistory.length > 0"
        class="absolute left-0 right-0 top-full rounded-b-md bg-white pt-2 outline outline-1 outline-rosybrown-300"
      >
        <li
          v-for="(history, index) in filteredHistory"
          :key="index"
          class="box-border flex flex-row items-center justify-between border-l-4 px-4 py-1 transition-colors duration-150 hover:text-rosybrown-700"
          :class="[
            index === selectedIndex
              ? 'border-l-rosybrown-700 bg-rosybrown-50 text-rosybrown-700'
              : 'border-l-transparent',
          ]"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="handleMouseLeave"
        >
          <div
            class="flex w-5/6 cursor-pointer flex-row items-center font-sans"
            @click.stop="selectHistory(index)"
          >
            <i-material-symbols-history-rounded
              class="pr-4 text-rosybrown-400"
              style="width: 40px"
            />
            <div class="overflow-hidden text-ellipsis text-rosybrown-600">
              {{ history }}
            </div>
          </div>
          <div
            class="cursor-pointer text-sm text-rosybrown-300 hover:text-rosybrown-500 hover:underline"
            @click.stop="deleteHistory(index)"
          >
            删除
          </div>
        </li>
        <li
          v-show="isHistoryVisible && filteredHistory.length > 0"
          class="flex flex-row-reverse items-baseline px-4 py-1"
        >
          <div
            class="cursor-pointer text-xs text-rosybrown-300 hover:text-rosybrown-500"
            @click.stop="clearHistory"
          >
            清空历史
          </div>
        </li>
      </ul>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

import { vOnClickOutside } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';

import { searchModes } from '@/search/mode';
import { useSearchHistory } from '@/search/useSearchHistory';
import { useSearchMode } from '@/search/useSearchMode';
import { useSearchNavigation } from '@/search/useSearchNavigation';

import RotatingPlaceholder from './RotatingPlaceholder.vue';
import SearchModePicker from './SearchModePicker.vue';

interface Props {
  autoNavigate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autoNavigate: true,
});

const emit = defineEmits<{
  submit: [query: string];
}>();

const mode = useSearchMode();
const { search } = useSearchNavigation();

const {
  suggestions: filteredHistory,
  find: findHistory,
  add: addHistory,
  remove: removeHistory,
  clear: clearSearchHistory,
} = useSearchHistory();

const searchQuery = ref('');
const currentPlaceholderText = ref('');

const isInputFocused = ref(false);
const isComposing = ref(false);
const isModeMenuOpen = ref(false);

const isHistoryVisible = ref(false);
const selectedIndex = ref(-1);
const queryBeforePreview = ref<string | null>(null);

const historyList = useTemplateRef<HTMLUListElement>('historyList');

const currentPlaceholders = computed(
  () => searchModes[mode.value].placeholders
);

const toggleInputFocusStyle = computed(() => {
  return isHistoryVisible.value && filteredHistory.value.length > 0
    ? ['rounded-b-none', 'rounded-t-[24px]']
    : ['rounded-[3rem]'];
});

const toggleDimmer = computed(() => {
  return isHistoryVisible.value || isModeMenuOpen.value
    ? ['backdrop-blur-xs', 'backdrop-brightness-90']
    : ['hidden'];
});

const clearPreview = (restoreQuery = false) => {
  if (restoreQuery && queryBeforePreview.value !== null) {
    searchQuery.value = queryBeforePreview.value;
  }

  queryBeforePreview.value = null;
};

const resetHistorySelection = () => {
  selectedIndex.value = -1;
  clearPreview();
};

const openHistory = () => {
  isHistoryVisible.value = true;
};

const closeHistory = () => {
  isHistoryVisible.value = false;
  resetHistorySelection();
};

const closeInteractiveUi = () => {
  closeHistory();
  isInputFocused.value = false;
  isModeMenuOpen.value = false;
};

const scrollToSelectedItem = () => {
  const element = historyList.value?.children[selectedIndex.value] as
    | HTMLElement
    | undefined;

  element?.scrollIntoView({
    block: 'nearest',
  });
};

const filterHistory = useDebounceFn(() => {
  openHistory();
  resetHistorySelection();
  findHistory(searchQuery.value);
}, 100);

const selectHistory = (index: number) => {
  const query = filteredHistory.value[index];
  if (!query) return;

  searchQuery.value = query;
  handleSubmit();
};

const deleteHistory = (index: number) => {
  const word = filteredHistory.value[index];
  if (!word) return;

  removeHistory(word);

  if (index === selectedIndex.value) {
    resetHistorySelection();
  } else if (index < selectedIndex.value) {
    selectedIndex.value -= 1;
  }
};

const clearHistory = () => {
  clearSearchHistory();
  resetHistorySelection();
};

const handleSubmit = () => {
  const query = searchQuery.value || currentPlaceholderText.value;
  if (!query) return;

  if (!searchQuery.value) {
    searchQuery.value = query;
  }

  closeInteractiveUi();
  searchQuery.value = '';

  emit('submit', query);

  if (props.autoNavigate) {
    search(query);
  }

  queueMicrotask(() => {
    addHistory(query);
  });
};

const handleClickOutside = () => {
  closeHistory();
  isModeMenuOpen.value = false;
};

const onFormClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName === 'INPUT') {
    isHistoryVisible.value = true;
    isInputFocused.value = true;
  }
};

const handleInputFocus = () => {
  isInputFocused.value = true;
  filterHistory();
};

const handleInputBlur = () => {
  isInputFocused.value = false;
};

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
  filterHistory();
};

const handleKeyDown = (direction: 'up' | 'down') => {
  if (!isHistoryVisible.value || filteredHistory.value.length === 0) {
    return;
  }

  clearPreview();

  const lastIndex = filteredHistory.value.length - 1;

  if (direction === 'down') {
    selectedIndex.value =
      selectedIndex.value >= lastIndex ? 0 : selectedIndex.value + 1;
  } else {
    selectedIndex.value =
      selectedIndex.value <= 0 ? lastIndex : selectedIndex.value - 1;
  }

  searchQuery.value = filteredHistory.value[selectedIndex.value];
  scrollToSelectedItem();
};

const handleKeyEnter = () => {
  if (selectedIndex.value !== -1 && filteredHistory.value.length > 0) {
    selectHistory(selectedIndex.value);
    return;
  }

  handleSubmit();
};

const handleMouseEnter = (index: number) => {
  const query = filteredHistory.value[index];
  if (!query) return;

  if (queryBeforePreview.value === null) {
    queryBeforePreview.value = searchQuery.value;
  }

  selectedIndex.value = index;
  searchQuery.value = query;
};

const handleMouseLeave = () => {
  clearPreview(true);
};

onMounted(() => {
  window.addEventListener('scroll', closeHistory);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', closeHistory);
});
</script>

<style scoped>
input {
  border: none;
  outline: none;
}
</style>
