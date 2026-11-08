<template>
  <div>
    <div class="relative flex items-start gap-1 md:block">
      <button
        type="button"
        class="mt-[0.2em] flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-wheat-600 transition-colors duration-150 hover:text-rosybrown-700 focus:outline-none md:absolute md:left-0 md:top-[0.2em] md:mt-0 md:-translate-x-6"
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
      <slot name="header" />
      <slot name="persistent" :open="isOpen" />
      <slot />
    </div>
    <slot v-else name="persistent" :open="isOpen" />
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
