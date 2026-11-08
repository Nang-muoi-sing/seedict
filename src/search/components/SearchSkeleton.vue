<template>
  <div class="animate-pulse">
    <div
      class="bg-wheat-200 mb-2.5 h-6 w-[30%] rounded-lg px-2 py-1 sm:w-32"
    ></div>
    <div class="bg-wheat-100 mb-2 h-3 w-[40%] rounded-lg px-2 sm:w-50"></div>
  </div>

  <div
    v-for="index in props.number"
    :key="index"
    class="bg-wheat-100 my-5 px-5 py-4"
  >
    <div class="animate-pulse">
      <div class="flex justify-end">
        <div class="bg-wheat-200 mb-3 h-3 w-[35%] rounded-lg sm:w-32"></div>
      </div>

      <div class="bg-wheat-200 mb-5 h-6 w-[30%] rounded-lg sm:w-28"></div>
      <div
        class="bg-wheat-200 mb-2.5 h-3 w-[80%] rounded-lg sm:w-85 md:w-135"
      ></div>
      <div
        class="bg-wheat-200 mb-2.5 h-3 w-[65%] rounded-lg sm:w-70 md:w-105"
      ></div>
      <div
        class="bg-wheat-200 mb-2.5 h-3 w-[70%] rounded-lg sm:w-75 md:w-120"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    number?: number;
  }>(),
  {
    number: 10,
  }
);
</script>
