<template>
  <div>
    <nav
      class="items-top flex flex-row justify-between gap-5 px-4 py-2 sm:px-16 sm:py-8"
    >
      <RouterLink :to="{ name: 'home' }" class="min-w-35 z-30 hidden md:block">
        <img src="../assets/logo.svg" />
      </RouterLink>
      <SearchBar
        v-if="props.showSearchBar"
        class="w-xs sm:w-sm md:w-md"
        :auto-navigate="false"
        @submit="props.onSearchSubmit"
      ></SearchBar>
      <div v-else class="w-xs sm:w-sm md:w-md"></div>
      <NavPanel class="z-30 hidden w-xs lg:flex"></NavPanel>
      <button
        class="flex cursor-pointer items-center rounded-md p-2 text-rosybrown-600 hover:text-rosybrown-800 focus:outline-none lg:hidden"
        @click="openSidebar"
      >
        <i-material-symbols-menu-rounded style="font-size: 36px" />
      </button>
    </nav>

    <div
      class="fixed inset-0 z-50 flex lg:hidden"
      :class="{ hidden: !isSidebarOpen && !isAnimating }"
    >
      <div
        class="backdrop-blur-xs fixed inset-0 backdrop-brightness-90"
        @click="closeSidebar"
        ref="backdrop"
      ></div>

      <div
        class="absolute right-0 top-0 h-full w-full max-w-xs transform flex-col bg-wheat-50"
        ref="sidebar"
      >
        <button
          class="flex cursor-pointer items-center rounded-md p-2 text-rosybrown-600 hover:text-rosybrown-800 focus:outline-none lg:hidden"
          @click="closeSidebar"
        >
          <i-material-symbols-menu-rounded style="font-size: 36px" />
        </button>

        <div
          class="flex w-full flex-col items-center justify-center px-2 py-4 font-sans text-lg"
        >
          <img class="mb-8" src="../assets/logo.svg" draggable="false" />
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <RouterLink
              :to="{ name: 'home' }"
              class="inline-flex w-full items-center"
              ><i-material-symbols-home-rounded class="mr-1" />主页</RouterLink
            >
          </div>
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'tutorial' }"
            >
              <i-material-symbols-school-rounded class="mr-1" />入门</RouterLink
            >
          </div>
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <a
              class="inline-flex w-full items-center"
              href="https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc"
              target="_blank"
              ><i-material-symbols-help-rounded class="mr-1" />帮助</a
            >
          </div>
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'tool' }"
            >
              <i-lucide-tool-case class="mr-1" />工具</RouterLink
            >
          </div>
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'ime' }"
            >
              <i-material-symbols-keyboard class="mr-1" />输入法</RouterLink
            >
          </div>
          <div
            class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
          >
            <RouterLink
              class="inline-flex w-full items-center"
              :to="{ name: 'about' }"
            >
              <i-material-symbols-crowdsource class="mr-1" />关于</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs';
import { onMounted, ref } from 'vue';
import NavPanel from './NavPanel.vue';
import SearchBar from './SearchBar.vue';

interface Props {
  showSearchBar?: boolean;
  onSearchSubmit?: (query: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
  onSearchSubmit: (query: string) => {
    void query;
  },
});

const isSidebarOpen = ref(false);
const isAnimating = ref(false);
const sidebar = ref<HTMLDivElement | null>(null);
const backdrop = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (sidebar.value) {
    sidebar.value.style.transform = 'translateX(100%)';
  }
  if (backdrop.value) {
    backdrop.value.style.opacity = '0';
    backdrop.value.style.pointerEvents = 'none';
  }
});

const openSidebar = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  isSidebarOpen.value = true;

  if (sidebar.value) {
    animate(sidebar.value, {
      translateX: 0,
      duration: 300,
      easing: 'easeInQuad',
      onComplete: () => {
        if (backdrop.value) backdrop.value.style.pointerEvents = 'auto';
        isAnimating.value = false;
      },
    });
  }

  if (backdrop.value) {
    animate(backdrop.value, {
      opacity: 1,
      duration: 300,
      easing: 'linear',
    });
  }
};

const closeSidebar = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  if (backdrop.value) backdrop.value.style.pointerEvents = 'none';
  if (sidebar.value) {
    animate(sidebar.value, {
      translateX: 100,
      duration: 300,
      easing: 'easeOutQuad',
      onComplete: () => {
        isSidebarOpen.value = false;
        isAnimating.value = false;
      },
    });
  }

  if (backdrop.value) {
    animate(backdrop.value, {
      opacity: 0,
      duration: 300,
      easing: 'linear',
    });
  }
};
</script>
