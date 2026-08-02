<template>
  <img
    :src="src"
    :alt="alt"
    :class="[
      'block w-full rounded-lg',
      objectClass,
      customClass,
    ]"
    :draggable="draggable"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  src: string;
  alt?: string;
  fit?: 'contain' | 'cover';
  class?: string;
  draggable?: boolean;
  loading?: 'eager' | 'lazy';
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fit: 'contain',
  class: '',
  draggable: false,
  loading: 'lazy',
});

const objectClass = computed(() =>
  props.fit === 'cover' ? 'object-cover' : 'object-contain'
);

const customClass = computed(() => props.class);
</script>
