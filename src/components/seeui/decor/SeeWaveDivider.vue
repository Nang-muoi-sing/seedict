<template>
  <div
    ref="waveRoot"
    class="pointer-events-none absolute inset-x-0 overflow-hidden leading-none"
    :class="[align === 'bottom' ? '-bottom-px' : '-top-px', colorClass]"
    aria-hidden="true"
  >
    <div ref="waveInner">
      <svg
        class="block h-16 flex-none sm:h-20 md:h-28"
        :style="{ width: `${waveWidth}px` }"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path :d="wavePath" />
      </svg>
      <svg
        class="block h-16 flex-none sm:h-20 md:h-28"
        :style="{ width: `${waveWidth}px` }"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path :d="wavePath" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { utils } from 'animejs';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
  align?: 'top' | 'bottom';
  colorClass?: string;
  flip?: boolean;
  offsetX?: number;
}

const props = withDefaults(defineProps<Props>(), {
  align: 'bottom',
  colorClass: 'text-white',
  flip: false,
  offsetX: 0,
});
const waveRoot = ref<HTMLElement | null>(null);
const waveInner = ref<HTMLElement | null>(null);
const waveWidth = ref(1440);
const minWaveWidth = 960;
let resizeObserver: ResizeObserver | null = null;

const normalizeOffset = (offset: number, width: number) => {
  if (width <= 0) return 0;

  const wrapped = ((offset % width) + width) % width;
  return -wrapped;
};

const updateWavePosition = () => {
  if (!waveInner.value) return;

  utils.set(waveInner.value, {
    display: 'flex',
    rotate: props.flip ? 180 : 0,
    translateX: normalizeOffset(props.offsetX, waveWidth.value),
  });
};

onMounted(() => {
  if (waveRoot.value) {
    const syncWidth = () => {
      if (!waveRoot.value) return;
      waveWidth.value = Math.max(waveRoot.value.clientWidth, minWaveWidth);
      updateWavePosition();
    };

    syncWidth();
    resizeObserver = new ResizeObserver(syncWidth);
    resizeObserver.observe(waveRoot.value);
  } else {
    updateWavePosition();
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
  () => [props.offsetX, props.flip, waveWidth.value] as const,
  updateWavePosition,
  { immediate: true }
);

const wavePath = computed(
  () =>
    'M0,108C180,108,180,52,360,52C540,52,540,156,720,156C900,156,900,44,1080,44C1260,44,1260,108,1440,108L1440,220L0,220Z'
);
</script>
