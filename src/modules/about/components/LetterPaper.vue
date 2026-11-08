<template>
    <div class="bg-white relative">
        <img class="absolute right-7 -top-3" :src="clipImg"></img>
        <div class="py-8 px-10">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import clipImg from '@/assets/paper-clip.svg';
</script>
