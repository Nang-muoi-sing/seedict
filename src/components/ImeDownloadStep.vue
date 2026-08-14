<template>
  <div class="space-y-3">
    <SeeImage :src="githubOverviewImg" class="max-w-4xl mx-auto" />
    <div>
      点击
      <Link href="https://github.com/Nang-muoi-sing/rime-hokchew/tree/release"
        >GitHub 链接</Link
      >
      进入配方仓库，可以通过
      <SeeKeycap label="Code" />
      >
      <SeeKeycap label="Download ZIP" />
      下载压缩包，其中包含 3 种输入方案：
      <ul class="pl-5 list-disc">
        <li>
          <SeeCode code="hokchew" />
          ：输入榕拼键入方案，打出福州话文字
        </li>
        <li>
          <SeeCode code="hokchew_roma" />
          ：输入教会罗马字转写，打出教会罗马字
        </li>
        <li>
          <SeeCode code="hokchew_yngping" />
          ：输入榕拼键入方案，打出榕拼手写方案
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import githubOverviewImg from '../assets/ime/github-overview.png';
import Link from './common/Link.vue';
import SeeKeycap from './seeui/keycap/SeeKeycap.vue';
import SeeCode from './seeui/code/SeeCode.vue';
import SeeImage from './seeui/media/SeeImage.vue';
</script>

<style scoped>
ul > li::marker {
  color: #c96f4a;
}
</style>
