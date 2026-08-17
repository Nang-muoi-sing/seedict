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
          class="relative z-10 mx-auto grid w-[90vw] max-w-6xl gap-10 2xl:grid-cols-[minmax(0,1fr)_24rem] 2xl:items-center 2xl:gap-14"
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
                label="学习榕拼"
                variant="secondary"
                size="lg"
                :to="{ name: 'tutorial' }"
              />
            </div>
          </div>

          <div
            class="hidden min-h-72 items-center justify-center p-2 2xl:flex 2xl:p-4"
          >
            <img
              src="../assets/typing.webp"
              class="max-h-80 w-full max-w-sm select-none object-contain md:max-h-96 md:max-w-md"
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
            榕拼输入法这久支持 Windows、Mac、Linux 共 Android
            平台。选择汝其平台，此刻开始！
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
                <span class="text-sm text-wheat-700">开始下载</span>
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
                <span class="text-sm text-wheat-700">开始下载</span>
              </span>
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('linux')"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
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
            </a>
            <a
              href="#install-guide"
              @click="handlePlatformSelect('android')"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 hover:-translate-y-0.5 hover:bg-wheat-100"
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
            </a>
          </div>
          <p
            class="platform-reveal-note border-l-4 border-wheat-300 pl-3 text-sm leading-6 text-wheat-600"
          >
            最近更新于 2026.08.15，<Link href="">备用下载链接</Link>
          </p>
        </div>
        <SeeWaveDivider
          class="z-[4]"
          color-class="text-wheat-50"
          :offset-x="waveOffsets.platform + 260"
        />
      </section>

      <section
        id="install-guide"
        class="relative scroll-mt-6 overflow-hidden bg-wheat-50 pb-32 pt-12 md:scroll-mt-10 md:pb-60 md:pt-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2 class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
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
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Footer from '../components/common/Footer.vue';
import ImeFaq from '../components/ImeFaq.vue';
import ImeInstallSection from '../components/ImeInstallSection.vue';
import ImeTypingDemo from '../components/ImeTypingDemo.vue';
import NavBar from '../components/NavBar.vue';
import SeeButton from '../components/seeui/button/SeeButton.vue';
import SeeWaveDivider from '../components/seeui/decor/SeeWaveDivider.vue';

type PlatformId = 'windows' | 'macos' | 'linux' | 'android';
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

const windowsDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-weasel-0.17.4.exe';
const macDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-squirrel-1.1.2-unsigned.pkg';
const selectedInstallPlatform = ref<PlatformId>('windows');
const platformSection = ref<HTMLElement | null>(null);
const platformTitle = ref<HTMLElement | null>(null);
const faqSection = ref<HTMLElement | null>(null);
const faqTitle = ref<HTMLElement | null>(null);
const parallaxScrollY = ref(0);
const waveOffsets = reactive({
  hero: 0,
  platform: 0,
  guide: 0,
});
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
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (!('IntersectionObserver' in window)) {
    revealPlatformSection();
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
});

onBeforeUnmount(() => {
  if (scrollRafId !== null) {
    window.cancelAnimationFrame(scrollRafId);
  }

  window.removeEventListener('scroll', handleScroll);
  platformRevealObserver?.disconnect();
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
