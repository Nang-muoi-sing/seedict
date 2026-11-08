<template>
  <div class="bg-wheat-50">
    <div class="bg-rosybrown-800 h-56 text-center">
      <div class="flex flex-col pt-20">
        <span class="text-sans text-rosybrown-50 mb-2"
          >© 2025 - 2026 米时典 SeeDict
        </span>
        <div v-if="showBeian" class="text-rosybrown-400 text-sm mx-auto gap-x-5 gap-y-0.5 flex flex-col md:flex-row">
          <a href="https://beian.miit.gov.cn" target="_blank"
            >闽 ICP 备 2025111999 号 - 1</a
          >
          <a href="https://beian.mps.gov.cn/#/query/webSearch" target="_blank"
            >闽公网安备 35010202001966 号</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const showBeian = import.meta.env.VITE_ENV_NAME !== 'github-ci';
</script>
