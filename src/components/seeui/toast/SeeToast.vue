<template>
  <div
    ref="toastContainer"
    class="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center opacity-0"
    :style="{ transform: 'translateY(0)', zIndex: currentZIndex }"
  >
    <div
      class="pointer-events-auto mb-10 flex flex-row items-center gap-3 rounded-lg border border-black/5 bg-white px-6 py-3 font-medium shadow-lg"
    >
      <component
        :is="statusConfig[currentType].icon"
        :class="statusConfig[currentType].color"
        class="shrink-0 text-xl"
      />

      <span class="whitespace-nowrap text-rosybrown-900">
        {{ currentMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTimeline, utils, eases } from 'animejs';
import type { Timeline } from 'animejs';

import CheckIcon from '~icons/material-symbols/check-circle-rounded';
import ErrorIcon from '~icons/material-symbols/error-rounded';
import InfoIcon from '~icons/material-symbols/info-rounded';

type ToastType = 'success' | 'error' | 'info';

const currentMessage = ref('');
const currentType = ref<ToastType>('success');
const currentZIndex = ref(2000);

const toastContainer = ref<HTMLElement | null>(null);
let activeTimeline: Timeline | null = null;

const statusConfig = {
  success: { icon: CheckIcon, color: 'text-green-500' },
  error: { icon: ErrorIcon, color: 'text-red-500' },
  info: { icon: InfoIcon, color: 'text-rosybrown-500' },
};

const show = (msg: string, type: ToastType, duration: number) => {
  if (!toastContainer.value) return;

  currentMessage.value = msg;
  currentType.value = type;

  currentZIndex.value = 2000 + (Date.now() % 1000);

  const currentY = utils.get(toastContainer.value, 'translateY');
  const isVisible = parseFloat(currentY as string) < -10;

  if (activeTimeline) activeTimeline.pause();
  utils.remove(toastContainer.value);

  activeTimeline = createTimeline();

  if (isVisible) {
    activeTimeline.add(toastContainer.value, {
      scale: [1, 1.1, 1],
      duration: 300,
      ease: eases.outQuad,
    });
  } else {
    utils.set(toastContainer.value, { translateY: 0, opacity: 0 });
    activeTimeline.add(toastContainer.value, {
      translateY: -100,
      opacity: 1,
      duration: 400,
      ease: eases.outCubic,
    });
  }

  activeTimeline.add(toastContainer.value, {
    translateY: -100,
    opacity: 0,
    duration: 400,
    delay: duration,
    ease: eases.inCubic,
    onComplete: () => {
      if (toastContainer.value) {
        utils.set(toastContainer.value, { translateY: 0, opacity: 0 });
      }
    },
  });

  activeTimeline.play();
};

defineExpose({ show });
</script>