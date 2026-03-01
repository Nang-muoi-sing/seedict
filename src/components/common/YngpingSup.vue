<template>
  <template v-for="(syllable, index) in props.syllables" :key="index">
    {{ syllable.value.initial }}{{ syllable.value.final
    }}<sup>{{ syllable.value.tone }}</sup
    ><template v-if="index != props.syllables.length - 1">&nbsp;</template>
  </template>
</template>

<script setup lang="ts">
import { Syllable } from '../../utils/phonetics';

const props = defineProps<{
  syllables: Syllable[];
}>();
</script>
