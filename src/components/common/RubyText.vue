<template>
  <ruby v-if="!props.text || !props.yngping || !isMatchedTextSyllable">
    <template v-if="props.text">
      <span
        v-for="(char, index) in baldChars"
        :key="`${char}-${index}`"
        class="rb relative inline-block"
        :class="{
          'w-fit after:absolute after:-bottom-[0.2em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
            markedChars[index],
        }"
        >{{ char }}
      </span>
    </template>

    <span v-else class="rb"></span>
    <rp>(</rp
    ><rt class="relative top-[0.5em] text-rosybrown-700">{{
      utterance.toCursive()
    }}</rt
    ><rp>)</rp>
  </ruby>

  <ruby v-else>
    <template v-for="(char, index) in baldChars" :key="`${char}-${index}`">
      <span
        class="rb relative inline-block"
        :class="{
          'w-fit after:absolute after:-bottom-[0.2em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
            markedChars[index],
        }"
        >{{ char }}
      </span>

      <rp>(</rp
      ><rt
        v-if="baldChars.length > 1"
        class="relative top-[0.5em] text-rosybrown-700"
        >&thinsp;{{ syllables[index].toCursive() }}&thinsp;</rt
      ><rt v-else class="relative top-[0.5em] text-rosybrown-700">{{
        syllables[index].toCursive()
      }}</rt>
      <rp>)</rp>
    </template>
  </ruby>
</template>

<script setup lang="ts">
import { Utterance } from '../../utils/phonetics';
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  yngping: string;
}>();

const rawText = computed(() => props.text.trim());

const markedChars = computed<boolean[]>(() => {
  const chars = rawText.value.split(/(?:)/u);
  const marks = [];

  for (let index = 0; index < chars.length; index++) {
    if (chars[index] === '*') {
      continue;
    }

    if (index === chars.length - 1) {
      marks.push(false);
      continue;
    }

    if (chars[index + 1] === '*') {
      marks.push(true);
    } else {
      marks.push(false);
    }
  }
  return marks;
});

const baldText = computed(() => rawText.value.replace(/\*/g, ''));
const baldChars = computed(() => baldText.value.split(/(?:)/u));
const utterance = computed(() => Utterance.of(props.yngping));
const syllables = computed(() => utterance.value.toSyllables());

const isMatchedTextSyllable = computed(() => {
  return baldChars.value.length === syllables.value.length;
});
</script>

<style scoped>
rt:before {
  /* 用于防止调号在 <rt> 中偏移 */
  content: '';
  display: inline-block;
  width: 0;
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  _::-webkit-full-page-media,
  _:future,
  ruby > rt {
    top: 1em !important;
  }
}
</style>
