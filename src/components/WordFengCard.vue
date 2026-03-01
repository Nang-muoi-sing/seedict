<template>
  <div class="mb-5 mt-2 rounded-lg bg-white px-8 py-6 text-rosybrown-800">
    <div class="items-baseline">
      <span class="mr-2 text-3xl font-bold text-rosybrown-800 sm:text-4xl">
        <MarkedText :text="props.data.text" />
      </span>
      <span class="text-xl text-rosybrown-500">
        /{{ Phrase.of(props.data.pronLiteral, true).toFengIPA() }}/→/{{
          Phrase.of(props.data.pronSandhi, true).toFengIPA()
        }}/
      </span>
    </div>

    <div class="flex w-full justify-end">
      <button
        class="mb-4 cursor-pointer rounded bg-wheat-50 px-3 py-1 text-sm transition hover:bg-wheat-100"
        @click="toggleMode"
      >
        显示{{ currentGlyph === 'original' ? '推荐用字' : '原书用字' }}
      </button>
    </div>
    <Explanations
      :data="props.data.expls"
      :current-glyph="currentGlyph"
    ></Explanations>
    <p v-if="props.data.comment">
      <SeeSymbol class="text-rosybrown-700">注釋</SeeSymbol>
      <FormatText :text="props.data.comment" :glyph-mode="currentGlyph" />
    </p>
    <p class="mt-2 flex justify-end text-sm text-rosybrown-200">
      {{
        props.data.refPage
          ? `冯爱珍. 福州方言词典. 南京: 江苏教育出版社, 1998: ${props.data.refPage}.`
          : '冯爱珍. 福州方言词典. 南京: 江苏教育出版社, 1998.'
      }}
    </p>
    <template v-if="props.data.correction">
      <hr class="my-2 border-t-2 border-rosybrown-100" />
      <p>
        <SeeSymbol class="text-rosybrown-700">校注</SeeSymbol
        ><FormatText :text="props.data.correction" />
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Phrase } from '../utils/phonetics';
import type { WordFeng } from '../utils/typing';
import Explanations from './common/ExplanationList.vue';
import SeeSymbol from './common/SeeSymbol.vue';
import FormatText from './common/FormatText.vue';
import MarkedText from './common/MarkedText.vue';

const props = defineProps<{
  data: WordFeng;
}>();

const currentGlyph = ref<'original' | 'canonical'>('canonical');
const toggleMode = () => {
  currentGlyph.value =
    currentGlyph.value === 'original' ? 'canonical' : 'original';
};
</script>
