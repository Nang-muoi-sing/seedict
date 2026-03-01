<template>
  <div
    class="mb-5 mt-2 flex flex-wrap gap-3 rounded-lg bg-white px-8 py-6 text-rosybrown-800"
  >
    <p v-if="processedData.phonologyTone">
      <Badge>音韵地位</Badge>{{ processedData.phonologyInitial
      }}{{ processedData.phonologyFinal }}{{ processedData.phonologyTone }}
    </p>
    <p v-if="processedData.banguace">
      <Badge>教会罗马字</Badge>{{ processedData.banguace }}
    </p>
    <template v-if="processedData.yngping">
      <p><Badge>国际音标</Badge>/{{ processedData.utterance.toIPA() }}/</p>
      <p>
        <Badge>榕拼键入</Badge
        ><span
          ><YngpingSup :syllables="processedData.utterance.toSyllables()"
        /></span>
      </p>
      <p>
        <Badge>榕拼手写</Badge
        ><span>{{ processedData.utterance.toCursive() }}</span>
      </p></template
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toneCikLingMap } from '../utils/mapping';
import { Utterance, phonologyToBanguace } from '../utils/phonetics';
import type { Phonetics } from '../utils/typing';
import Badge from './common/Badge.vue';
import YngpingSup from './common/YngpingSup.vue';

const props = defineProps<{
  data: Phonetics;
}>();

const processedData = computed(() => {
  const toneHan = props.data.phonologyTone
    ? toneCikLingMap[props.data.phonologyTone]
    : props.data.phonologyTone;

  const utterance = Utterance.of(props.data.yngping);
  const banguace =
    props.data.phonologyInitial && props.data.phonologyFinal && toneHan
      ? phonologyToBanguace(
          props.data.phonologyInitial,
          props.data.phonologyFinal,
          toneHan
        )
      : '';

  return {
    ...props.data,
    utterance: utterance,
    phonologyTone: toneHan,
    banguace: banguace,
  };
});
</script>
