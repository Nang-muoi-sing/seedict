<template>
  <PageContent :show-search-bar="false">
    <div class="h-fill flex">
      <LetterPaper>
        <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
          <RubyText :text="'关于'" :yngping="'guang55 y55'"></RubyText>
        </div>

        <div class="space-y-2 text-sm font-semibold text-rosybrown-600">
          <p>每个人都有珍藏的平话故事：</p>
          <p>
            或许是儿时在公奶身边绕膝唱的月光光；或许是记忆中窗前吆喝着担过的鱼丸汤；或许是母语意识下一次次对身份的叩问；或许是千里外的乡音将思绪牵回到故乡……
          </p>
        </div>
        <h3
          class="mb-2 mt-5 text-lg font-bold text-wheat-600 before:content-['■']"
        >
          你是否意识到？
        </h3>
        <div class="space-y-2 text-sm text-wheat-600">
          <p>
            平话不仅是一种语言，同时是这座城市记忆与情感的载体，跨越世代建立起理解和共鸣的桥梁。这方水土养出的腔调，藏着我们未说尽的乡愁。它不该是博物馆里蒙尘的标本，而是深深烙印在每一代人心底里的独特记忆。榕城日新月异，而陪伴这座城市相生相长的平话却渐渐少了声响。正因为抱着让平话在新时代依然保持鲜活可亲的共同信念，我们聚集在一起，《米时典》也便有了诞生的理由。
          </p>
          <p>
            ——我们希望使用平话和喜欢平话的人们通过《米时典》增加对平话的认识、规范平话文字的使用，让平话能继续被使用、被传递、被热爱。
          </p>
        </div>
      </LetterPaper>
      <div class="w-30 mt-2 bg-wheat-100 xl:hidden"></div>
    </div>
    <div class="ml-2 bg-wheat-100 px-10 py-3 text-sm text-wheat-600 xl:hidden">
      *「
      <RubyText :text="'平话'" :yngping="'bang21 ua242'"></RubyText>
      」是闽东一带人们对于自己母语的称呼，意思是「听得懂」的语言。
    </div>

    <div class="relative hidden xl:block">
      <img
        class="absolute -left-72 -top-36 min-w-60 max-w-60"
        src="../assets/memo-bangua.webp"
      />
    </div>

    <Subtitle text="沿革" class="mb-2 mt-8"></Subtitle>
    <div class="mx-2 text-wheat-600">
      <p>
        《米时典》（SeeDict）是一款面向大众的、具有公益性质的线上平话词典，目前由蓝尾星团队维护。《米时典》继承了原《榕典》的平话数据，并在此基础上加以更新和扩展，截至
        2025 年 9 月 15 日已收录 20,000+ 条平话词条（字、词、俗语）、50,000+
        条读音（榕拼）、4,000+ 条本站释义。
      </p>

      <DashboardCard></DashboardCard>

      <p>
        目前《米时典》支持简、繁体搜索，词汇页提供所选词条的注音、用字、释义三个维度信息。计划未来推出榕拼搜索、字词发音等功能，与此同时，《米时典》的小程序也正在陆续筹备中。
      </p>
    </div>
    <Timeline></Timeline>
    <Subtitle text="愿景" class="mb-2 mt-8"></Subtitle>
    <div class="mx-2 text-wheat-600">
      <div class="flex flex-row justify-between space-x-5">
        <div class="flex-2 content-end">
          <img class="mb-5" src="../assets/seedict-names.webp" />
        </div>
        <SpeechBubbles class="flex-3"></SpeechBubbles>
      </div>

      <p>
        在上线之初，就已经有朋友给我们取了许多「爱称」，不论是「糍粑典」还是「团子典」，我们全部欣然接受。我们团队中的每个人对「米时典」都有着自己的理解，我们也希望这个称呼能在众人心中生长出独属于自己的诠释——只有具有大家的关注、参与与守护，平话的保育事业才能走得更久、行得更远……
      </p>
    </div>

    <Subtitle text="联系" class="mb-2 mt-8"></Subtitle>
    <div class="mx-2 text-wheat-600"><ContactCard></ContactCard></div>

    <Subtitle text="致谢" class="mb-2 mt-8"></Subtitle>
    <ul class="list-disc space-y-1.5 px-5 text-wheat-600">
      <li>感谢每位选择《米时典》的用户</li>
      <li>
        感谢<span class="border-[1px] border-wheat-600 px-0.5">陈泽平</span
        >老师与冯爱珍老师慷慨授权使用其著作数据
      </li>
      <li>
        感谢「福老爷」<span class="border-[1px] border-wheat-600 px-0.5"
          >林圜</span
        >先生曾经提供的帮助
      </li>
      <li>感谢福州厝边公司曾经提供的帮助</li>
      <li>感谢真鸟囝团队和《榕典》为平话保育做出的探索和贡献</li>
      <li>
        感谢《<Link href="https://fzcuo.com/">福州老建筑百科</Link
        >》薛纪天提供的帮助
      </li>
      <li>感谢大秀为《米时典》提供的精心美术设计与支持</li>
      <li>感谢所有参与文本数位化工作志愿者的无私奉献</li>
      <li>特别感谢 Hector 大黑对文献数位化的贡献</li>
      <li>最后感谢所有关心、热心与支持平话保育事业的人们</li>
    </ul>
  </PageContent>
  <SeeModal :show="isModalOpen" @blur="isModalOpen = false"></SeeModal>
  <SeeButton @click="isModalOpen = true" variant="outline">内容</SeeButton>
</template>

<script setup lang="ts">
import ContactCard from '../components/ContactCard.vue';
import DashboardCard from '../components/DashboardCard.vue';
import LetterPaper from '../components/LetterPaper.vue';
import PageContent from '../components/PageContent.vue';
import SpeechBubbles from '../components/SpeechBubbles.vue';
import Timeline from '../components/Timeline.vue';
import Link from '../components/common/Link.vue';
import RubyText from '../components/common/RubyText.vue';
import Subtitle from '../components/common/Subtitle.vue';
import SeeModal from '../components/modal/SeeModal.vue';
import SeeButton from '../components/button/SeeButton.vue';
import { ref } from 'vue';
const isModalOpen = ref(false);
</script>
