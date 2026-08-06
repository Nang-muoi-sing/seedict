<template>
  <span
    ref="underlineRoot"
    class="hand-underline relative inline-block"
    :class="{ 'is-drawn': isDrawn }"
  >
    <span class="relative z-10 inline-block"><slot /></span>
    <svg
      class="pointer-events-none absolute left-1/2 top-full h-4 w-[118%] -translate-x-1/2 -translate-y-[0.55rem] rotate-[-2deg] overflow-visible"
      viewBox="0 0 120 18"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="hand-underline-rough"
          x="-20%"
          y="-80%"
          width="140%"
          height="260%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="17"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="hand-underline-chalk"
          x="-20%"
          y="-80%"
          width="140%"
          height="260%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.18"
            numOctaves="2"
            seed="23"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.28 0"
            result="softGrain"
          />
          <feDisplacementMap
            in="softGrain"
            in2="grain"
            scale="0.9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feComposite in="SourceGraphic" in2="softGrain" operator="in" />
        </filter>
      </defs>
      <path
        class="hand-underline-path hand-underline-path-back"
        d="M4 12 C24 15, 67 6, 116 10"
        fill="none"
        stroke="#efc18f"
        stroke-width="7.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        style="--path-opacity: 0.34"
        filter="url(#hand-underline-chalk)"
      />
      <path
        class="hand-underline-path hand-underline-path-main"
        d="M3 12 C23 15, 67 7, 115 10"
        fill="none"
        stroke="#c86a2b"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        style="--path-opacity: 0.86"
        filter="url(#hand-underline-rough)"
      />
      <path
        class="hand-underline-path hand-underline-path-accent"
        d="M31 13 C52 14, 81 8, 109 11"
        fill="none"
        stroke="#e39a58"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        style="--path-opacity: 0.48"
        filter="url(#hand-underline-rough)"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const underlineRoot = ref<HTMLElement | null>(null);
const isDrawn = ref(false);
let drawRafId: number | null = null;

const removeDrawListeners = () => {
  window.removeEventListener('scroll', scheduleDrawCheck);
  window.removeEventListener('resize', scheduleDrawCheck);
};

const hasSectionTopReachedViewportRatio = (
  element: HTMLElement,
  viewportRatio: number
) => {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight * viewportRatio;
};

const checkDrawTrigger = () => {
  drawRafId = null;

  if (!underlineRoot.value) {
    return;
  }

  const triggerElement =
    underlineRoot.value.closest<HTMLElement>('section') ?? underlineRoot.value;

  if (!hasSectionTopReachedViewportRatio(triggerElement, 0.45)) {
    return;
  }

  isDrawn.value = true;
  removeDrawListeners();
};

function scheduleDrawCheck() {
  if (isDrawn.value || drawRafId !== null) {
    return;
  }

  drawRafId = window.requestAnimationFrame(checkDrawTrigger);
}

onMounted(() => {
  if (!underlineRoot.value) {
    isDrawn.value = true;
    return;
  }

  scheduleDrawCheck();
  window.addEventListener('scroll', scheduleDrawCheck, { passive: true });
  window.addEventListener('resize', scheduleDrawCheck);
});

onBeforeUnmount(() => {
  if (drawRafId !== null) {
    window.cancelAnimationFrame(drawRafId);
  }

  removeDrawListeners();
});
</script>

<style scoped>
.hand-underline-path {
  opacity: 0;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.hand-underline.is-drawn .hand-underline-path {
  animation: hand-underline-draw 720ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hand-underline.is-drawn .hand-underline-path-main {
  animation-delay: 70ms;
}

.hand-underline.is-drawn .hand-underline-path-accent {
  animation-delay: 170ms;
}

@keyframes hand-underline-draw {
  0% {
    opacity: 0;
    stroke-dashoffset: 1;
  }

  18% {
    opacity: var(--path-opacity);
  }

  100% {
    opacity: var(--path-opacity);
    stroke-dashoffset: 0;
  }
}
</style>
