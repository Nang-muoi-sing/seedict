<template>
  <div
    class="pointer-events-none absolute inset-x-0 overflow-hidden leading-none"
    :class="[
      align === 'bottom' ? '-bottom-px' : '-top-px',
      flip ? 'rotate-180' : '',
      colorClass,
    ]"
    aria-hidden="true"
  >
    <svg
      class="block h-24 w-[144%] -translate-x-[16%] md:h-28"
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path :d="wavePath" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  align?: 'top' | 'bottom';
  colorClass?: string;
  flip?: boolean;
  variant?: 'crest' | 'drift' | 'swell';
}

const props = withDefaults(defineProps<Props>(), {
  align: 'bottom',
  colorClass: 'text-white',
  flip: false,
  variant: 'crest',
});

const wavePath = computed(() => {
  if (props.variant === 'drift') {
    return 'M0,98C96,148,198,201,316,186C426,172,490,109,598,88C703,67,803,87,895,138C994,193,1090,223,1193,201C1308,177,1390,105,1440,76L1440,220L0,220Z';
  }

  if (props.variant === 'swell') {
    return 'M0,82C73,145,177,214,290,201C390,190,467,104,575,84C679,65,766,105,868,161C974,219,1083,230,1186,188C1290,145,1370,73,1440,58L1440,220L0,220Z';
  }

  return 'M0,68C87,133,177,186,292,174C395,163,467,88,574,78C689,67,785,129,888,170C987,210,1083,215,1182,187C1283,159,1367,96,1440,74L1440,220L0,220Z';
});
</script>
