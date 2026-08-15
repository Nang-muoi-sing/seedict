<template>
  <component
    :is="tag"
    v-bind="linkProps"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :disabled="tag === 'button' ? disabled || loading : undefined"
    class="relative inline-flex shrink-0 select-none items-center justify-center rounded-lg font-medium no-underline transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      variants[variant],
      sizes[size],
      (disabled || loading) && tag !== 'button'
        ? 'pointer-events-none opacity-50'
        : '',
    ]"
    @click="handleClick"
  >
    <ILineMdLoadingTwotoneLoop
      v-if="loading"
      class="h-[1.2em] w-[1.2em]"
      :class="{ 'mr-2': hasContent }"
    />

    <component
      :is="icon"
      v-if="icon && !loading"
      class="h-[1.2em] w-[1.2em] transition-transform group-active:scale-90"
      :class="{ 'mr-2': hasContent }"
    />

    <slot>{{ label }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { Component } from 'vue';

interface Props {
  label?: string;
  icon?: Component;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  href?: string; // 外部链接
  to?: string | object; // Vue Router 路由
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});

const emit = defineEmits(['click']);
const slots = useSlots();

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

const hasContent = computed(() => !!(props.label || slots.default));

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  emit('click', e);
};

const variants = {
  primary:
    'bg-rosybrown-600 text-white visited:text-white hover:bg-rosybrown-700',
  secondary:
    'bg-wheat-100 text-rosybrown-700 visited:text-rosybrown-700 hover:bg-wheat-200',
  outline:
    'border-2 border-rosybrown-200 text-rosybrown-700 visited:text-rosybrown-700 hover:bg-rosybrown-100',
};

const sizes = {
  sm: 'px-3 h-8 text-xs',
  md: 'px-5 h-10 text-sm',
  lg: 'h-10 px-5 text-sm sm:h-12 sm:px-6 sm:text-base',
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
