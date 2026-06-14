<template>
  <div>
    <div
      class="fixed top-0 left-0 z-20 h-screen w-screen"
      :class="toggleDimmer"
    ></div>
    <form
      class="outline-rosybrown-300 hover:outline-rosybrown-400 outline relative z-40 flex h-12 flex-row items-center bg-white px-3 outline-2 hover:outline-[3px]"
      :class="toggleInputFocusStyle"
      @submit.prevent="handleSubmit"
      @click="onFormClick"
      v-on-click-outside="
        () => {
          isHistoryVisible = false;
          selectedIndex = -1;
        }
      "
    >
      <button
        type="submit"
        class="mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
        :class="submitButtonClass"
        :disabled="!searchQuery"
      >
        <i-material-symbols-search-rounded width="20" height="20" />
      </button>
      <input
        class="text-rosybrown-800 h-full w-full mr-2"
        v-model.trim="searchQuery"
        @input="filterHistory"
        @focus="filterHistory"
        @keydown.down.prevent="handleKeyDown('down')"
        @keydown.up.prevent="handleKeyDown('up')"
        @keydown.enter.prevent="handleKeyEnter"
      />
      <SearchModeSwitch />
      <ul
        v-show="isHistoryVisible && filteredHistory.length > 0"
        class="outline-rosybrown-300 absolute top-full right-0 left-0 rounded-b-md bg-white pt-2 outline outline-1"
      >
        <li
          v-for="(history, index) in filteredHistory"
          :key="index"
          class="hover:text-rosybrown-700 box-border flex flex-row items-center justify-between border-l-4 px-4 py-1 transition-colors duration-150"
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
              class="text-rosybrown-400 pr-4"
              style="width: 40px"
            />
            <div class="text-rosybrown-600 overflow-hidden text-ellipsis">
              {{ history }}
            </div>
          </div>
          <div
            class="text-rosybrown-300 hover:text-rosybrown-500 cursor-pointer text-sm hover:underline"
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
            class="text-rosybrown-300 hover:text-rosybrown-500 cursor-pointer text-xs"
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Trie } from '../utils/trie';
import { useDebounceFn } from '@vueuse/core';
import SearchModeSwitch from './SearchModeSwitch.vue';
import {
  buildSearchRoute,
  useSearchModeStore,
} from '../store/searchModeStore';

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
const filteredHistory = ref<string[]>([]);
const isHistoryVisible = ref(false);
const isInputFocused = ref(false);
const selectedIndex = ref(-1);
const isMouseHovering = ref(false);

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
  const query = searchQuery.value;
  if (!query) return;

  isHistoryVisible.value = false;
  isInputFocused.value = false;
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
      const serializedTrie = trieHistory.serialize();
      localStorage.setItem('searchHistory', serializedTrie);
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
  } else {
    handleSubmit();
  }
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
  return isHistoryVisible.value
    ? ['backdrop-blur-xs', 'backdrop-brightness-90']
    : ['hidden'];
});

</script>

<style scoped>
/* remove default style */
input {
  border: none;
  outline: none;
}
</style>
