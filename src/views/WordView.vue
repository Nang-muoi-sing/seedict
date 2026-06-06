<template>
  <SideBar
    v-show="!loading"
    class="left-[2%] top-[170px] hidden xl:block 2xl:left-24"
  ></SideBar>
  <PageContent>
    <!-- {{ wordResponse }} -->
    <WordSkeleton v-if="loading"></WordSkeleton>
    <template v-else>
      <WordHead
        :text="wordResponse.data.result.seedict.text"
        :yngping="wordResponse.data.result.seedict.pronPrimary"
        :voiceUrl="
          audioResponse.data.results[0]
            ? `${ossUrl}/audio/${audioResponse.data.results[0].speaker}/${audioResponse.data.results[0].md5}.mp3`
            : ''
        "
      ></WordHead>

      <!-- TODO: 暂时隐藏只有词性没义项的释义部分 -->
      <template
        v-if="
          (wordResponse.data.result.seedict.expls.length > 0 &&
            wordResponse.data.result.seedict.expls[0].expl) ||
          wordResponse.data.result.seedict.commentExpl
        "
      >
        <Subtitle text="本站释义"></Subtitle>
        <div class="mb-5 mt-2 rounded-lg bg-white px-8 py-6 text-rosybrown-800">
          <Explanations
            :data="wordResponse.data.result.seedict.expls"
          ></Explanations>
          <p v-if="wordResponse.data.result.seedict.commentExpl">
            <SeeSymbol class="text-rosybrown-700">注釋</SeeSymbol
            >{{ correctText(wordResponse.data.result.seedict.commentExpl) }}
          </p>
          <template
            v-if="
              wordResponse.data.result.seedict.synonym ||
              wordResponse.data.result.seedict.antonym
            "
          >
            <hr class="my-2 border-t-2 border-rosybrown-100" />
            <div class="space-y-1">
              <p v-if="wordResponse.data.result.seedict.synonym">
                <SeeSymbol class="text-rosybrown-700">近義詞</SeeSymbol
                >{{ wordResponse.data.result.seedict.synonym }}
              </p>
              <p v-if="wordResponse.data.result.seedict.antonym">
                <SeeSymbol class="text-rosybrown-700">反義詞</SeeSymbol
                >{{ wordResponse.data.result.seedict.antonym }}
              </p>
            </div>
          </template>
        </div>
      </template>

      <template
        v-if="
          wordResponse.data.result.fengs.length > 0 ||
          wordResponse.data.result.ciklings.length > 0
        "
      >
        <Subtitle text="辞书释义"></Subtitle>
        <WordFengBlock
          v-if="wordResponse.data.result.fengs.length > 0"
          v-for="(feng, index) in wordResponse.data.result.fengs"
          :data="feng"
          :key="index"
        ></WordFengBlock>

        <WordCikLingCard
          :data="wordResponse.data.result.ciklings"
          :isCommentedCikLing="isCommentedCikLing"
        ></WordCikLingCard>
      </template>

      <template
        v-if="
          wordResponse.data.result.seedict.prons.length > 0 ||
          wordResponse.data.result.seedict.commentPron
        "
      >
        <Subtitle text="各地方音"></Subtitle>
        <div
          class="mb-5 mt-2 overflow-hidden rounded-lg bg-white text-rosybrown-800"
        >
          <table
            v-if="wordResponse.data.result.seedict.prons.length > 0"
            class="w-full border-collapse"
          >
            <thead class="bg-rosybrown-300 text-center">
              <tr>
                <th class="py-1 text-white">读音</th>
                <th class="py-1 text-white">连读</th>
                <th class="py-1 text-white">地区</th>
                <!-- <th class="hidden py-1 text-white md:block">来源</th> -->
              </tr>
            </thead>
            <tbody class="text-center">
              <tr
                v-for="(pron, index) in wordResponse.data.result.seedict.prons"
                :key="index"
              >
                <td class="py-1.5">{{ yngpingToIPA(pron.pron) }}</td>
                <td class="flex items-center justify-center py-2 md:hidden">
                  <Badge v-if="pron.isSandhi">连</Badge>
                  <Badge v-else>本</Badge>
                </td>
                <td class="hidden items-center justify-center py-2 md:flex">
                  <Badge v-if="pron.isSandhi">连读音</Badge>
                  <Badge v-else>本字音</Badge>
                </td>
                <td class="py-1.5">
                  {{ pron.location == '' ? '市区' : pron.location }}
                </td>
                <!-- <td class="hidden py-1.5 md:block">
                  {{ sourceQuoteMap[pron.source] }}
                </td> -->
              </tr>
            </tbody>
          </table>
          <hr
            v-if="
              wordResponse.data.result.seedict.prons.length > 0 &&
              wordResponse.data.result.seedict.commentPron
            "
            class="border-t-2 border-rosybrown-100"
          />
          <div
            class="px-8"
            :class="{
              'pb-4 pt-2': wordResponse.data.result.seedict.prons.length > 0,
              'py-6': wordResponse.data.result.seedict.prons.length <= 0,
            }"
            v-if="wordResponse.data.result.seedict.commentPron"
          >
            <p>
              <SeeSymbol class="text-rosybrown-700">注釋 </SeeSymbol
              >{{ correctText(wordResponse.data.result.seedict.commentPron) }}
            </p>
          </div>
        </div>
      </template>

      <!-- yngping 字段可能为空字符串 -->
      <template
        v-if="
          wordResponse.data.result.seedict.phonetics &&
          wordResponse.data.result.seedict.phonetics.yngping
        "
      >
        <Subtitle text="注音一览"></Subtitle>
        <WordPhoneticCard
          :data="wordResponse.data.result.seedict.phonetics"
        ></WordPhoneticCard>
      </template>

      <template
        v-if="
          wordResponse.data.result.seedict.glyphs.length > 0 ||
          wordResponse.data.result.seedict.commentGlyph
        "
      >
        <Subtitle text="用字一览"></Subtitle>
        <div
          class="mb-5 mt-2 overflow-hidden rounded-lg bg-white text-rosybrown-800"
        >
          <table
            v-if="wordResponse.data.result.seedict.glyphs.length > 0"
            class="w-full border-collapse"
          >
            <thead class="bg-rosybrown-300 text-center">
              <tr>
                <th class="py-1 text-white">用字</th>
                <th class="py-1 text-white">类别</th>
                <!-- <th class="py-1 text-white">来源</th> -->
              </tr>
            </thead>
            <tbody class="text-center">
              <tr
                v-for="(glyph, index) in wordResponse.data.result.seedict
                  .glyphs"
                :key="index"
              >
                <td class="py-1.5">{{ glyph.glyph }}</td>
                <td class="flex items-center justify-center py-2">
                  <Badge v-if="glyph.category">{{ glyph.category }}</Badge>
                  <Badge v-else>N/A</Badge>
                </td>
                <!-- <td class="py-1.5">{{ glyph.source }}</td> -->
              </tr>
            </tbody>
          </table>

          <hr
            v-if="
              wordResponse.data.result.seedict.glyphs.length > 0 &&
              wordResponse.data.result.seedict.commentGlyph
            "
            class="border-t-2 border-rosybrown-100"
          />

          <div
            class="px-8"
            :class="{
              'pb-4 pt-2': wordResponse.data.result.seedict.glyphs.length > 0,
              'py-6': wordResponse.data.result.seedict.glyphs.length <= 0,
            }"
            v-if="wordResponse.data.result.seedict.commentGlyph"
          >
            <p>
              <SeeSymbol class="text-rosybrown-700">注釋</SeeSymbol>
              {{ correctText(wordResponse.data.result.seedict.commentGlyph) }}
            </p>
          </div>
        </div>
      </template></template
    >
  </PageContent>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Badge from '../components/common/Badge.vue';
import Explanations from '../components/common/ExplanationList.vue';
import SeeSymbol from '../components/common/SeeSymbol.vue';
import Subtitle from '../components/common/Subtitle.vue';
import PageContent from '../components/PageContent.vue';
import SideBar from '../components/SideBar.vue';
import WordCikLingCard from '../components/WordCikLingCard.vue';
import WordFengBlock from '../components/WordFengCard.vue';
import WordHead from '../components/WordHead.vue';
import WordPhoneticCard from '../components/WordPhoneticCard.vue';
import WordSkeleton from '../components/WordSkeleton.vue';
import { apiV1Url } from '../utils/api';
import { yngpingToIPA } from '../utils/phonetics';
import type { AudioResponse, WordResponse, WordSeeDict } from '../utils/typing';
import { correctText } from '../utils/typography';

const ossUrl = import.meta.env.VITE_OSS_URL || '/';
const route = useRoute();
const router = useRouter();
const w = ref(route.query.w as string);
const loading = ref(false);
const wordResponse = ref<WordResponse>({
  status: 0,
  data: {
    w: '',
    result: {
      seedict: {
        text: '',
        glyphs: [],
        pronPrimary: '',
        prons: [],
        phonetics: { yngping: '' },
        expls: [],
      } as WordSeeDict,
      fengs: [],
      ciklings: [],
    },
  },
});

const audioResponse = ref<AudioResponse>({
  status: 0,
  data: {
    yngping: '',
    results: [],
  },
});

const avoidAnchorScroll = (): string => {
  if (route.hash) {
    const savedHash = route.hash;
    // 用 router.replace 移除 hash，阻止浏览器默认滚动
    router
      .replace({
        ...route,
        hash: '',
      })
      .catch(() => {});
    return savedHash;
  }
  return '';
};

const scrollAnchor = (hashAnchor: string) => {
  if (hashAnchor) {
    console.log(hashAnchor);
    const decodedHash = decodeURIComponent(hashAnchor);
    nextTick(() => {
      const target = document.querySelector(decodedHash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        router
          .replace({
            ...route,
            hash: decodedHash,
          })
          .catch(() => {});
      }
    });
  }
};

const savedHash = avoidAnchorScroll();

const updateTitle = () => {
  document.title = wordResponse.value.data?.result?.seedict?.text
    ? `${wordResponse.value.data.result.seedict.text} - 词汇`
    : '米时典 SeeDict - 词汇';
};

const fetchWordResponse = async () => {
  loading.value = true;
  try {
    const response = await fetch(apiV1Url('/word/', { w: w.value }));
    if (!response.ok) throw new Error('Response Error');
    wordResponse.value = await response.json();
    updateTitle();

    const yngping = wordResponse.value.data.result.seedict.pronPrimary;
    if (yngping) {
      fetchAudioResponse(yngping);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    setTimeout(() => {
      scrollAnchor(savedHash);
    }, 100);
  }
};

const fetchAudioResponse = async (yngping: string) => {
  try {
    const response = await fetch(apiV1Url('/audio/', { yngping }));
    if (!response.ok) throw new Error('Response Error');
    audioResponse.value = await response.json();
    sortAudioBySpeaker();
  } catch (error) {
    console.error(error);
  }
};

const sortAudioBySpeaker = () => {
  if (audioResponse.value.data?.results) {
    const speakerPriority: {
      hy: number;
      lk: number;
      [key: string]: number;
    } = {
      hy: 1,
      lk: 2,
    };

    audioResponse.value.data.results.sort((a, b) => {
      const priorityA = speakerPriority[a.speaker] || 3;
      const priorityB = speakerPriority[b.speaker] || 3;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return a.speaker.localeCompare(b.speaker);
    });
  }
};

watch(
  () => route.query.w,
  (newWord) => {
    if (!newWord) return;
    w.value = newWord as string;
    fetchWordResponse();
  },
  { immediate: true }
);

const isCommentedCikLing = computed(() => {
  return wordResponse.value.data.result.ciklings.some(
    (entry) => entry.comment?.trim() !== ''
  );
});
</script>
