<template>
  <div
    ref="targetEl"
    role="tooltip"
    class="tooltip invisible absolute z-50 inline-block rounded-xl bg-rosybrown-900 px-3 py-2 text-xs font-medium text-wheat-50 opacity-0 shadow-xl transition-opacity duration-300"
  >
    <slot />
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Tooltip } from 'flowbite';
import type { TooltipOptions, TooltipInterface } from 'flowbite';

interface Props {
  id: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  trigger: 'hover',
});

const targetEl = ref<HTMLElement | null>(null);
const tooltipInstance = ref<TooltipInterface | null>(null);

onMounted(() => {
  const $triggerEl = document.querySelector(
    `[data-tooltip-target="${props.id}"]`
  );

  if (targetEl.value && $triggerEl) {
    const options: TooltipOptions = {
      placement: props.placement,
      triggerType: props.trigger,
    };

    tooltipInstance.value = new Tooltip(
      targetEl.value,
      $triggerEl as HTMLElement,
      options
    );
  }
});

onUnmounted(() => {
  tooltipInstance.value?.destroy();
});
</script>
