<template>
  <label
    :for="uid"
    class="flex items-start justify-between gap-4 rounded-2xl p-4 transition-all duration-200"
    :class="[
      modelValue ? 'bg-wheat-100' : 'bg-white',
      disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
    ]"
  >
    <div class="flex select-none flex-col gap-1">
      <h3 class="font-bold leading-tight text-rosybrown-800">
        {{ title }}
      </h3>
      <p v-if="description" class="text-xs leading-relaxed text-rosybrown-600">
        {{ description }}
      </p>
    </div>

    <div class="pt-0.5">
      <SeeSwitch
        :id="uid"
        :model-value="props.modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :disabled="props.disabled"
      />
    </div>
  </label>
</template>

<script setup lang="ts">
import SeeSwitch from './SeeSwitch.vue';
import { useId } from 'vue';
interface Props {
  modelValue: boolean;
  title: string;
  description?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const uid = useId();
</script>
