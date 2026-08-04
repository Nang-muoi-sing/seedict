<template>
  <div>
    <div class="group relative">
      <button
        type="button"
        class="absolute left-0 top-[0.2em] flex h-5 w-5 -translate-x-6 items-center justify-center rounded-sm text-wheat-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-rosybrown-700 focus:opacity-100 focus:outline-none"
        @click="toggle"
      >
        <i-material-symbols-play-arrow-rounded
          class="text-base transition-transform duration-200"
          :class="{ 'rotate-90': isOpen }"
        />
      </button>
      <component v-if="hasTitleSlot" :is="titleTag" :class="titleClass">
        <slot name="title" />
      </component>
      <component v-else :is="titleTag" :class="titleClass">
        {{ title }}
      </component>
    </div>

    <div v-if="isOpen" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue';

interface Props {
  title?: string;
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  defaultOpen?: boolean;
  allowCollapse?: boolean;
  titleClass?: string;
  contentClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  titleTag: 'h3',
  defaultOpen: false,
  allowCollapse: true,
  titleClass: '',
  contentClass: '',
});

const slots = useSlots();
const hasTitleSlot = !!slots.title;
const isOpen = ref(props.defaultOpen);

const toggle = () => {
  if (props.allowCollapse && isOpen.value) {
    isOpen.value = false;
    return;
  }

  isOpen.value = true;
};
</script>
