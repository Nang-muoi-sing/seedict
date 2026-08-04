<template>
  <div class="min-h-screen bg-wheat-50">
    <NavBar :show-search-bar="false" />

    <main>
      <section class="relative overflow-hidden bg-wheat-50 pb-24 pt-8 md:pb-28 md:pt-12">
        <div
          class="mx-auto grid w-[90vw] max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_24rem] md:items-center lg:gap-14"
        >
          <div class="space-y-6">
            <ImeTypingDemo />
            <p class="max-w-2xl text-base leading-8 text-wheat-700 md:text-lg">
              这里先放占位文案。后续可以替换成输入法简介、特色说明，或者输入法宣传语的副标题内容。
            </p>
            <div class="flex flex-wrap gap-3">
              <SeeButton label="免费下载" size="lg" href="#platforms" />
              <SeeButton label="学习榕拼" variant="secondary" size="lg" />
            </div>
          </div>

          <div class="flex min-h-72 items-center justify-center p-2 md:p-4">
            <img
              src="../assets/typing.gif"
              class="max-h-72 w-full max-w-xs object-contain md:max-h-80 md:max-w-sm"
            />
          </div>
        </div>
        <SeeWaveDivider color-class="text-white" variant="crest" />
      </section>

      <section
        id="platforms"
        class="relative overflow-hidden scroll-mt-6 bg-white pb-24 pt-12 md:scroll-mt-10 md:pb-28 md:pt-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
            选择汝其平台
          </h2>
          <p class="max-w-3xl text-base leading-8 text-wheat-700">
            榕拼输入法支持 Windows、Mac、Linux 和 Android
            平台。选择你的平台，此刻开始！
          </p>
          <div class="grid gap-4 pt-4 md:grid-cols-2">
            <button
              type="button"
              @click="handlePlatformSelect('windows', windowsDownloadUrl)"
              class="flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ri-windows-fill />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Windows</span>
                <span class="text-sm text-wheat-700">下载</span>
              </span>
            </button>
            <button
              type="button"
              @click="handlePlatformSelect('macos', macDownloadUrl)"
              class="flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ri-finder-fill />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">macOS</span>
                <span class="text-sm text-wheat-700">下载</span>
              </span>
            </button>
            <button
              type="button"
              @click="handlePlatformSelect('linux')"
              class="flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-simple-icons-linux />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Linux</span>
                <span class="text-sm text-wheat-700">查看安装</span>
              </span>
            </button>
            <button
              type="button"
              @click="handlePlatformSelect('android')"
              class="flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-simple-icons-android />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Android</span>
                <span class="text-sm text-wheat-700">查看安装</span>
              </span>
            </button>
          </div>
        </div>
        <SeeWaveDivider color-class="text-wheat-50" variant="drift" />
      </section>

      <section
        id="install-guide"
        class="relative overflow-hidden scroll-mt-6 bg-wheat-50 pb-24 pt-12 md:scroll-mt-10 md:pb-28 md:pt-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
            安装指南
          </h2>
          <ImeInstallSection :selected-platform="selectedInstallPlatform" />
        </div>
        <SeeWaveDivider color-class="text-white" variant="swell" />
      </section>

      <section class="bg-white pb-12 pt-12 md:pb-16 md:pt-16">
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2
            class="mb-10 flex flex-row justify-center text-center text-4xl font-bold text-rosybrown-800"
          >
            常见问题
          </h2>
          <ImeFaq />
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import Footer from '../components/common/Footer.vue';
import ImeFaq from '../components/ImeFaq.vue';
import ImeInstallSection from '../components/ImeInstallSection.vue';
import ImeTypingDemo from '../components/ImeTypingDemo.vue';
import NavBar from '../components/NavBar.vue';
import SeeButton from '../components/seeui/button/SeeButton.vue';
import SeeWaveDivider from '../components/seeui/decor/SeeWaveDivider.vue';

type PlatformId = 'windows' | 'macos' | 'linux' | 'android';

const windowsDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-weasel-0.17.4.exe';
const macDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-squirrel-1.1.2-unsigned.pkg';
const selectedInstallPlatform = ref<PlatformId>('windows');

const scrollToInstallGuide = async () => {
  await nextTick();
  document
    .getElementById('install-guide')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handlePlatformSelect = async (
  platform: PlatformId,
  downloadUrl?: string
) => {
  selectedInstallPlatform.value = platform;

  await scrollToInstallGuide();

  if (downloadUrl) {
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.rel = 'noopener noreferrer';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }
};
</script>

<style scoped></style>
