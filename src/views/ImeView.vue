<template>
  <div class="min-h-screen bg-wheat-50">
    <NavBar :show-search-bar="false" />

    <main>
      <section
        class="relative overflow-hidden bg-wheat-50 pb-24 pt-8 md:pb-36 md:pt-12"
      >
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
        <SeeWaveDivider
          color-class="text-white"
          :offset-x="waveOffsets.hero - 180"
        />
      </section>

      <section
        id="platforms"
        ref="platformSection"
        class="platform-reveal-section relative scroll-mt-6 overflow-hidden bg-white pb-32 pt-12 md:scroll-mt-10 md:pb-52 md:pt-16"
      >
        <div class="mx-auto w-[90vw] max-w-6xl space-y-4">
          <h2
            ref="platformTitle"
            class="platform-reveal-title mb-5 flex flex-row text-4xl font-bold text-rosybrown-800"
          >
            选择汝其平台
          </h2>
          <p
            class="platform-reveal-content max-w-3xl text-base leading-8 text-wheat-700"
          >
            榕拼输入法支持 Windows、Mac、Linux 和 Android
            平台。选择你的平台，此刻开始！
          </p>
          <div class="grid gap-4 pt-4 md:grid-cols-2">
            <a
              href="#install-guide"
              @click="handlePlatformSelect('windows', windowsDownloadUrl)"
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
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
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
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
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
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
              class="platform-card platform-reveal-card flex items-center gap-4 rounded-2xl bg-wheat-50 px-5 py-4 text-left text-rosybrown-800 shadow-sm hover:-translate-y-0.5 hover:bg-wheat-100 hover:shadow-md"
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
        </div>
        <SeeWaveDivider
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

const windowsDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-weasel-0.17.4.exe';
const macDownloadUrl =
  'https://github.com/Nang-muoi-sing/rime-hokchew/releases/download/v0.1.0/rime-hokchew-squirrel-1.1.2-unsigned.pkg';
const selectedInstallPlatform = ref<PlatformId>('windows');
const platformSection = ref<HTMLElement | null>(null);
const platformTitle = ref<HTMLElement | null>(null);
const faqSection = ref<HTMLElement | null>(null);
const faqTitle = ref<HTMLElement | null>(null);
const waveOffsets = reactive({
  hero: 0,
  platform: 0,
  guide: 0,
});
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
