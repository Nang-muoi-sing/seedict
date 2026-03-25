<template>
  <Teleport to="body">
    <div
      ref="menuRef"
      class="z-[2000] hidden min-w-[120px] rounded-xl border border-wheat-200 bg-white p-1.5 ring-1 ring-black/5"
    >
      <div
        v-if="state.title"
        class="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-widest text-rosybrown-400"
      >
        {{ state.title }}
      </div>

      <div class="flex flex-col gap-0.5">
        <button
          v-for="opt in state.options"
          :key="opt"
          @click="handleSelect(opt)"
          class="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold text-rosybrown-700 transition-all hover:bg-wheat-50 active:scale-95"
        >
          <span>{{ opt }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Dropdown } from 'flowbite';
import type { DropdownInterface } from 'flowbite';

interface MenuConfig {
  title?: string;
  options: readonly string[];
  onSelect: (val: string) => void;
}

const state = reactive<MenuConfig>({
  title: '',
  options: [],
  onSelect: () => {},
});

const menuRef = ref<HTMLElement | null>(null);
const instance = ref<DropdownInterface | null>(null);

const open = (triggerEl: HTMLElement, config: MenuConfig) => {
  if (!menuRef.value) return;

  Object.assign(state, config);

  if (instance.value) {
    instance.value.destroy();
  }

  instance.value = new Dropdown(menuRef.value, triggerEl, {
    placement: 'bottom-start',
    triggerType: 'none',
    offsetDistance: 8,
  });

  instance.value.show();
};

const handleSelect = (val: string) => {
  state.onSelect(val);
  instance.value?.hide();
};

defineExpose({ open });
</script>
