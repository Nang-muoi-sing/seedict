<template>
  <div class="bg-wheat-50 h-full min-h-[100vh] w-full">
    <NavBar
      :show-search-bar="props.showSearchBar"
      :on-search-submit="handleSearchSubmit"
    ></NavBar>
    <div
      class="items-center py-5"
      style="min-height: calc(100vh - 130px - 0.25rem * 56)"
    >
      <!-- 内联样式暂时没有优雅的方法 -->
      <div class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl">
        <slot></slot>
      </div>
    </div>

    <Footer class="relative bottom-0 w-full"></Footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import NavBar from './NavBar.vue';
import Footer from './common/Footer.vue';

interface Props {
  showSearchBar?: boolean;
  onSearchSubmit?: (query: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
  onSearchSubmit: undefined,
});

const router = useRouter();

const handleSearchSubmit = (query: string) => {
  if (props.onSearchSubmit) {
    props.onSearchSubmit(query);
    return;
  }

  router.push({ name: 'search', query: { q: query } });
};
</script>
