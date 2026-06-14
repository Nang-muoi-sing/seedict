<template>
  <div class="relative shrink-0" v-on-click-outside="closeMenu">
    <button
      type="button"
      class="group inline-flex h-9 w-9 items-center justify-center rounded-full text-rosybrown-400 transition-colors hover:bg-wheat-100 hover:text-rosybrown-800"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click.stop="toggleMenu"
    >
      <i-typcn-flash
        v-if="searchModeStore.mode === 'fuzzy'"
        width="22"
        height="22"
      />
      <i-octicon-sparkle-fill-16 v-else width="20" height="20" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-rosybrown-200 bg-white shadow-sm"
      role="menu"
      aria-label="搜索模式"
    >
      <button
        v-for="option in modeOptions"
        :key="option.mode"
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-wheat-50"
        role="menuitemradio"
        :aria-checked="searchModeStore.mode === option.mode"
        @click.stop="selectMode(option.mode)"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-semibold text-rosybrown-800">
            {{ option.label }}
          </span>
          <span class="block text-xs text-wheat-500">
            {{ option.description }}
          </span>
        </span>
        <i-material-symbols-check-rounded
          v-if="searchModeStore.mode === option.mode"
          width="18"
          height="18"
          class="shrink-0 text-rosybrown-700"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components';
import { ref } from 'vue';
import { type SearchMode, useSearchModeStore } from '../store/searchModeStore';

const searchModeStore = useSearchModeStore();
const isOpen = ref(false);

const modeOptions: Array<{
  mode: SearchMode;
  label: string;
  description: string;
}> = [
  {
    mode: 'fuzzy',
    label: '模糊搜索',
    description: '由关键字模糊查询词汇',
  },
  {
    mode: 'semantic',
    label: '语义搜索',
    description: '由内容的语义查询词汇',
  },
];

const closeMenu = () => {
  isOpen.value = false;
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const selectMode = (mode: SearchMode) => {
  searchModeStore.setMode(mode);
  closeMenu();
};
</script>
