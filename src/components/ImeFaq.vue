<template>
  <div
    class="mx-auto min-h-[30rem] w-full max-w-3xl space-y-3 md:min-h-[32rem]"
  >
    <AccordionItem
      class="faq-reveal-item"
      title="我打出来的是繁体字，可以用来打简体字吗？"
      :open="openItemId === 'simplified'"
      @toggle="toggleItem('simplified')"
    >
      <p>
        由于汉字简化中存在合并现象，使用简体字记录福州话词汇时容易产生歧义，因此词库与输入法默认使用繁体字。输入法内置了简易的繁简转换。默认可通过
        <SeeKeycap label="ctrl" />
        +
        <SeeKeycap label="shift" />
        +
        <SeeKeycap label="8" />
        开启简体转换。需要注意的是，自动转换的结果可能并非完全准确。
      </p>
    </AccordionItem>

    <AccordionItem
      class="faq-reveal-item"
      title="我不知道想打的字对应的榕拼，应该怎么办？"
      :open="openItemId === 'pronunciation'"
      @toggle="toggleItem('pronunciation')"
    >
      <ol class="list-decimal pl-4">
        <li>
          使用<Link :to="{ name: 'home' }" target="_blank">米时典</Link
          >查询目标汉字或词汇对应的榕拼。
        </li>
        <li>
          榕拼输入法内置了简单的反查功能。输入
          <SeeKeycap label="`" />
          +
          <SeeKeycap label="普通话拼音" />
          后，可以在候选框中查看对应的榕拼。
        </li>
      </ol>
    </AccordionItem>

    <AccordionItem
      class="faq-reveal-item"
      title="怎样切换不同的输入方案（汉字 / 榕拼 / 教罗）？"
      :open="openItemId === 'scheme'"
      @toggle="toggleItem('scheme')"
    >
      <ol class="list-decimal pl-4">
        <li>通过 RIME 的任务栏托盘打开设置菜单，切换到目标的输入方案。</li>
        <li>
          通过
          <SeeKeycap label="ctrl" />
          +
          <SeeKeycap label="`" />
          默认快捷键切换不同输入方案。
        </li>
      </ol>
    </AccordionItem>

    <AccordionItem
      class="faq-reveal-item"
      title="我使用的是 iOS，可以使用榕拼输入法吗？"
      :open="openItemId === 'ios'"
      @toggle="toggleItem('ios')"
    >
      <p>
        iOS 暂无开箱即用的榕拼输入法。由于榕拼输入法基于 Rime， 可以尝试通过 iOS
        上支持 Rime 的输入法应用（如「仓输入法」），
        以导入或挂载词表的方式使用榕拼词库。
      </p>
    </AccordionItem>

    <AccordionItem
      class="faq-reveal-item"
      title="输入法的词库会更新吗？我要怎么更新输入法？"
      :open="openItemId === 'update'"
      @toggle="toggleItem('update')"
    >
      <p>榕拼输入法由蓝尾星团队维护，不定期更新。</p>

      <ul class="list-disc pl-4">
        <li>
          若是由安装包通过全新安装方式安装榕拼输入法，可下载新版安装包并重新安装以完成更新。
        </li>
        <li>
          若是通过词表挂载方式使用榕拼输入法，可以使用最新的词表文件并重新挂载完成更新。
        </li>
      </ul>
    </AccordionItem>

    <AccordionItem
      class="faq-reveal-item"
      title="遇到了困难，哪里可以寻求帮助？"
      :open="openItemId === 'help'"
      @toggle="toggleItem('help')"
    >
      <p>欢迎加入用户群，获取其他用户和蓝尾星团队的帮助：</p>

      <ul class="ml-2 flex flex-wrap gap-x-8 gap-y-2">
        <li class="flex w-full flex-row items-center sm:w-auto">
          <div
            class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wheat-100"
          >
            <i-ic-round-wechat
              class="text-rosybrown-600"
              style="font-size: 14px"
            />
          </div>
          <Link href="https://mp.weixin.qq.com/s/A4jzfopKOv5G5yWXGdU4eQ"
            >公众号</Link
          >回复「读者群」
        </li>
        <li class="flex w-full flex-row items-center sm:w-auto">
          <div
            class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wheat-100"
          >
            <i-mdi-qqchat class="text-rosybrown-600" style="font-size: 14px" />
          </div>

          <Link
            href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=NNVJO0f4eJiMjmQUy_b4Xvg6aiMZ_VXl&authKey=NeoU1IUrn1TcBYBpZve%2FRU89U5C8cpgRu5uEVJvm3FdkuQuwDmXkHMNFL8TooZim&noverify=0&group_code=1055783953"
            >1055783953</Link
          >
        </li>
      </ul>

      <p>若需要反馈具体问题或提供建议，欢迎通过邮件与我们取得联系：</p>
      <ul class="ml-2 space-y-2">
        <li class="flex flex-row items-center">
          <div
            class="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wheat-100"
          >
            <i-material-symbols-mail-rounded
              class="text-rosybrown-600"
              style="font-size: 14px"
            />
          </div>
          <Link href="mailto:seedict@163.com">seedict@163.com</Link>
        </li>
      </ul>
    </AccordionItem>
    <p class="text-center text-base leading-8 text-wheat-700">
      还有其他问题？欢迎通过
      <Link
        href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnDacxwm61YL1ueYdv5Kdmjb"
        >提交表单</Link
      >
      向我们反馈
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccordionItem from './common/AccordionItem.vue';
import SeeKeycap from './seeui/keycap/SeeKeycap.vue';

const openItemId = ref<string | null>('simplified');

const toggleItem = (itemId: string) => {
  openItemId.value = openItemId.value === itemId ? null : itemId;
};
</script>
