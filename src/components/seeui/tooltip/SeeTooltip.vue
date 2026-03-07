<template>
  <div
    ref="targetEl"
    role="tooltip"
    class="tooltip invisible absolute z-50 inline-block rounded-xl bg-rosybrown-900 px-3 py-2 text-xs font-medium text-wheat-50 opacity-0 shadow-xl transition-opacity duration-300"
  >
    <div v-html="content"></div>
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Tooltip } from 'flowbite';
import type { TooltipInterface } from 'flowbite';

const targetEl = ref<HTMLElement | null>(null);
const tooltipInstance = ref<TooltipInterface | null>(null);
const content = ref('');

const handleGlobalMouseOver = (e: MouseEvent) => {
  // 寻找带有 data-tooltip-msg 的最近祖先
  const triggerEl = (e.target as HTMLElement).closest('[data-tooltip-msg]');

  if (triggerEl && targetEl.value) {
    const msg = triggerEl.getAttribute('data-tooltip-msg') || '';
    if (!msg) return;

    content.value = msg;

    tooltipInstance.value?.destroy();
    tooltipInstance.value = new Tooltip(
      targetEl.value,
      triggerEl as HTMLElement,
      {
        placement: 'top',
        triggerType: 'hover',
      }
    );

    tooltipInstance.value.show();
  }
};

onMounted(() => {
  window.addEventListener('mouseover', handleGlobalMouseOver);
});

onUnmounted(() => {
  window.removeEventListener('mouseover', handleGlobalMouseOver);
  tooltipInstance.value?.destroy();
});
</script>
