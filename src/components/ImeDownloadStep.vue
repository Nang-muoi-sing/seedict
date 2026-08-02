<template>
  <SeeImage :src="githubOverviewImg" class="my-3 max-w-4xl" />
  进入<Link href="https://github.com/Nang-muoi-sing/rime-hokchew/tree/release"
    >配方仓库</Link
  >，可以通过
  <SeeKeycap label="Code" />
  >
  <SeeKeycap label="Download ZIP" />
  下载压缩包，其中包含 3 种输入方案：
  <ul class="list-disc pl-5">
    <li>
      <SeeCode code="hokchew" />
      ：福州话汉字输入方案，输入榕拼打出福州话汉字。
    </li>
    <li>
      <SeeCode code="hokchew_roma" />
      ：福州话教会罗马字输入方案，输入教会罗马字转写打出教会罗马字。
    </li>
    <li>
      <SeeCode code="hokchew_yngping" />
      ：榕拼手写方案输入方案，输入榕拼打开榕拼手写形式。
    </li>
  </ul>
</template>

<script setup lang="ts">
import Link from './common/Link.vue';
import SeeKeycap from './seeui/keycap/SeeKeycap.vue';
import SeeImage from './seeui/media/SeeImage.vue';
import SeeCode from './seeui/code/SeeCode.vue';
import githubOverviewImg from '../assets/ime/github-overview.png';
</script>

<style scoped>
ul > li::marker {
  color: #c96f4a;
}
</style>
