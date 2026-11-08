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
      class="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-rosybrown-200 bg-white shadow-sm"
      role="menu"
      aria-label="搜索模式"
    >
      <button
        v-for="optionMode in searchModeOrder"
        :key="optionMode"
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-wheat-50"
        role="menuitemradio"
        :aria-checked="mode === optionMode"
        @click.stop="selectMode(optionMode)"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-semibold text-rosybrown-800">
            {{ searchModes[optionMode].label }}
          </span>
        </span>
        <i-material-symbols-check-rounded
          v-if="mode === optionMode"
          width="18"
          height="18"
          class="shrink-0 text-rosybrown-700"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

import { searchModes, searchModeOrder, type SearchMode } from '@/modules/search/mode';

interface Props {
  modelValue: SearchMode;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: SearchMode];
  'update:open': [value: boolean];
}>();

const mode = computed(() => props.modelValue);
const isOpen = computed(() => props.open);

const currentModeLabel = computed(() => searchModes[mode.value].shortLabel);

const closeMenu = () => {
  emit('update:open', false);
};

const toggleMenu = () => {
  emit('update:open', !props.open);
};

const selectMode = (nextMode: SearchMode) => {
  emit('update:modelValue', nextMode);
  closeMenu();
};
</script>
