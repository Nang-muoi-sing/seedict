<template>
  <div class="relative z-10 min-h-screen overflow-hidden bg-wheat-50">
    <div
      class="relative z-50 flex justify-center px-4 pb-8 pt-8 md:justify-end md:px-16 md:pb-0"
    >
      <NavPanel class="relative w-xs"></NavPanel>
    </div>
    <div
      class="relative mx-auto mt-5 flex w-fit flex-col items-center space-y-8 text-center"
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="relative z-30 block pl-10"
        :style="{
          transform: `translateY(-${Math.min(scrollY * 1, 200)}px)`,
          opacity: Math.max(0, 1 - scrollY / 500),
        }"
      >
        <img src="../assets/logo-see.svg" />
      </RouterLink>
      <SearchBar class="relative w-xs sm:w-sm md:w-md"></SearchBar>
    </div>
    <WordsDeck></WordsDeck>
  </div>
  <Footer class="relative"></Footer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import Footer from '../components/common/Footer.vue';
import NavPanel from '../components/NavPanel.vue';
import SearchBar from '../components/SearchBar.vue';
import WordsDeck from '../components/WordsDeck.vue';
import { useSearchModeStore } from '../store/searchModeStore';

const route = useRoute();
const searchModeStore = useSearchModeStore();
const scrollY = ref(0);
const searchBarFixed = ref(false);
const navPanelFixed = ref(false);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  searchBarFixed.value = scrollY.value > 200;
  navPanelFixed.value = scrollY.value > 300;
};

onMounted(() => {
  document.title = '米时典 SeeDict | 福州话词典';
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(
  () => route.name,
  (name) => {
    if (name === 'semantic-home') {
      searchModeStore.setMode('semantic');
    }
  },
  { immediate: true }
);
</script>
