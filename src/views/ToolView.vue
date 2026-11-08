<template>
  <DefaultLayout :show-search-bar="false">
    <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
      <RubyText :text="'工具'" :yngping="'geoyng53 geoy242'"></RubyText>
    </div>
    <div
      class="mb-32 flex h-96 w-full flex-wrap content-start justify-start gap-5 rounded-3xl bg-white px-6 py-4"
    >
      <RouterLink :to="{ name: 'phonetic-convert' }"
        ><AppIcon :name="'榕拼转换'"
          ><i-material-symbols-language-chinese-pinyin /></AppIcon
      ></RouterLink>
      <RouterLink :to="{ name: 'relatives-calculator' }"
        ><AppIcon :name="'称呼计算'"><i-icon-park-outline-family /></AppIcon
      ></RouterLink>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import AppIcon from '../components/AppIcon.vue';
</script>
