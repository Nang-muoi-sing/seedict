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
              <IMaterialSymbolsDelete />
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
              <span
                v-for="(token, index) in resultTokens"
                :key="index"
                v-memo="[token.text, token.type, token.message, targetScheme]"
              >
                <span
                  :tabindex="
                    token.type === 'error' && token.message ? 0 : undefined
                  "
                  :data-tooltip-target="
                    token.type === 'error' && token.message
                      ? `tooltip-${index}`
                      : undefined
                  "
                  class="inline text-rosybrown-800"
                  :class="{
                    'cursor-pointer rounded-md bg-rose-50 px-1 ring-1 ring-rose-100':
                      token.type === 'error',
                    'whitespace-pre-wrap': token.type === 'whitespace',
                  }"
                >
                  {{ token.text }}
                </span>
                <SeeTooltip
                  v-if="token.type === 'error' && token.message"
                  :id="`tooltip-${index}`"
                  >{{ token.message }}</SeeTooltip
                >
              </span>
            </template>
            <span
              v-else
              class="select-none text-3xl font-bold text-wheat-600/50"
            >
              {{ placeholders[targetScheme] }}
            </span>
          </div>
          <div class="mt-auto px-6 py-3">
            <SeeIconButton
              @click="handleCopyClick"
              variant="secondary"
              size="sm"
            >
              <IMaterialSymbolsContentCopy />
            </SeeIconButton>
          </div>
          <SeeToast ref="copyToast">已复制结果</SeeToast>
        </div>
      </div>
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageContent from '../components/PageContent.vue';
import TextareaCard from '../components/TextareaCard.vue';
import { Utterance } from '../utils/phonetics';
import SeeIconButton from '../components/seeui/button/SeeIconButton.vue';
import type { Scheme } from '../utils/phonetics';
import SeeTooltip from '../components/seeui/tooltip/SeeTooltip.vue';

type TokenType = 'normal' | 'error' | 'whitespace';

interface DisplayToken {
  text: string;
  type: TokenType;
  message?: string;
}

const sourceScheme = ref<Scheme>('typing');
const targetScheme = ref<Scheme>('cursive');
const inputArea = ref<InstanceType<typeof TextareaCard> | null>(null);
const copyToast = ref();

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

const inputText = computed(() => inputArea.value?.data?.() || '');

const formatRaw = (raw: string | undefined) => {
  if (!raw) return '';
  return raw.length > 10 ? `${raw.slice(0, 10)}...` : raw;
};

const resultTokens = computed<DisplayToken[]>(() => {
  if (!inputText.value) return [];

  const utterance = Utterance.of(inputText.value, sourceScheme.value);
  const tokens: DisplayToken[] = [];

  utterance.phrases.forEach((phrase, index) => {
    const allValid = phrase.syllables.every((s) => s.isValid());

    if (!allValid) {
      // 找出第一个错误的音节并获取其错误信息
      const firstInvalid = phrase.syllables.find((s) => !s.isValid());
      const rawText = formatRaw(firstInvalid?.toRaw());
      const message = !firstInvalid?.isValid('tone')
        ? `${rawText} 声调不符合规则`
        : `${rawText} 的音节不符合规则`;

      tokens.push({
        text: phrase.toRaw(),
        type: 'error',
        message: message,
      });
    } else {
      let targetText = '';
      switch (targetScheme.value) {
        case 'typing':
          targetText = phrase.toString();
          break;
        case 'cursive':
          targetText = phrase.toCursive();
          break;
        case 'ipa':
          targetText = phrase.toIPA();
          break;
      }

      tokens.push({
        text: targetText,
        type: 'normal',
      });
    }

    if (index < utterance.phrases.length - 1) {
      tokens.push({
        text: ' ',
        type: 'whitespace',
      });
    }
  });

  return tokens;
});

const hasResultContent = computed(() =>
  resultTokens.value.some((t) => t.type !== 'whitespace')
);

const handleDeleteClick = () => inputArea.value?.clear();

const handleCopyClick = async () => {
  const content = resultTokens.value.map((t) => t.text).join('');
  if (!content) return;
  try {
    await navigator.clipboard.writeText(content);
    copyToast.value?.show();
  } catch (err) {
    console.error('复制失败:', err);
  }
};

</script>
