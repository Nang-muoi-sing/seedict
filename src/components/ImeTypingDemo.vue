<template>
  <h2 class="mt-3 font-mono text-6xl font-bold text-rosybrown-700">
    <span class="text-rosybrown-800">{{ committedText }}</span>
    <span
      v-if="composingText"
      class="bg-wheat-100 px-0.5 pt-1.5 text-wheat-700"
    >
      {{ composingText }}
    </span>
    <span class="ime-caret"></span>
  </h2>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const imeSegments = [
  {
    typing: "yng53'ping55",
    committed: '榕拼',
  },
  {
    typing: "su5'ik5'huak5",
    committed: '输入法',
  },
] as const;

const committedText = ref('');
const composingText = ref('');

let animationTimer: number | null = null;
let isAnimationActive = false;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    animationTimer = window.setTimeout(resolve, ms);
  });

const clearAnimationTimer = () => {
  if (animationTimer !== null) {
    window.clearTimeout(animationTimer);
    animationTimer = null;
  }
};

const typeSegment = async (typing: string) => {
  for (let index = 1; index <= typing.length; index += 1) {
    if (!isAnimationActive) return false;
    composingText.value = typing.slice(0, index);
    await sleep(90);
  }

  return true;
};

const commitSegment = async (committed: string) => {
  if (!isAnimationActive) return false;
  await sleep(260);
  committedText.value += committed;
  composingText.value = '';
  await sleep(620);
  return true;
};

const clearLoop = async () => {
  await sleep(1200);

  while (
    (committedText.value.length > 0 || composingText.value.length > 0) &&
    isAnimationActive
  ) {
    if (composingText.value.length > 0) {
      composingText.value = composingText.value.slice(0, -1);
    } else {
      committedText.value = committedText.value.slice(0, -1);
    }
    await sleep(70);
  }

  await sleep(350);
};

const runTypingLoop = async () => {
  while (isAnimationActive) {
    committedText.value = '';
    composingText.value = '';

    for (const segment of imeSegments) {
      const typed = await typeSegment(segment.typing);
      if (!typed) return;

      const committed = await commitSegment(segment.committed);
      if (!committed) return;
    }

    await clearLoop();
  }
};

onMounted(() => {
  isAnimationActive = true;
  runTypingLoop();
});

onBeforeUnmount(() => {
  isAnimationActive = false;
  clearAnimationTimer();
});
</script>

<style scoped>
.ime-caret {
  display: inline-block;
  width: 1px;
  height: 1.1em;
  margin-left: 0.1em;
  vertical-align: -0.15em;
  background: currentColor;
  animation: ime-caret-blink 1s step-end infinite;
}

@keyframes ime-caret-blink {
  0%,
  45% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}
</style>
