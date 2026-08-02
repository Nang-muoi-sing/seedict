<template>
  <kbd
    class="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-wheat-300 bg-white px-2 py-[0.25em] mb-0.5 align-middle font-mono text-[0.85em] leading-none text-rosybrown-800 shadow-[0_1px_0_0_rgba(120,90,70,0.14)]"
    style="vertical-align: middle"
  >
    <slot>{{ label }}</slot>
  </kbd>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: '',
});
</script>
