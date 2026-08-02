<template>
  <code
    class="inline rounded-md bg-wheat-100 px-1.5 py-0.5 font-mono text-[0.9em] text-rosybrown-800"
  >
    <slot>{{ code }}</slot>
  </code>
</template>

<script setup lang="ts">
interface Props {
  code?: string;
}

withDefaults(defineProps<Props>(), {
  code: '',
});
</script>
