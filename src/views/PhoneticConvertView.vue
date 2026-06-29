<template>
  <PageContent :show-search-bar="false">
    <div>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText
          :text="'榕拼转换'"
          :yngping="'yng55 ping55 duong55 uang242'"
        ></RubyText>
      </div>
      <div class="space-y-2 text-sm font-semibold text-rosybrown-600">
        <p>
          在榕拼键入、榕拼手写与国际音标之间实时转换，逐个音节校验并提示错误，帮助你快速完成不同注音方案之间的互换。
        </p>
      </div>
    </div>

    <div class="relative mb-16 mt-5 space-y-5 rounded-lg bg-white">
      <div
        class="absolute flex w-full items-center justify-between gap-1 px-6 pt-5"
      >
        <select
          v-model="sourceScheme"
          class="w-full rounded-lg border border-wheat-200 bg-wheat-50/50 px-3 py-1.5 font-plain text-sm text-rosybrown-700 ring-wheat-200 transition hover:border-wheat-400"
        >
          <option
            v-for="option in schemeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <div
          class="mx-2 rounded-full bg-white text-rosybrown-700 ring-8 ring-wheat-50"
        >
          <i-mi-switch class="m-2" />
        </div>

        <select
          v-model="targetScheme"
          class="w-full rounded-lg border border-wheat-200 bg-wheat-50/50 px-3 py-1.5 font-plain text-sm text-rosybrown-700 ring-wheat-200 transition hover:border-wheat-400"
        >
          <option
            v-for="option in schemeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="flex w-full flex-col lg:flex-row">
        <div
          class="my-3 ml-3 mr-3 flex flex-1 flex-col rounded-xl bg-wheat-50 pt-16 lg:mr-0"
        >
          <TextareaCard
            ref="inputArea"
            :placeholder="placeholders[sourceScheme]"
            :placeholder-class="'px-6 text-3xl font-bold text-wheat-600/50 leading-relaxed'"
            :input-area-class="{
              'h-full min-h-[10rem] w-full break-all px-6 leading-relaxed text-rosybrown-800 lg:min-h-[20rem]': true,
              'text-3xl font-bold': inputText.length < 120,
              'text-xl font-bold':
                inputText.length >= 120 && inputText.length < 280,
            }"
          ></TextareaCard>
          <div class="bg-red mt-auto px-6 py-3">
            <SeeIconButton
              @click="handleDeleteClick"
              variant="secondary"
              size="sm"
            >
              <IMaterialSymbolsDeleteRounded />
            </SeeIconButton>
          </div>
        </div>

        <div
          class="my-3 ml-3 mr-3 flex flex-1 flex-col rounded-xl bg-white lg:pl-0 lg:pt-16"
        >
          <div
            class="h-full min-h-[10rem] w-full break-all px-6 leading-relaxed text-rosybrown-800 lg:min-h-[20rem]"
            :class="{
              'text-3xl font-bold': inputText.length < 120,
              'text-xl font-bold':
                inputText.length >= 120 && inputText.length < 280,
            }"
          >
            <template v-if="hasResultContent">
              <template v-for="(token, index) in resultTokens" :key="index">
                <span
                  v-if="token.options"
                  class="cursor-pointer rounded-lg underline decoration-wavy hover:bg-wheat-50"
                  :class="{
                    'text-rosybrown-500': token.isAmbiguous,
                    'text-rosybrown-800': !token.isAmbiguous,
                  }"
                  @click="handleTokenClick($event, token)"
                  >{{ token.text }}</span
                >
                <span
                  v-else
                  :tabindex="
                    token.type === 'error' && token.message ? 0 : undefined
                  "
                  class="inline text-rosybrown-800"
                  :class="{
                    'cursor-pointer rounded-md bg-rose-50 px-1 ring-1 ring-rose-100':
                      token.type === 'error',
                    'whitespace-pre-wrap': token.type === 'punctuation',
                  }"
                  :data-tooltip-msg="
                    token.type === 'error' ? token.message : undefined
                  "
                >
                  {{ token.text }}
                </span>
              </template>
            </template>
            <span
              v-else
              class="select-none text-3xl font-bold text-wheat-600/50"
            >
              {{ placeholders[targetScheme] }}
            </span>
          </div>
          <div class="mt-auto flex gap-2 px-6 py-3">
            <SeeIconButton
              @click="handleCopyClick"
              variant="secondary"
              size="sm"
            >
              <IMaterialSymbolsContentCopyRounded />
            </SeeIconButton>
            <SeeIconButton
              @click="handleOpenConfig"
              variant="secondary"
              size="sm"
            >
              <IMaterialSymbolsTuneRounded />
            </SeeIconButton>
          </div>
          <SeeModal :show="isConfigOpen" @blur="handleCancelConfig">
            <div
              class="w-xs space-y-5 rounded-2xl bg-white p-6 shadow-xl md:w-lg"
            >
              <SeeSwitchCard
                v-model="draftConfig.isProgAssimEnabled"
                title="推导声母类化"
                description="后字声母受前字韵尾影响而发生变化，如：花瓶 /hua bìng/ → /hua wìng/"
              />
              <SeeSwitchCard
                v-model="draftConfig.isRegrAssimEnabled"
                title="推导韵尾类化"
                description="前字韵尾受后字声母影响而发生变化，如：公妈 /gung mā/ → /gùm mā/"
              />
              <SeeSwitchCard
                v-model="draftConfig.isVowelShiftEnabled"
                title="推导松紧变韵"
                description="松韵韵母在特定单字调下发音不固定，连读会被还原为紧韵，如：裤 /kǒu/ → 裤头 /ku làu/"
              />
              <SeeSwitchCard
                v-model="draftConfig.isToneSandhiEnabled"
                title="推导连读变调"
                description="福州话以声调多变而著称，在语流中普遍发生声调的变化，如：昨暝 /soh màng/ → /sōh màng/"
              />
              <p class="text-xs text-rosybrown-500">
                *福州话的连读还会受句法和语义影响，本工具提供理论连读结果供学习参考
              </p>
              <div class="mt-8 flex flex-row justify-between gap-8">
                <SeeButton
                  class="flex-1"
                  label="确定"
                  @click="handleConfirmConfig"
                />
                <SeeButton
                  class="flex-1"
                  variant="outline"
                  label="取消"
                  @click="handleCancelConfig"
                />
              </div>
            </div>
          </SeeModal>
        </div>
      </div>
    </div>
  </PageContent>
  <SeeContextMenu ref="contextMenu" />
  <SeeTooltip />
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import { computed, ref, shallowRef, watch } from 'vue';
import PageContent from '../components/PageContent.vue';
import SeeIconButton from '../components/seeui/button/SeeIconButton.vue';
import SeeContextMenu from '../components/seeui/menu/SeeContextMenu.vue';
import SeeSwitchCard from '../components/seeui/switch/SeeSwitchCard.vue';
import SeeTooltip from '../components/seeui/tooltip/SeeTooltip.vue';
import TextareaCard from '../components/TextareaCard.vue';
import type { Final } from '../utils/mapping';
import type { Scheme, Syllable } from '../utils/phonetics';
import { Utterance } from '../utils/phonetics';
import {
  applyProgressAssimilation,
  applyRegressAssimilation,
  applyToneSandhi,
  applyVowelSandhi,
  getVowelAmbiguities,
} from '../utils/sandhi';
import { toast } from '../utils/toast';
import { Phrase } from '../utils/phonetics';
type TokenType = 'normal' | 'error' | 'punctuation' | 'separator';

interface DisplayToken {
  idx: string;
  text: string;
  type: TokenType;
  message?: string;
  options?: readonly string[];
  isAmbiguous?: boolean;
}

interface Config {
  isProgAssimEnabled: boolean;
  isRegrAssimEnabled: boolean;
  isVowelShiftEnabled: boolean;
  isToneSandhiEnabled: boolean;
}

const sourceScheme = ref<Scheme>('typing');
const targetScheme = ref<Scheme>('cursive');

const config = ref<Config>({
  isProgAssimEnabled: true,
  isRegrAssimEnabled: false,
  isVowelShiftEnabled: true,
  isToneSandhiEnabled: true,
});
const isConfigOpen = ref(false);
const draftConfig = ref({ ...config.value });

const inputArea = ref<InstanceType<typeof TextareaCard> | null>(null);
const resultTokens = shallowRef<DisplayToken[]>([]);

const tightSelections = ref<Record<string, string>>({});
const contextMenu = ref<InstanceType<typeof SeeContextMenu> | null>(null);

const schemeOptions = [
  { label: '榕拼键入', value: 'typing' },
  { label: '榕拼手写', value: 'cursive' },
  { label: '国际音标', value: 'ipa' },
] as const;

const placeholders: Record<Scheme, string> = {
  typing: 'huk21 ziu53 ua242',
  cursive: 'hǔk zìu uâ',
  ipa: 'huʔ˨˩ t͡siu˥˧ ua˨˦˨',
};

const inputText = computed(
  () => inputArea.value?.data?.().normalize('NFD') || ''
);

const formatRaw = (raw: string | undefined) => {
  if (!raw) return '';
  return raw.length > 10 ? `${raw.slice(0, 10)}...` : raw;
};

const applySandhi = (phrase: Phrase, config: Config): Phrase => {
  let result = phrase;

  if (config.isToneSandhiEnabled) {
    result = applyToneSandhi(result);
  }
  if (config.isVowelShiftEnabled) {
    result = applyVowelSandhi(result);
  }
  if (config.isProgAssimEnabled) {
    result = applyProgressAssimilation(result);
  }
  if (config.isRegrAssimEnabled) {
    result = applyRegressAssimilation(result);
  }
  return result;
};

const updateResult = debounce(() => {
  if (!inputText.value) {
    resultTokens.value = [];
    tightSelections.value = {};
    return;
  }

  // 在标点处断裂
  const chunks = inputText.value
    .split(/([，。！？；：、“”（）,.!?;:()\s]+)/g)
    .filter(Boolean);
  const tokens: DisplayToken[] = [];
  chunks.forEach((chunk) => {
    if (/^[，。！？；：、“”（）,.!?;:()\s]+$/.test(chunk)) {
      tokens.push({
        idx: 'literal',
        text: chunk,
        type: 'punctuation',
      });
      return;
    }

    const utterance = Utterance.of(chunk, sourceScheme.value);

    utterance.phrases.forEach((phrase, pIdx) => {
      const phraseRaw = phrase.toRaw();
      const syllablesWithTight = phrase.syllables.map((s, sIdx) => {
        const savedTight = tightSelections.value[`${phraseRaw}-${sIdx}`];
        return savedTight ? s.withTight(savedTight as Final) : s;
      });
      const phraseToProcess = new Phrase(syllablesWithTight, phrase.isCompound);
      const sandhiPhrase = applySandhi(phraseToProcess, config.value);
      const ambiguities = getVowelAmbiguities(phrase);

      sandhiPhrase.syllables.forEach((s, sIdx) => {
        if (!s.isValid()) {
          const rawText = formatRaw(s.toRaw());
          const message = !s.isValid('tone')
            ? `${rawText} 声调不符合规则`
            : `${rawText} 的音节不符合规则`;

          tokens.push({
            idx: `${phraseRaw}-${sIdx}`,
            text: s.toRaw(),
            type: 'error',
            message: message,
          });
        } else {
          const amb = ambiguities.find((a) => a.index === sIdx);
          const options = config.value.isVowelShiftEnabled
            ? amb?.options
            : undefined;
          const isAmbiguous = options
            ? options.length > 1 &&
              !tightSelections.value[`${phraseRaw}-${sIdx}`]
            : undefined;

          tokens.push({
            idx: `${phraseRaw}-${sIdx}`,
            text: renderTarget(s, targetScheme.value),
            type: 'normal',
            options,
            isAmbiguous,
          });
        }

        if (phrase.isCompound && sIdx < sandhiPhrase.syllables.length - 1) {
          tokens.push({ idx: '-1', text: '-', type: 'separator' });
        }
      });

      if (pIdx < utterance.phrases.length - 1) {
        tokens.push({ idx: '-1', text: ' ', type: 'punctuation' });
      }
    });
  });
  resultTokens.value = tokens;
}, 300);

const renderTarget = (s: Syllable, scheme: Scheme) => {
  if (scheme === 'ipa') return s.toIPA();
  if (scheme === 'cursive') return s.toCursive();
  return s.toString();
};

const hasResultContent = computed(() =>
  resultTokens.value.some((t) => t.type !== 'punctuation')
);

const handleTokenClick = (event: MouseEvent, token: DisplayToken) => {
  event.stopPropagation();

  if (!token.options || token.options.length <= 1) return;

  contextMenu.value?.open(event.currentTarget as HTMLElement, {
    title: '指定紧韵',
    options: token.options,

    onSelect: (val: string) => {
      tightSelections.value[token.idx] = val;
      updateResult();
    },
  });
};

const handleDeleteClick = () => inputArea.value?.clear();

const handleCopyClick = async () => {
  const content = resultTokens.value.map((t) => t.text).join('');
  if (!content) return;
  try {
    await navigator.clipboard.writeText(content);
    toast.success('已复制结果');
  } catch (err) {
    console.error('复制失败:', err);
  }
};
const handleOpenConfig = () => {
  draftConfig.value = { ...config.value };
  isConfigOpen.value = true;
};

const handleConfirmConfig = () => {
  config.value = { ...draftConfig.value };
  isConfigOpen.value = false;
};

const handleCancelConfig = () => {
  isConfigOpen.value = false;
};

watch(
  [inputText, sourceScheme, targetScheme, config],
  () => {
    updateResult();
  },
  { immediate: true }
);
</script>
