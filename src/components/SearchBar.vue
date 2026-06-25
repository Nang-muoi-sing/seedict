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
      v-on-click-outside="
        () => {
          isHistoryVisible = false;
          selectedIndex = -1;
          isModeMenuOpen = false;
        }
      "
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
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
        :class="submitButtonClass"
        :disabled="!searchQuery"
      >
        <i-material-symbols-search-rounded width="20" height="20" />
      </button>
      <ul
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
import { vOnClickOutside } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RotatingPlaceholder from './RotatingPlaceholder.vue';
import SearchModePicker from './SearchModePicker.vue';
import {
  buildSearchRoute,
  type SearchMode,
  useSearchModeStore,
} from '../store/searchModeStore';
import { Trie } from '../utils/trie';

interface Props {
  autoNavigate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autoNavigate: true,
});

const emit = defineEmits<{
  submit: [query: string];
}>();

const router = useRouter();
const searchModeStore = useSearchModeStore();
const searchQuery = ref('');
const currentPlaceholderText = ref('');
const filteredHistory = ref<string[]>([]);
const isHistoryVisible = ref(false);
const isModeMenuOpen = ref(false);
const isComposing = ref(false);
const isInputFocused = ref(false);
const selectedIndex = ref(-1);
const isMouseHovering = ref(false);

const placeholderCandidates: Record<SearchMode, string[]> = {
  fuzzy: [
    '天光',
    'huk ziu',
    '小时候',
    '蓝尾星',
    '讲大话',
    '伓',
    '有时间',
    '会使',
    '半晡',
    'sieh33 da53',
    '起动',
    'ny33',
    '失眠',
    '拜托',
    '快活',
    '我各侬',
    '中秋节',
    '对手',
    '挂号信',
    '厝边',
  ],
  semantic: [
    '红色的水果',
    '到处乱跑的人',
    '无法处理的复杂状况',
    '突然想起很久以前的事',
    '倒了大霉',
    '愉悦舒畅的的心情',
    '秋高气爽',
    '中秋节',
    '事情的尾声',
    '顺利办成',
    '明明知道去装不知道',
    '勤俭持家',
    '天快黑但还没黑',
    '临行前的嘱咐',
    '得心应手',
    '一时想不起来',
    '人多声音嘈杂',
    '东西找不到了',
    '夜长梦多',
    '这下麻烦了',
  ],
};

let queryCache = '';

const handleScroll = () => {
  isHistoryVisible.value = false;
  selectedIndex.value = -1;
  isMouseHovering.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const deserializeTrie = (json: string | null) => {
  try {
    return json ? Trie.deserialize(json) : new Trie();
  } catch (error) {
    console.error('反序列化前缀树时出错:', error);
    return new Trie();
  }
};

const trieHistory = deserializeTrie(localStorage.getItem('searchHistory'));

const handleSubmit = () => {
  const query = searchQuery.value || currentPlaceholderText.value;
  if (!query) return;

  if (!searchQuery.value) {
    searchQuery.value = query;
  }

  isHistoryVisible.value = false;
  isInputFocused.value = false;
  isModeMenuOpen.value = false;
  selectedIndex.value = -1;
  isMouseHovering.value = false;
  searchQuery.value = '';
  emit('submit', query);

  if (props.autoNavigate) {
    router.push(buildSearchRoute(searchModeStore.mode, query));
  }

  queueMicrotask(() => {
    try {
      trieHistory.insert(query);
      localStorage.setItem('searchHistory', trieHistory.serialize());
    } catch (error) {
      console.error('存储搜索历史失败:', error);
    }
  });
};

const filterHistory = useDebounceFn(() => {
  isHistoryVisible.value = true;
  const query = searchQuery.value;
  const matchedHistory = trieHistory.findWords(query);
  selectedIndex.value = -1;
  isMouseHovering.value = false;

  if (matchedHistory.length < 2) {
    filteredHistory.value = matchedHistory.map((item) => item.word);
    return;
  }

  matchedHistory.sort(
    (
      a: { word: string; timestamp: number },
      b: { word: string; timestamp: number }
    ) => b.timestamp - a.timestamp
  );
  filteredHistory.value = matchedHistory.map((item) => item.word).slice(0, 10);
}, 100);

const selectHistory = (index: number) => {
  searchQuery.value = filteredHistory.value[index];
  handleSubmit();
};

const deleteHistory = (index: number) => {
  trieHistory.delete(filteredHistory.value.splice(index, 1)[0]);
  localStorage.setItem('searchHistory', trieHistory.serialize());
  if (index === selectedIndex.value) {
    selectedIndex.value = -1;
    isMouseHovering.value = false;
  }
};

const clearHistory = () => {
  filteredHistory.value = [];
  trieHistory.clear();
  localStorage.removeItem('searchHistory');
  selectedIndex.value = -1;
  isMouseHovering.value = false;
};

const currentPlaceholders = computed(
  () => placeholderCandidates[searchModeStore.mode]
);

const submitButtonClass = computed(() =>
  searchQuery.value
    ? 'bg-wheat-100 text-rosybrown-800 cursor-pointer'
    : 'bg-wheat-50 text-wheat-200'
);

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
  if (isMouseHovering.value) {
    isMouseHovering.value = false;
  }

  if (!isHistoryVisible.value || filteredHistory.value.length === 0) {
    return;
  }

  if (direction === 'down') {
    selectedIndex.value =
      selectedIndex.value === filteredHistory.value.length - 1
        ? 0
        : selectedIndex.value + 1;
  } else {
    selectedIndex.value =
      selectedIndex.value <= 0
        ? filteredHistory.value.length - 1
        : selectedIndex.value - 1;
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
  isMouseHovering.value = true;
  selectedIndex.value = index;
  queryCache = searchQuery.value;
  searchQuery.value = filteredHistory.value[index];
};

const handleMouseLeave = () => {
  isMouseHovering.value = false;
  searchQuery.value = queryCache;
};

const scrollToSelectedItem = () => {
  const element = document.querySelector(
    `li:nth-child(${selectedIndex.value + 1})`
  );
  if (element) {
    element.scrollIntoView({ block: 'nearest' });
  }
};

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
</script>

<style scoped>
input {
  border: none;
  outline: none;
}
</style>
