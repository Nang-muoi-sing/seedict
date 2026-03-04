<template>
  <div class="flex items-center gap-3">
    <button
      :id="uid"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      @click="toggle"
      class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosybrown-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :class="modelValue ? 'bg-rosybrown-600' : 'bg-rosybrown-200'"
    >
      <span
        class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      ></span>
    </button>

    <label
      v-if="$slots.default || uid"
      :for="uid"
      class="cursor-pointer text-sm font-medium leading-none text-rosybrown-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      <slot></slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';
interface Props {
  modelValue: boolean;
  id?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const uid = props.id || useId();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>
