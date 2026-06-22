<template>
  <div class="relative shrink-0" v-on-click-outside="closeMenu">
    <button
      type="button"
      class="mr-2 shrink-0 text-sm font-semibold text-rosybrown-500 transition-colors hover:text-rosybrown-800"
      :class="{ 'text-rosybrown-800': isOpen }"
      @click.stop="toggleMenu"
    >
      {{ currentModeLabel }}
      <i-material-symbols-keyboard-arrow-down-rounded
        class="inline transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
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
import { computed } from 'vue';
import { type SearchMode, useSearchModeStore } from '../store/searchModeStore';

interface Props {
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const searchModeStore = useSearchModeStore();

const modeOptions: Array<{
  mode: SearchMode;
  label: string;
  description: string;
}> = [
  {
    mode: 'fuzzy',
    label: '按字词查',
    description: '由关键字匹配查询词汇',
  },
  {
    mode: 'semantic',
    label: '按意思查',
    description: '由内容的语义查询词汇',
  },
];

const isOpen = computed(() => props.open);

const currentModeLabel = computed(() =>
  searchModeStore.mode === 'semantic' ? '语义' : '字词'
);

const closeMenu = () => {
  emit('update:open', false);
};

const toggleMenu = () => {
  emit('update:open', !props.open);
};

const selectMode = (mode: SearchMode) => {
  searchModeStore.setMode(mode);
  closeMenu();
};
</script>
