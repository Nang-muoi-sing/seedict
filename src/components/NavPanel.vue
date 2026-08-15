<template>
  <div class="flex h-full flex-row justify-between rounded-lg bg-white">
    <div
      class="rounded-xs m-1 shrink-0 content-center whitespace-nowrap px-3 py-1.5 font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-50 hover:text-rosybrown-800"
    >
      <RouterLink :to="{ name: 'home' }">主页</RouterLink>
    </div>
    <div
      class="rounded-xs m-1 shrink-0 content-center whitespace-nowrap px-3 py-1.5 font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-50 hover:text-rosybrown-800"
    >
      <RouterLink :to="{ name: 'tutorial' }">入门</RouterLink>
    </div>
    <div
      class="rounded-xs m-1 shrink-0 content-center whitespace-nowrap px-3 py-1.5 font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-50 hover:text-rosybrown-800"
    >
      <a
        href="https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc"
        target="_blank"
        >帮助</a
      >
    </div>
    <div
      class="rounded-xs group relative m-1 shrink-0 content-center whitespace-nowrap px-3 py-1.5 font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-50 hover:text-rosybrown-800"
    >
      <span class="inline-flex cursor-pointer items-center whitespace-nowrap">
        工具
      </span>
      <div
        class="invisible absolute left-0 top-full z-50 min-w-28 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        <div class="rounded-md border border-wheat-100 bg-white text-sm">
          <RouterLink
            :to="{ name: 'tool' }"
            class="m-1 block whitespace-nowrap px-4 py-2 text-rosybrown-600 transition-colors hover:bg-wheat-50 hover:text-rosybrown-800"
          >
            小工具
          </RouterLink>
          <RouterLink
            :to="{ name: 'ime' }"
            class="m-1 block whitespace-nowrap px-4 py-2 text-rosybrown-600 transition-colors hover:bg-wheat-50 hover:text-rosybrown-800"
          >
            输入法
          </RouterLink>
        </div>
      </div>
    </div>
    <div
      class="rounded-xs m-1 shrink-0 content-center whitespace-nowrap px-3 py-1.5 font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-50 hover:text-rosybrown-800"
    >
      <RouterLink :to="{ name: 'about' }">关于</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
