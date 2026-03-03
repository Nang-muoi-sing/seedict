<template>
  <component
    :is="tag"
    v-bind="linkProps"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    class="relative inline-flex shrink-0 items-center justify-center no-underline transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      variants[variant],
      sizes[size],
      (disabled || loading) && tag !== 'button'
        ? 'pointer-events-none opacity-50'
        : '',
    ]"
    @click="handleClick"
  >
    <ILineMdLoadingTwotoneLoop v-if="loading" class="h-[1.2em] w-[1.2em]" />

    <slot v-else>
      <component
        :is="icon"
        v-if="icon"
        class="h-[1.2em] w-[1.2em] transition-transform group-active:scale-90"
      />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  icon?: Component;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  href?: string; // 外部链接
  to?: string | object; // 路由链接
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});

const emit = defineEmits(['click']);

const tag = computed(() => {
  if (props.to) return 'RouterLink';
  if (props.href) return 'a';
  return 'button';
});

const linkProps = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return {};
});

const isExternal = computed(
  () => typeof props.href === 'string' && props.href.startsWith('http')
);

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }
  emit('click', e);
};

const variants = {
  primary: 'bg-rosybrown-600 text-white hover:bg-rosybrown-700',
  secondary: 'bg-wheat-100 text-rosybrown-700 hover:bg-wheat-200',
  outline:
    'border-2 border-rosybrown-200 text-rosybrown-700 hover:bg-rosybrown-100',
};

const sizes = {
  sm: 'h-8 w-8 text-[1.1rem] rounded-lg',
  md: 'h-10 w-10 text-[1.5rem] rounded-lg',
  lg: 'h-16 w-16 text-[3rem] rounded-xl',
};
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}
</style>
