<template>
  <div
    class="relative flex h-[40vh] min-h-[24rem] w-screen items-center justify-center overflow-hidden"
  >
    <div
      v-for="(card, index) in deckStore.cards"
      :key="card.w"
      class="deck absolute flex touch-none items-center justify-center will-change-transform"
      :style="{
        transform: `translate3d(${springs[index]?.x || 0}px, ${springs[index]?.y || 0}px, 0)
                   scale(${springs[index]?.scale || 1})`,
      }"
    >
      <div
        @mousedown="onDragStart(index)"
        @mousemove="onDragMove(index, $event)"
        @mouseup="onDragEnd(index)"
        @mouseleave="onDragEnd(index)"
        @touchstart="onDragStart(index)"
        @touchmove="onDragMove(index, $event)"
        @touchend="onDragEnd(index)"
        class="relative h-60 w-[75vw] select-none rounded-xl border-[1px] border-solid border-wheat-200 bg-rosybrown-50 p-4 lg:h-64 lg:w-[30rem]"
      >
        <div class="h-full font-sans">
          <span class="text-base italic text-wheat-400 lg:text-lg"
            >#汝会仈儥？</span
          >
          <div class="flex flex-col items-center space-y-5">
            <RouterLink
              class="block"
              :to="{ name: 'word', query: { w: card.w } }"
            >
              <RubyText
                class="text-3xl font-bold text-rosybrown-800 md:text-4xl lg:text-5xl"
                :text="card.text"
                :yngping="card.pron"
              ></RubyText>
            </RouterLink>
            <p
              class="line-clamp-4 max-w-lg overflow-hidden text-ellipsis whitespace-normal text-base text-rosybrown-800 lg:line-clamp-2 lg:text-lg"
            >
              释义：<FormatText
                :text="card.expl"
                :correction-rules="['punctuation']"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../store/deckStore';
import FormatText from './common/FormatText.vue';
import RubyText from './common/RubyText.vue';

const deckStore = useDeckStore();
const router = useRouter();

type Spring = {
  x: number;
  y: number;
  scale: number;
};

const springs = reactive<Spring[]>([]);
const currentDraggingIndex = ref<number | null>(null);
const startX = ref(0);
const movementX = ref(0);
const startTime = ref(0);

// 初始化弹簧动画
const initSprings = (): void => {
  springs.length = 0; // 清空旧动画数据

  deckStore.cards.forEach((_, index) => {
    // 判断卡片是否已被标记为 gone
    const isGone = deckStore.gone.has(index);

    springs.push({
      x: isGone
        ? index % 2 === 0
          ? -window.innerWidth - 200
          : window.innerWidth + 200
        : index * 4,
      y: isGone ? 0 : index * 4,
      scale: 1,
    });
  });

  // 入场动画：只对未 gone 的卡片执行
  setTimeout(() => {
    deckStore.cards.forEach((_, index) => {
      if (!deckStore.gone.has(index)) {
        gsap.to(springs[index], {
          x: index * 4,
          y: index * 4,
          scale: 1,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power2.out',
        });
      }
    });
  }, 0);
};

// 拖动开始：过滤已移除的卡片
const onDragStart = (index: number): void => {
  if (deckStore.gone.has(index)) return; // 已移除的卡片不响应拖动
  currentDraggingIndex.value = index;
  const event = window.event as MouseEvent | TouchEvent;
  startX.value =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  movementX.value = 0;
  startTime.value = Date.now();
  gsap.to(springs[index], { scale: 1.0, duration: 0.1 }); // 拖动缩放
};

// 拖动移动：判断卡片是否已移除
const onDragMove = (index: number, event: MouseEvent | TouchEvent): void => {
  if (currentDraggingIndex.value !== index || deckStore.gone.has(index)) return;
  const clientX =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  movementX.value = clientX - startX.value;
  springs[index].x = movementX.value; // 实时更新位置
};

// 拖动结束：调用 Store 标记已移除，所有卡片移除后请求新数据
const onDragEnd = (index: number): void => {
  if (currentDraggingIndex.value !== index || deckStore.gone.has(index)) return;

  const endTime = Date.now();
  const elapsedTime = endTime - startTime.value;
  const velocity = Math.abs(movementX.value) / elapsedTime;
  const trigger = velocity > 0.002;
  const dir = movementX.value < 0 ? -1 : 1;

  if (trigger) {
    deckStore.addGoneIndex(index);

    gsap.to(springs[index], {
      x: (window.innerWidth + 200) * dir,
      scale: 0.2,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // 所有卡片移除后请求新数据
        if (deckStore.gone.size === deckStore.cards.length) {
          deckStore.fetchDeck();
        }
      },
    });
  } else {
    // 未触发移除，回弹到初始位置
    gsap.to(springs[index], {
      x: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  currentDraggingIndex.value = null;
};

onMounted(() => {
  if (deckStore.cards.length === 0) {
    deckStore.fetchDeck();
  } else {
    initSprings();
  }
});

watch(
  () => deckStore.cards,
  (newCards) => {
    if (newCards.length > 0) {
      initSprings();
    }
  },
  { deep: true }
);

watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    // 路由后退且 Store 有数据
    if (newRoute.path === oldRoute.path && deckStore.cards.length > 0) {
      initSprings();
    }
  }
);
</script>

<style scoped>
.deck > div {
  will-change: transform;
}
</style>
