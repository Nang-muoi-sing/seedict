<template>
  <Teleport to="body">
    <Transition name="modal-fade" @after-leave="handleAfterLeave">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-rosybrown-900/40 backdrop-blur-sm"
          @click="emit('blur')"
        ></div>

        <div
          class="modal-content-wrapper pointer-events-none relative z-10 flex w-full items-center justify-center"
        >
          <div class="pointer-events-auto w-full max-w-fit">
            <slot>
              <div
                class="w-full max-w-md rounded-2xl bg-white p-6 text-rosybrown-800 shadow-xl"
              >
                默认内容
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['blur']);

const lockScroll = () => {
  // 计算滚动条宽度 (预防页面内容跳动)
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollBarWidth}px`;
  document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

// 弹窗打开时，禁用页面滚动
watch(
  () => props.show,
  (val) => {
    if (val) {
      lockScroll();
    }
  }
);

// Transition 离开动画结束后的回调
const handleAfterLeave = () => {
  unlockScroll();
};

// 监听 Esc 键
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    emit('blur');
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEsc);
}

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

/* 遮罩渐变 */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content-wrapper,
.modal-fade-leave-active .modal-content-wrapper {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .modal-content-wrapper {
  transform: scale(0.95) translateY(10px);
}

.modal-fade-leave-to .modal-content-wrapper {
  transform: scale(0.98);
}
</style>
