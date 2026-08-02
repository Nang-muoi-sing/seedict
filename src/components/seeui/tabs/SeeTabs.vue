<template>
  <div
    class="inline-flex flex-wrap gap-2 rounded-xl bg-wheat-100/70 p-1"
    role="tablist"
    aria-label="Tabs"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150"
      :class="
        modelValue === tab.id
          ? 'bg-white text-rosybrown-800 shadow-sm'
          : 'text-wheat-700 hover:bg-wheat-50 hover:text-rosybrown-700'
      "
      :aria-selected="modelValue === tab.id"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SeeTabItem {
  id: string;
  label: string;
}

interface Props {
  modelValue: string;
  tabs: SeeTabItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
