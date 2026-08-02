<template>
  <div class="space-y-3">
    <article
      v-for="(item, index) in items"
      :key="item.id || item.title"
      class="overflow-hidden rounded-sm bg-wheat-50/70"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-rosybrown-800 transition-colors duration-200 hover:bg-wheat-100/80"
        @click="toggleItem(index)"
      >
        <span class="text-base font-semibold md:text-lg">
          {{ item.title }}
        </span>
        <i-material-symbols-add-rounded
          class="shrink-0 text-2xl text-wheat-600 transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === index }"
        />
      </button>
      <div
        v-if="openIndex === index"
        class="px-5 py-4 text-base leading-8 text-wheat-700"
      >
        {{ item.content }}
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface AccordionItem {
  id?: string;
  title: string;
  content: string;
}

interface Props {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
  allowCollapse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpenIndex: null,
  allowCollapse: true,
});

const openIndex = ref<number | null>(props.defaultOpenIndex);

const toggleItem = (index: number) => {
  if (props.allowCollapse && openIndex.value === index) {
    openIndex.value = null;
    return;
  }

  openIndex.value = index;
};
</script>
