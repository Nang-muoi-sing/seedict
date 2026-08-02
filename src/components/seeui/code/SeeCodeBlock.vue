<template>
  <pre
    class="overflow-x-auto rounded-2xl bg-rosybrown-900 px-4 py-3 text-sm leading-7 text-wheat-50 shadow-sm"
  ><code class="font-mono whitespace-pre"><slot>{{ code }}</slot></code></pre>
</template>

<script setup lang="ts">
interface Props {
  code?: string;
}

withDefaults(defineProps<Props>(), {
  code: '',
});
</script>
