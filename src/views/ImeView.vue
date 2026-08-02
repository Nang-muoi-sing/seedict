<template>
  <div class="min-h-screen bg-wheat-50">
    <NavBar :show-search-bar="false" />

    <main>
      <section class="bg-wheat-50 py-8 md:py-12">
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
      </section>

      <section
        id="platforms"
        class="scroll-mt-6 bg-white py-12 md:scroll-mt-10 md:py-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
            选择汝其平台
          </h2>
          <p class="max-w-3xl text-base leading-8 text-wheat-700">
            榕拼输入法支持 Windows、Mac、Linux 和 Android
            平台。选择你的平台，按照安装步骤就能启用。
          </p>
          <div class="grid gap-4 pt-4 md:grid-cols-2">
            <button
              type="button"
              class="flex items-center gap-4 rounded-2xl border border-wheat-200 bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rosybrown-200 hover:bg-white hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600 shadow-sm"
              >
                <i-material-symbols-desktop-windows-rounded />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Windows</span>
                <span class="text-sm text-wheat-700">免费下载</span>
              </span>
            </button>
            <button
              type="button"
              class="flex items-center gap-4 rounded-2xl border border-wheat-200 bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rosybrown-200 hover:bg-white hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600 shadow-sm"
              >
                <i-simple-icons-apple />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">macOS</span>
                <span class="text-sm text-wheat-700">免费下载</span>
              </span>
            </button>
            <button
              type="button"
              class="flex items-center gap-4 rounded-2xl border border-wheat-200 bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rosybrown-200 hover:bg-white hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600 shadow-sm"
              >
                <i-simple-icons-linux />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Linux</span>
                <span class="text-sm text-wheat-700">免费下载</span>
              </span>
            </button>
            <button
              type="button"
              class="flex items-center gap-4 rounded-2xl border border-wheat-200 bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rosybrown-200 hover:bg-white hover:shadow-md"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600 shadow-sm"
              >
                <i-simple-icons-android />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Android</span>
                <span class="text-sm text-wheat-700">免费下载</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section class="bg-wheat-50 py-12 md:py-16">
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
            安装指南
          </h2>
        </div>
      </section>

      <section class="bg-white py-12 md:py-16">
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
            常见问题
          </h2>
          <div class="mx-auto w-full max-w-3xl">
            <AccordionList :items="faqItems" :default-open-index="0" />
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import AccordionList from '../components/common/AccordionList.vue';
import Footer from '../components/common/Footer.vue';
import ImeTypingDemo from '../components/ImeTypingDemo.vue';
import NavBar from '../components/NavBar.vue';
import SeeButton from '../components/seeui/button/SeeButton.vue';

const faqAnswer =
  '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右。引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。';

const faqItems = [
  {
    title: '打出来是繁体字，怎么打出简体字？',
    content: faqAnswer,
  },
  {
    title: '我不知道字的榕拼，怎么知道怎么打？',
    content: faqAnswer,
  },
  {
    title: '怎样切换不同的输入方案？',
    content: faqAnswer,
  },
  {
    title: '遇到了困难？',
    content: faqAnswer,
  },
];
</script>

<style scoped></style>
