<template>
  <div class="min-h-screen bg-wheat-50">
    <NavBar :show-search-bar="false" />

    <main>
      <section
        class="relative overflow-hidden bg-wheat-50 pb-52 pt-8 md:pb-60 md:pt-12 2xl:pb-48"
      >
        <div
          class="pointer-events-none absolute inset-0 z-0 select-none"
          aria-hidden="true"
        >
          <span
            v-for="letter in heroParallaxLetters"
            :key="letter.text"
            class="parallax-letter"
            :class="[
              letter.class,
              letter.hideOnMobile
                ? 'parallax-letter-mobile-hidden'
                : 'parallax-letter-mobile-soft',
            ]"
            :style="getParallaxLetterStyle(letter)"
          >
            {{ letter.text }}
          </span>
        </div>
        <div
          class="relative z-10 mx-auto grid w-[90vw] max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:gap-14"
        >
          <div class="space-y-6">
            <ImeTypingDemo />
            <p class="max-w-2xl text-xl leading-8 text-wheat-600 md:text-4xl">
              福州话拍字，尽去简单，快来试看！
            </p>
            <div class="flex flex-wrap gap-3">
              <SeeButton
                label="免费下载"
                size="lg"
                href="#platforms"
                style="color: white"
              />
              <SeeButton
                label="使用教程"
                variant="secondary"
                size="lg"
                href="https://jcnf40n3hvft.feishu.cn/wiki/IkmfwN6VLiwAYEkxaqDcOe4DnC3"
              />
            </div>
          </div>

          <div
            class="hidden min-h-72 items-center justify-center p-2 lg:flex 2xl:p-4"
          >
            <img
              src="../assets/typing.webp"
              class="max-h-72 w-full max-w-[18rem] select-none object-contain lg:max-h-80 lg:max-w-sm xl:max-h-96 xl:max-w-md"
            />
          </div>
        </div>
        <SeeWaveDivider
          class="z-[1]"
          color-class="text-white"
          :offset-x="waveOffsets.hero - 180"
        />
      </section>

      <section
        id="platforms"
        ref="platformSection"
        class="platform-reveal-section relative z-10 scroll-mt-6 overflow-visible bg-white pb-32 pt-12 md:scroll-mt-10 md:pb-52 md:pt-16"
      >
        <div
          class="pointer-events-none absolute inset-x-0 -top-32 bottom-0 z-[3] select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            v-for="letter in platformParallaxLetters"
            :key="letter.text"
            class="parallax-letter"
            :class="[
              letter.class,
              letter.hideOnMobile
                ? 'parallax-letter-mobile-hidden'
                : 'parallax-letter-mobile-soft',
            ]"
            :style="getParallaxLetterStyle(letter, 128)"
          >
            {{ letter.text }}
          </span>
        </div>
        <div class="relative z-10 mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2
            ref="platformTitle"
            class="platform-reveal-title mb-5 flex flex-row text-4xl font-bold text-rosybrown-800"
          >
            选择汝其平台
          </h2>
          <p
            class="platform-reveal-content max-w-3xl text-base leading-8 text-wheat-700"
          >
            榕拼输入法这盘支持电脑共移动全部平台。选择汝其平台，此刻开始！
          </p>
          <div class="grid gap-4 pt-4 md:grid-cols-2">
            <a
              href="#install-guide"
              @click="handlePlatformSelect('windows', windowsDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ri-windows-fill />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Windows</span>
                <span class="text-sm text-wheat-700">下载安装包</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('linux', linuxDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-simple-icons-linux />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Linux</span>
                <span class="text-sm text-wheat-700">下载安装配方</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('macos', macDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ri-finder-fill />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">macOS</span>
                <span class="text-sm text-wheat-700">下载安装包</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('ios', iosDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ri-apple-fill />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">iOS</span>
                <span class="text-sm text-wheat-700">下载安装配方</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('android', androidDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-simple-icons-android />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">Android</span>
                <span class="text-sm text-wheat-700">下载安装包</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('harmony', harmonyDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
            >
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-rosybrown-600"
              >
                <i-ant-design-harmony-o-s-outlined />
              </span>
              <span class="flex flex-col">
                <span class="text-base font-semibold">HarmonyOS</span>
                <span class="text-sm text-wheat-700">下载安装配方</span>
              </span>
            </a>
          </div>
          <p
            class="platform-reveal-note border-l-4 border-wheat-300 pl-3 text-sm leading-6 text-wheat-600"
          >
            最近更新于 2026.08.31，<Link href="https://tseing.ysepan.com/"
              >备用下载链接</Link
            >（访问密码：seedict）
          </p>
        </div>
        <SeeWaveDivider
          class="z-[4]"
          color-class="text-wheat-50"
          :offset-x="waveOffsets.platform + 260"
        />
      </section>

      <div class="bg-wheat-50">
        <section
          ref="featureShowcase"
          class="feature-showcase scroll-mt-6 pb-8 pt-12 md:scroll-mt-10 md:pb-12 md:pt-20"
        >
          <div
            class="mx-auto w-[90vw] max-w-5xl"
            @mouseenter="stopFeatureSlideshow"
            @mouseleave="startFeatureSlideshow"
          >
            <Transition name="feature-slide" mode="out-in">
              <div
                :key="`${activeFeature.title}-${activeFeatureImageSide}`"
                class="feature-showcase-item"
                :data-direction="activeFeature.direction"
              >
                <div
                  class="mx-auto grid min-h-[25rem] w-full max-w-4xl items-center gap-5 md:min-h-[20rem] md:grid-cols-2 md:gap-8"
                  :class="{
                    'md:[&>.feature-copy]:order-1 md:[&>.feature-shot]:order-2':
                      activeFeatureImageSide === 'right',
                    'md:-translate-x-8 lg:-translate-x-10':
                      activeFeatureImageSide === 'left',
                    'md:translate-x-8 lg:translate-x-10':
                      activeFeatureImageSide === 'right',
                  }"
                >
                  <div
                    class="feature-shot flex w-full max-w-xs items-center justify-center justify-self-center md:max-w-sm"
                  >
                    <img
                      :src="activeFeature.image"
                      :alt="activeFeature.title"
                      class="max-h-[15rem] w-full rounded-lg object-contain md:max-h-[18rem]"
                      draggable="false"
                    />
                  </div>
                  <div
                    class="feature-copy max-w-md space-y-3 justify-self-center"
                  >
                    <h3
                      class="text-2xl font-bold text-rosybrown-800 md:text-3xl"
                    >
                      {{ activeFeature.title }}
                    </h3>
                    <p class="max-w-xl text-base leading-8 text-wheat-700">
                      {{ activeFeature.description }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>

            <div class="mt-6 flex items-center justify-center">
              <div class="flex items-center gap-2">
                <button
                  v-for="(feature, index) in featureItems"
                  :key="feature.title"
                  type="button"
                  class="feature-dot"
                  :class="{
                    'feature-dot-active': index === activeFeatureIndex,
                  }"
                  :aria-label="`显示${feature.title}`"
                  :aria-current="index === activeFeatureIndex"
                  @click="selectFeature(index)"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="install-guide"
          class="relative scroll-mt-6 overflow-hidden bg-wheat-50 pb-32 pt-12 md:scroll-mt-10 md:pb-60 md:pt-16"
        >
          <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
            <h2
              class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800"
            >
              安装指南
            </h2>
            <ImeInstallSection :selected-platform="selectedInstallPlatform" />
            <p
              class="mt-4 border-l-4 border-wheat-300 pl-3 text-sm leading-6 text-wheat-600"
            >
              安装成功后可以查看<Link
                href="https://jcnf40n3hvft.feishu.cn/wiki/IkmfwN6VLiwAYEkxaqDcOe4DnC3"
                >使用教程</Link
              >详细了解榕拼输入法的具体功能与使用方法
            </p>
          </div>
          <SeeWaveDivider
            color-class="text-white"
            :offset-x="waveOffsets.guide - 340"
          />
        </section>
      </div>

      <section
        ref="faqSection"
        class="faq-reveal-section bg-white pb-12 pt-12 md:pb-16 md:pt-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2
            ref="faqTitle"
            class="faq-reveal-title mb-10 flex flex-row justify-center text-center text-4xl font-bold text-rosybrown-800"
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
import { animate, stagger } from 'animejs';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Footer from '../components/common/Footer.vue';
import ImeFaq from '../components/ImeFaq.vue';
import ImeInstallSection from '../components/ImeInstallSection.vue';
import ImeTypingDemo from '../components/ImeTypingDemo.vue';
import imeFuzzyTypingImg from '../assets/ime/ime-fuzzy-typing.webp';
import imeT2SImg from '../assets/ime/ime-t2s.webp';
import imeLookupImg from '../assets/ime/ime-lookup.webp';
import NavBar from '../components/NavBar.vue';
import SeeButton from '../components/seeui/button/SeeButton.vue';
import SeeWaveDivider from '../components/seeui/decor/SeeWaveDivider.vue';

type PlatformId = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'harmony';
interface ParallaxLetter {
  text: string;
  left: string;
  top: string;
  size: string;
  opacity: number;
  rotate: number;
  speed: number;
  class?: string;
  hideOnMobile?: boolean;
}
interface FeatureItem {
  title: string;
  description: string;
  image: string;
  direction: 'left' | 'right';
  imageSide: 'left' | 'right';
}

const windowsDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/rime-hokchew-weasel-0.17.4.exe';
const linuxDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/rime-hokchew.zip';
const macDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/rime-hokchew-squirrel-1.1.2-unsigned.pkg';
const iosDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/rime-hokchew.zip';
const androidDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/rime-hokchew-trime-3.3.11-arm64-v8a.apk';
const harmonyDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.4.0/bim-hokchew.zip';
const selectedInstallPlatform = ref<PlatformId>('windows');
const platformSection = ref<HTMLElement | null>(null);
const platformTitle = ref<HTMLElement | null>(null);
const featureShowcase = ref<HTMLElement | null>(null);
const activeFeatureIndex = ref(0);
const activeFeatureImageSide = ref<FeatureItem['imageSide']>('left');
const faqSection = ref<HTMLElement | null>(null);
const faqTitle = ref<HTMLElement | null>(null);
const parallaxScrollY = ref(0);
const waveOffsets = reactive({
  hero: 0,
  platform: 0,
  guide: 0,
});
const featureItems: FeatureItem[] = [
  {
    title: '兼容简繁汉字输出',
    description: '支持切换简体与繁体汉字输出，按使用习惯选用所需字形',
    image: imeT2SImg,
    direction: 'left',
    imageSide: 'left',
  },
  {
    title: '榕拼模糊音打字',
    description: '支持榕拼模糊音输入，即使不熟悉声韵母也能轻松上手',
    image: imeFuzzyTypingImg,
    direction: 'right',
    imageSide: 'right',
  },
  {
    title: '普通话拼音反查',
    description:
      '遇到陌生字词，直接使用普通话拼音反查对应榕拼，在打字过程中也能学习与巩固生字读音',
    image: imeLookupImg,
    direction: 'left',
    imageSide: 'left',
  },
];
const activeFeature = computed(() => featureItems[activeFeatureIndex.value]);
const heroParallaxLetters: ParallaxLetter[] = [
  {
    text: '春',
    left: '7%',
    top: '18%',
    size: '6.5rem',
    opacity: 0.14,
    rotate: -12,
    speed: -0.06,
    class: 'text-rosybrown-300',
  },
  {
    text: '花',
    left: '47%',
    top: '8%',
    size: '4.5rem',
    opacity: 0.1,
    rotate: 14,
    speed: -0.1,
    class: 'hidden text-wheat-600 md:block',
    hideOnMobile: true,
  },
  {
    text: '香',
    left: '78%',
    top: '22%',
    size: '7rem',
    opacity: 0.12,
    rotate: 9,
    speed: -0.16,
    class: 'hidden text-rosybrown-300 2xl:block',
  },
  {
    text: '秋',
    left: '17%',
    top: '68%',
    size: '4rem',
    opacity: 0.12,
    rotate: 10,
    speed: 0.08,
    class: 'text-wheat-700',
  },
  {
    text: '山',
    left: '67%',
    top: '72%',
    size: '5.5rem',
    opacity: 0.1,
    rotate: -18,
    speed: 0.13,
    class: 'hidden text-rosybrown-400 md:block',
  },
  {
    text: '開',
    left: '31%',
    top: '34%',
    size: '3rem',
    opacity: 0.08,
    rotate: -7,
    speed: -0.12,
    class: 'hidden text-wheat-700 sm:block',
    hideOnMobile: true,
  },
  {
    text: '嘉',
    left: '88%',
    top: '48%',
    size: '3.75rem',
    opacity: 0.09,
    rotate: 18,
    speed: 0.09,
    class: 'hidden text-wheat-600 sm:block',
  },
  {
    text: '賓',
    left: '5%',
    top: '83%',
    size: '3.25rem',
    opacity: 0.08,
    rotate: 22,
    speed: 0.15,
    class: 'hidden text-rosybrown-300 md:block',
    hideOnMobile: true,
  },
  {
    text: '歡',
    left: '55%',
    top: '54%',
    size: '3.5rem',
    opacity: 0.07,
    rotate: -20,
    speed: 0.06,
    class: 'hidden text-wheat-700 lg:block',
    hideOnMobile: true,
  },
  {
    text: '歌',
    left: '93%',
    top: '9%',
    size: '3rem',
    opacity: 0.08,
    rotate: -10,
    speed: -0.18,
    class: 'hidden text-rosybrown-300 xl:block',
    hideOnMobile: true,
  },
];
const platformParallaxLetters: ParallaxLetter[] = [
  {
    text: '須',
    left: '9%',
    top: '18%',
    size: '5.25rem',
    opacity: 0.09,
    rotate: 16,
    speed: -0.08,
    class: 'text-wheat-700',
  },
  {
    text: '金',
    left: '38%',
    top: '70%',
    size: '4rem',
    opacity: 0.08,
    rotate: -10,
    speed: 0.1,
    class: 'hidden text-rosybrown-300 md:block',
  },
  {
    text: '盃',
    left: '72%',
    top: '12%',
    size: '6.25rem',
    opacity: 0.1,
    rotate: -16,
    speed: -0.13,
    class: 'text-wheat-600',
  },
  {
    text: '之',
    left: '84%',
    top: '64%',
    size: '4.5rem',
    opacity: 0.08,
    rotate: 13,
    speed: 0.12,
    class: 'hidden text-rosybrown-400 sm:block',
  },
  {
    text: '東',
    left: '19%',
    top: '47%',
    size: '3.25rem',
    opacity: 0.08,
    rotate: -19,
    speed: 0.11,
    class: 'hidden text-rosybrown-300 sm:block',
  },
  {
    text: '郊',
    left: '55%',
    top: '24%',
    size: '3.5rem',
    opacity: 0.08,
    rotate: 11,
    speed: -0.1,
    class: 'hidden text-wheat-600 md:block',
  },
  {
    text: '過',
    left: '92%',
    top: '34%',
    size: '3.1rem',
    opacity: 0.07,
    rotate: -6,
    speed: -0.16,
    class: 'hidden text-rosybrown-300 lg:block',
  },
  {
    text: '西',
    left: '6%',
    top: '74%',
    size: '4.25rem',
    opacity: 0.08,
    rotate: 14,
    speed: 0.14,
    class: 'hidden text-wheat-700 sm:block',
  },
  {
    text: '橋',
    left: '63%',
    top: '86%',
    size: '3rem',
    opacity: 0.07,
    rotate: -14,
    speed: 0.09,
    class: 'hidden text-rosybrown-400 md:block',
  },
  {
    text: '鶯',
    left: '31%',
    top: '9%',
    size: '2.8rem',
    opacity: 0.08,
    rotate: 21,
    speed: -0.14,
    class: 'hidden text-wheat-600 xl:block',
  },
];
let scrollRafId: number | null = null;
let platformRevealObserver: IntersectionObserver | null = null;
let featureRevealObserver: IntersectionObserver | null = null;
let featureSlideshowIntervalId: number | null = null;
let isFeatureSlideshowPaused = false;
let isFaqRevealed = false;

const hasSectionTopReachedViewportRatio = (
  element: HTMLElement,
  viewportRatio: number
) => {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight * viewportRatio;
};

const updateWaveOffsets = () => {
  scrollRafId = null;

  const y = window.scrollY;
  parallaxScrollY.value = y;
  waveOffsets.hero = y * 0.8;
  waveOffsets.platform = -y * 0.95;
  waveOffsets.guide = y * 0.88;

  if (
    !isFaqRevealed &&
    faqSection.value &&
    hasSectionTopReachedViewportRatio(faqSection.value, 0.5)
  ) {
    revealFaqSection();
    isFaqRevealed = true;
  }
};

const getParallaxLetterStyle = (letter: ParallaxLetter, topOffset = 0) => ({
  left: letter.left,
  top: `calc(${letter.top} + ${topOffset}px)`,
  '--letter-size': letter.size,
  '--letter-base-opacity': String(letter.opacity),
  '--letter-opacity': String(letter.opacity),
  transform: `translate3d(0, ${parallaxScrollY.value * letter.speed}px, 0) rotate(${letter.rotate}deg)`,
});

const handleScroll = () => {
  if (scrollRafId !== null) {
    return;
  }

  scrollRafId = window.requestAnimationFrame(updateWaveOffsets);
};

const stopFeatureSlideshow = () => {
  isFeatureSlideshowPaused = true;

  if (featureSlideshowIntervalId === null) {
    return;
  }

  window.clearInterval(featureSlideshowIntervalId);
  featureSlideshowIntervalId = null;
};

const startFeatureSlideshow = () => {
  isFeatureSlideshowPaused = false;

  if (featureSlideshowIntervalId !== null || featureItems.length <= 1) {
    return;
  }

  featureSlideshowIntervalId = window.setInterval(() => {
    activeFeatureIndex.value =
      (activeFeatureIndex.value + 1) % featureItems.length;
    toggleFeatureImageSide();
  }, 15000);
};

const restartFeatureSlideshow = () => {
  if (isFeatureSlideshowPaused) {
    return;
  }

  if (featureSlideshowIntervalId !== null) {
    window.clearInterval(featureSlideshowIntervalId);
    featureSlideshowIntervalId = null;
  }

  startFeatureSlideshow();
};

const selectFeature = (index: number) => {
  if (index === activeFeatureIndex.value) {
    return;
  }

  activeFeatureIndex.value = index;
  toggleFeatureImageSide();
  restartFeatureSlideshow();
};

const toggleFeatureImageSide = () => {
  activeFeatureImageSide.value =
    activeFeatureImageSide.value === 'left' ? 'right' : 'left';
};

const revealPlatformSection = () => {
  if (!platformTitle.value || !platformSection.value) {
    return;
  }

  const contentElements = platformSection.value.querySelectorAll<HTMLElement>(
    '.platform-reveal-content'
  );
  const cardElements = platformSection.value.querySelectorAll<HTMLElement>(
    '.platform-reveal-card'
  );
  const noteElements = platformSection.value.querySelectorAll<HTMLElement>(
    '.platform-reveal-note'
  );
  const clearRevealStyles = () => {
    platformSection.value?.classList.add('platform-revealed');
    platformTitle.value?.style.removeProperty('opacity');
    platformTitle.value?.style.removeProperty('transform');
    contentElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
    cardElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
    noteElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
  };

  animate(platformTitle.value, {
    opacity: [0, 1],
    translateY: [-72, 0],
    duration: 760,
    easing: 'easeOutCubic',
  });

  animate(contentElements, {
    opacity: [0, 1],
    translateY: [72, 0],
    duration: 680,
    delay: stagger(90, { start: 120 }),
    easing: 'easeOutCubic',
  });

  animate(cardElements, {
    opacity: [0, 1],
    translateY: [128, 0],
    duration: 620,
    delay: stagger(70, { start: 190 }),
    easing: 'easeOutCubic',
  });

  animate(noteElements, {
    opacity: [0, 1],
    translateY: [56, 0],
    duration: 560,
    delay: 520,
    easing: 'easeOutCubic',
    onComplete: clearRevealStyles,
  });
};

const revealFeatureShowcase = () => {
  if (!featureShowcase.value) {
    return;
  }

  const featureElements = featureShowcase.value.querySelectorAll<HTMLElement>(
    '.feature-showcase-item'
  );
  const clearRevealStyles = () => {
    featureShowcase.value?.classList.add('feature-showcase-revealed');
    featureElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
  };

  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
  featureElements.forEach((element, index) => {
    const fromX = isSmallScreen
      ? 0
      : element.dataset.direction === 'right'
        ? 112
        : -112;

    animate(element, {
      opacity: [0, 1],
      translateX: [fromX, 0],
      translateY: [isSmallScreen ? 64 : 0, 0],
      duration: 720,
      delay: index * 120,
      easing: 'easeOutCubic',
      onComplete:
        index === featureElements.length - 1 ? clearRevealStyles : undefined,
    });
  });
};

const revealFaqSection = () => {
  if (!faqTitle.value || !faqSection.value) {
    return;
  }

  const itemElements =
    faqSection.value.querySelectorAll<HTMLElement>('.faq-reveal-item');
  const clearRevealStyles = () => {
    faqSection.value?.classList.add('faq-revealed');
    faqTitle.value?.style.removeProperty('opacity');
    faqTitle.value?.style.removeProperty('transform');
    itemElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
  };

  animate(faqTitle.value, {
    opacity: [0, 1],
    translateY: [-72, 0],
    duration: 760,
    easing: 'easeOutCubic',
  });

  animate(itemElements, {
    opacity: [0, 1],
    translateY: [104, 0],
    duration: 620,
    delay: stagger(70, { start: 160 }),
    easing: 'easeOutCubic',
    onComplete: clearRevealStyles,
  });
};

onMounted(() => {
  updateWaveOffsets();
  startFeatureSlideshow();
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (!('IntersectionObserver' in window)) {
    revealPlatformSection();
    revealFeatureShowcase();
    return;
  }

  if (platformSection.value) {
    platformRevealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        revealPlatformSection();
        platformRevealObserver?.disconnect();
        platformRevealObserver = null;
      },
      {
        threshold: 0.5,
      }
    );
    platformRevealObserver.observe(platformSection.value);
  }

  if (featureShowcase.value) {
    featureRevealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        revealFeatureShowcase();
        featureRevealObserver?.disconnect();
        featureRevealObserver = null;
      },
      {
        threshold: 0.18,
      }
    );
    featureRevealObserver.observe(featureShowcase.value);
  }
});

onBeforeUnmount(() => {
  if (scrollRafId !== null) {
    window.cancelAnimationFrame(scrollRafId);
  }

  window.removeEventListener('scroll', handleScroll);
  platformRevealObserver?.disconnect();
  featureRevealObserver?.disconnect();
  if (featureSlideshowIntervalId !== null) {
    window.clearInterval(featureSlideshowIntervalId);
  }
});

const handlePlatformSelect = (platform: PlatformId, downloadUrl?: string) => {
  selectedInstallPlatform.value = platform;

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

<style scoped>
.parallax-letter {
  position: absolute;
  display: block;
  font-size: var(--letter-size);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  opacity: var(--letter-opacity);
  text-transform: uppercase;
  transform-origin: center;
  will-change: transform;
}

@media (max-width: 639px) {
  .parallax-letter-mobile-hidden {
    display: none;
  }

  .parallax-letter-mobile-soft {
    --letter-opacity: calc(var(--letter-base-opacity) * 0.6);
    font-size: calc(var(--letter-size) * 0.75);
  }
}

.platform-reveal-section:not(.platform-revealed) .platform-reveal-title {
  opacity: 0;
  transform: translateY(-72px);
}

.platform-reveal-section:not(.platform-revealed) .platform-reveal-content {
  opacity: 0;
  transform: translateY(72px);
}

.platform-reveal-section:not(.platform-revealed) .platform-reveal-card {
  opacity: 0;
  transform: translateY(128px);
}

.platform-reveal-section:not(.platform-revealed) .platform-reveal-note {
  opacity: 0;
  transform: translateY(56px);
}

.feature-showcase:not(.feature-showcase-revealed) .feature-showcase-item {
  opacity: 0;
}

.feature-slide-enter-active,
.feature-slide-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.feature-slide-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.feature-slide-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.feature-dot:focus-visible {
  outline: 2px solid theme('colors.rosybrown.500');
  outline-offset: 3px;
}

.feature-dot {
  height: 0.625rem;
  width: 0.625rem;
  border-radius: 9999px;
  background: theme('colors.wheat.300');
  transition:
    background-color 160ms ease,
    transform 160ms ease,
    width 160ms ease;
}

.feature-dot-active {
  width: 1.75rem;
  background: theme('colors.rosybrown.600');
}

.platform-card {
  transition:
    background-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.platform-reveal-section:not(.platform-revealed) .platform-card {
  transition: none;
}

.faq-reveal-section:not(.faq-revealed) .faq-reveal-title {
  opacity: 0;
  transform: translateY(-72px);
}

.faq-reveal-section:not(.faq-revealed) :deep(.faq-reveal-item) {
  opacity: 0;
  transform: translateY(104px);
}
</style>
