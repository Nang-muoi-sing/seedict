<template>
  <RouterLink
    v-if="to"
    :to="to"
    :target="resolvedTarget"
    :rel="rel"
    :class="linkClass"
  >
    <slot />
  </RouterLink>
  <a v-else :href="href" :target="resolvedTarget" :rel="rel" :class="linkClass">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface Props {
  href?: string;
  target?: string;
  to?: RouteLocationRaw;
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  target: undefined,
  to: undefined,
});

const linkClass = 'underline underline-offset-4';
const resolvedTarget = computed(
  () => props.target ?? (props.href ? '_blank' : undefined)
);
const rel = computed(() =>
  resolvedTarget.value === '_blank' ? 'noopener noreferrer' : undefined
);
</script>
