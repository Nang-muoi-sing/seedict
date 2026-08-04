<template>
  <div class="mx-auto min-h-[30rem] w-full max-w-3xl space-y-3 md:min-h-[32rem]">
    <AccordionItem
      title="我打出来的是繁体字，可以用来打简体字吗？"
      :open="openItemId === 'simplified'"
      @toggle="toggleItem('simplified')"
    >
      <p>{{ faqAnswer }}</p>
    </AccordionItem>

    <AccordionItem
      title="我不知道想打的字对应的榕拼，应该怎么办？"
      :open="openItemId === 'pronunciation'"
      @toggle="toggleItem('pronunciation')"
    >
      <p>{{ faqAnswer }}</p>
    </AccordionItem>

    <AccordionItem
      title="怎样切换不同的输入方案（汉字 / 榕拼 / 教罗）？"
      :open="openItemId === 'scheme'"
      @toggle="toggleItem('scheme')"
    >
      <p>
        默认通过
        <SeeKeycap label="ctrl" />
        +
        <SeeKeycap label="`" />
        切换不同输入方案。
      </p>
    </AccordionItem>

    <AccordionItem
      title="我使用的是 iOS，可以使用榕拼输入法吗？"
      :open="openItemId === 'ios'"
      @toggle="toggleItem('ios')"
    >
      <p>{{ faqAnswer }}</p>
    </AccordionItem>

    <AccordionItem
      title="遇到了困难，哪里可以寻求帮助？"
      :open="openItemId === 'help'"
      @toggle="toggleItem('help')"
    >
      <p>{{ faqAnswer }}</p>
    </AccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccordionItem from './common/AccordionItem.vue';
import SeeKeycap from './seeui/keycap/SeeKeycap.vue';

const faqAnswer =
  '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹，又有清流激湍，映带左右。引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。';

const openItemId = ref<string | null>('simplified');

const toggleItem = (itemId: string) => {
  openItemId.value = openItemId.value === itemId ? null : itemId;
};
</script>
