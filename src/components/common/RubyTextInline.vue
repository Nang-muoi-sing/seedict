<template>
  <ruby class="ruby-text-inline" :aria-label="ariaLabel">
    <template
      v-for="(item, itemIndex) in annotationItems"
      :key="`${item.text}-${item.ruby}-${itemIndex}`"
    >
      <span
        v-for="(char, charIndex) in item.chars"
        :key="`${char}-${charIndex}`"
        class="rb relative inline-block"
        :class="{
          'w-fit after:absolute after:-bottom-[0.2em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
            item.marks[charIndex],
        }"
      >
        {{ char }}
      </span>

      <rp>(</rp>
      <rt class="relative top-[0.5em] text-rosybrown-700">
        <template v-if="shouldPadRuby(item)">
          &thinsp;{{ item.ruby }}&thinsp;
        </template>
        <template v-else>
          {{ item.ruby }}
        </template>
      </rt>
      <rp>)</rp>
    </template>
  </ruby>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Utterance } from '../../utils/phonetics';

const props = defineProps<{
  text: string;
  yngping: string;
}>();

const rawText = computed(() => props.text.trim());

const markedChars = computed<boolean[]>(() => {
  const chars = rawText.value.split(/(?:)/u);
  const marks: boolean[] = [];

  for (let index = 0; index < chars.length; index++) {
    if (chars[index] === '*') {
      continue;
    }

    if (index === chars.length - 1) {
      marks.push(false);
      continue;
    }

    marks.push(chars[index + 1] === '*');
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

const shouldRubyPerChar = computed(() => {
  return Boolean(props.text && props.yngping && isMatchedTextSyllable.value);
});

const annotationItems = computed(() => {
  if (shouldRubyPerChar.value) {
    return baldChars.value.map((char, index) => ({
      text: char,
      chars: [char],
      marks: [markedChars.value[index]],
      ruby: syllables.value[index].toCursive(),
      perChar: true,
    }));
  }

  return [
    {
      text: baldText.value,
      chars: props.text ? baldChars.value : [''],
      marks: props.text ? markedChars.value : [false],
      ruby: utterance.value.toCursive(),
      perChar: false,
    },
  ];
});

const ariaLabel = computed(() => {
  return `${baldText.value} ${utterance.value.toCursive()}`;
});

const shouldPadRuby = (item: { perChar: boolean }) => {
  return item.perChar && baldChars.value.length > 1;
};
</script>

<style scoped>
.ruby-text-inline {
  ruby-position: over;
  line-height: inherit;
}

rt::before {
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
