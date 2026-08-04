<template>
  <article class="overflow-hidden rounded-sm bg-wheat-50/70">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-rosybrown-800 transition-colors duration-200 hover:bg-wheat-100/80"
      @click="emit('toggle')"
    >
      <span class="text-base font-semibold md:text-lg">
        <slot name="title">{{ title }}</slot>
      </span>
      <i-material-symbols-add-rounded
        class="shrink-0 text-2xl text-wheat-600 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </button>
    <div
      v-if="isRendered"
      ref="contentWrapper"
      class="overflow-hidden"
      :style="{ height: wrapperHeight }"
    >
      <div
        ref="contentInner"
        class="px-5 py-4 text-base leading-8 text-wheat-700"
      >
        <slot />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { animate } from 'animejs';
import { nextTick, ref, watch } from 'vue';

interface Props {
  title?: string;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  open: false,
});

const emit = defineEmits<{
  toggle: [];
}>();

const contentWrapper = ref<HTMLDivElement | null>(null);
const contentInner = ref<HTMLDivElement | null>(null);
const isRendered = ref(props.open);
const wrapperHeight = ref(props.open ? 'auto' : '0px');

const animateOpen = async () => {
  isRendered.value = true;
  await nextTick();

  if (!contentWrapper.value || !contentInner.value) return;

  const targetHeight = `${contentInner.value.scrollHeight}px`;
  wrapperHeight.value = '0px';
  contentInner.value.style.opacity = '0';
  contentInner.value.style.transform = 'translateY(-6px)';

  animate(contentWrapper.value, {
    height: [0, targetHeight],
    duration: 320,
    easing: 'easeOutQuart',
    onComplete: () => {
      wrapperHeight.value = 'auto';
    },
  });

  animate(contentInner.value, {
    opacity: [0, 1],
    translateY: [-6, 0],
    duration: 260,
    delay: 40,
    easing: 'easeOutQuad',
  });
};

const animateClose = () => {
  isRendered.value = false;
  wrapperHeight.value = '0px';
};

watch(
  () => props.open,
  (open) => {
    if (open) {
      void animateOpen();
      return;
    }

    animateClose();
  }
);
</script>
