<template>
  <Teleport to="body">
    <div
      ref="toastContainer"
      class="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center opacity-0"
      :style="{ transform: 'translateY(0)', zIndex: currentZIndex }"
    >
      <div
        class="pointer-events-auto mb-10 flex flex-row items-center gap-3 rounded-lg border border-black/5 bg-white px-6 py-3 font-medium shadow-lg"
      >
        <component
          :is="statusConfig[type].icon"
          :class="statusConfig[type].color"
          class="shrink-0 text-xl"
        />

        <span class="whitespace-nowrap text-rosybrown-900">
          <slot>{{ message }}</slot>
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createTimeline, utils, eases } from 'animejs';
import type { Timeline } from 'animejs';

import CheckIcon from '~icons/material-symbols/check-circle-rounded';
import ErrorIcon from '~icons/material-symbols/error-rounded';
import InfoIcon from '~icons/material-symbols/info-rounded';

type ToastType = 'success' | 'error' | 'info';

interface Props {
  message?: string;
  type?: ToastType;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 700,
});

const toastContainer = ref<HTMLElement | null>(null);
const currentZIndex = ref(100); // 响应式层级绑定

let activeTimeline: Timeline | null = null;

const statusConfig = {
  success: { icon: CheckIcon, color: 'text-green-500' },
  error: { icon: ErrorIcon, color: 'text-red-500' },
  info: { icon: InfoIcon, color: 'text-rosybrown-500' },
};

const show = () => {
  if (!toastContainer.value) return;

  // 1. 提升层级
  currentZIndex.value = 100 + (Date.now() % 10000);

  // 2. 检查当前是否已经处于“弹出”状态
  // 这里的 'translateY' 是我们要检查的属性
  const currentY = utils.get(toastContainer.value, 'translateY');
  const isVisible = parseFloat(currentY as string) < -10; // 如果向上偏移了超过 10px，说明已在空中

  // 3. 停止旧动画
  utils.remove(toastContainer.value);

  // 4. 创建新 Timeline
  activeTimeline = createTimeline();

  if (isVisible) {
    // 【原地刷新逻辑】
    // 已经在空中了，快速闪烁一下（先变暗再变亮），给人“内容刷新”的感觉
    activeTimeline.add(toastContainer.value, {
      // opacity: [1, 0.4, 1], // 呼吸闪烁
      scale: [1, 1.05, 1], // 配合微小的缩放更有打击感
      duration: 300,
      ease: eases.outQuad,
    });
  } else {
    // 【初次升起逻辑】
    // 强制重置到底部开始
    utils.set(toastContainer.value, { translateY: 0, opacity: 0 });
    activeTimeline.add(toastContainer.value, {
      translateY: -100,
      opacity: 1,
      duration: 400,
      ease: eases.outCubic,
    });
  }

  // 5. 共同的消失逻辑（所有路径最后都会走到这里）
  activeTimeline.add(toastContainer.value, {
    translateY: -100,
    opacity: 0,
    duration: 400,
    delay: props.duration,
    ease: eases.inCubic,
    onComplete: () => {
      if (toastContainer.value) {
        utils.set(toastContainer.value, { translateY: 0, opacity: 0 });
        currentZIndex.value = 100;
      }
    },
  });

  activeTimeline.play();
};

defineExpose({ show });
</script>
