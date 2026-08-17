<template>
  <PageContent :show-search-bar="false">
    <LetterPaper>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText :text="'入门'" :yngping="'ik5 muong53'"></RubyText>
      </div>

      <div class="space-y-2 text-wheat-600">
        <p>读者您好！</p>
        <p>
          在使用《米时典》查询词汇时，您或许会留意到每个汉字上方都标注着拼音。这些拼音是什么？它们怎么读？为解答这些问题，我们的编辑团队编写了本教程，希望能够作为入门手册，帮助您学习和拼读榕拼。
        </p>

        <ul class="mt-5 list-disc pl-5 text-sm">
          <li>
            本教程是拼音教学，而非福州话教学。若您想借助本教程学习福州话，建议找一位会说福州话的朋友在旁边，为您念出例字，辅助学习。
          </li>
        </ul>
      </div>
    </LetterPaper>
    <h3 class="mb-3 mt-5 text-lg font-bold text-wheat-600 before:content-['■']">
      若您有一定的语言学基础，请直接阅读：
    </h3>
    <ul class="space-y-1.5 text-wheat-600">
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/QJ9WwaEHvihROKkEJ6uc2kzsnCc"
          >榕拼方案规范文档</Link
        >
      </li>
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/Xs7HwuxwUiV4cmkzrrPck9uTnne"
          >榕拼方案规范文档分册：福州城里</Link
        >
      </li>
    </ul>
    <h3 class="mb-3 mt-5 text-lg font-bold text-wheat-600 before:content-['■']">
      若您没有语言学基础，请按以下顺序阅读：
    </h3>
    <ul class="space-y-1.5 text-wheat-600">
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/K8RfwLGzuiC9eskLKAqcrNrnnde"
          >第一课：声调的学习</Link
        >
      </li>
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/S3S9w2H0iiVOlOkstTDcZaGyn4d"
          >第二课：元音的学习</Link
        >
      </li>
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/SanRwn2DViWAk0k2rCYc28Thnm5"
          >第三课：韵母的学习</Link
        >
      </li>
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/C2JVweQaFie25Dk8RT7cCjtfngf"
          >第四课：声母的学习</Link
        >
      </li>
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://jcnf40n3hvft.feishu.cn/wiki/QPNewHcFAiUyjlkxPjucRDlZndf"
          >第五课：组合声韵调，读出汉字</Link
        >
      </li>
    </ul>

    <div class="flex"></div>
    <Subtitle text="相关链接" class="mb-2 mt-8"></Subtitle>
    <ul class="space-y-1.5 text-wheat-600">
      <li class="flex items-center gap-2">
        <i-mdi-link-variant /><Link
          href="https://github.com/Nang-muoi-sing/rime-hokchew"
          >榕拼输入法 Nang-muoi-sing/rime-hokchew | GitHub</Link
        >
      </li>
    </ul>

    <Subtitle text="修订纪要" class="mb-2 mt-8"></Subtitle>
    <ul class="list-disc space-y-1.5 px-5 text-wheat-600">
      <li>2024 年 11 月 30 日编撰《榕拼教程》第一版，作者子善</li>
    </ul>
  </PageContent>
</template>

<script setup lang="ts">
import PageContent from '../components/PageContent.vue';
import Link from '../components/common/Link.vue';
import Subtitle from '../components/common/Subtitle.vue';
</script>
