<template>
  <div
    v-if="active && currentText"
    class="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center overflow-hidden"
    aria-hidden="true"
  >
    <Transition name="placeholder-flip" mode="out-in">
      <span
        :key="`${placeholderKey}-${currentIndex}`"
        class="block truncate text-rosybrown-400/80"
      >
        {{ currentText }}
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

interface Props {
  active?: boolean;
  intervalMs?: number;
  items: string[];
  paused?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: true,
  intervalMs: 2400,
  paused: false,
});

const emit = defineEmits<{
  change: [text: string];
}>();

const currentIndex = ref(0);
const placeholderKey = ref(0);

let timer: number | null = null;

const stopTimer = () => {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
};

const getRandomIndex = (length: number) => {
  if (length <= 1) return 0;
  return Math.floor(Math.random() * length);
};

const resetRotation = () => {
  currentIndex.value = getRandomIndex(props.items.length);
  placeholderKey.value += 1;
};

const startTimer = () => {
  stopTimer();

  if (
    typeof window === 'undefined' ||
    !props.active ||
    props.paused ||
    props.items.length < 2
  ) {
    return;
  }

  timer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length;
  }, props.intervalMs);
};

const currentText = computed(() => props.items[currentIndex.value] ?? '');

watch(
  () => [props.active, props.intervalMs, props.items, props.paused] as const,
  () => {
    if (!props.paused) {
      resetRotation();
    }
    startTimer();
  },
  { immediate: true }
);

watch(
  currentText,
  (text) => {
    emit('change', text);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped>
.placeholder-flip-enter-active,
.placeholder-flip-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.placeholder-flip-enter-from {
  opacity: 0;
  transform: translateY(0.6rem);
}

.placeholder-flip-leave-to {
  opacity: 0;
  transform: translateY(-0.6rem);
}
</style>
