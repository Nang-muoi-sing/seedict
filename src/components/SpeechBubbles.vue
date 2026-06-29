<template>
  <div>
    <SpeechBubble
      class="relative before:absolute before:-top-3 before:left-3 before:content-['➊']"
      :arrow-class="'border-t-wheat-100'"
      :bubble-class="'bg-wheat-100'"
    >
      <p class="text-sm text-wheat-600">
        𬖞是福州人在冬至时制作的寓意团圆的美食，具有福州腔调，也很有榕城的烟火气
      </p></SpeechBubble
    >
    <SpeechBubble
      class="relative before:absolute before:-top-3 before:left-3 before:content-['➋']"
      :left-arrow="false"
      :arrow-class="'border-t-wheat-100'"
      :bubble-class="'bg-wheat-100'"
      ><p class="text-sm text-wheat-600">
        和做「<RubyTextInline
          :text="'玻当𬖞'"
          :yngping="'bo55 loung55 si53'"
        ></RubyTextInline
        >」一样，需要社会上每一分子都为福州话保护添上「芝麻」「豆粉」「白砂糖」，
        才能做大做强，把福州话保护好
      </p></SpeechBubble
    >
    <SpeechBubble
      class="relative before:absolute before:-top-3 before:left-3 before:content-['➌']"
      :arrow-class="'border-t-wheat-100'"
      :bubble-class="'bg-wheat-100'"
      ><p class="text-sm text-wheat-600">
        「𬖞」是在街头巷尾常见的方言字，我们的一大愿望也是让大家了解到我们的方言是能够写出来的
      </p></SpeechBubble
    >
    <SpeechBubble
      class="relative before:absolute before:-top-3 before:left-3 before:content-['➍']"
      :left-arrow="false"
      :arrow-class="'border-t-wheat-100'"
      :bubble-class="'bg-wheat-100'"
      ><p class="text-sm text-wheat-600">
        「<RubyTextInline :text="'𬖞'" :yngping="'si53'"></RubyTextInline
        >」和英文的 see 谐音，在平话和普通话里，「<RubyTextInline
          :text="'𬖞典'"
          :yngping="'si33 dieng33'"
        ></RubyTextInline
        >」又和「<RubyTextInline
          :text="'词典'"
          :yngping="'sy33 dieng33'"
        ></RubyTextInline
        >」谐音，我们就是一部希望平话被更多人<ruby
          >看见<rp>(</rp><rt>see</rt><rp>)</rp></ruby
        >的词典
      </p></SpeechBubble
    >
  </div>
</template>

<script setup lang="ts">
import RubyTextInline from './common/RubyTextInline.vue';
import SpeechBubble from './common/SpeechBubble.vue';
</script>
