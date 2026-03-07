<template>
  <div class="min-h-screen p-10">
    <h1 class="mb-10 text-3xl font-bold text-rosybrown-800">
      SeeDict 组件预览
    </h1>

    <div class="grid grid-cols-1 gap-12">
      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeButton
        </h2>
        <div class="flex flex-wrap items-center gap-4">
          <SeeButton label="Primary" variant="primary" size="lg" />
          <SeeButton label="Secondary" variant="secondary" size="lg" />
          <SeeButton label="Outline" variant="outline" size="lg" />
          <SeeButton :icon="IMdiGithub" label="With Icon" size="lg" />
          <SeeButton label="Loading" loading size="lg" />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <SeeButton label="Primary" variant="primary" />
          <SeeButton label="Secondary" variant="secondary" />
          <SeeButton label="Outline" variant="outline" />
          <SeeButton :icon="IMdiGithub" label="With Icon" />
          <SeeButton label="Loading" loading />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <SeeButton label="Primary" variant="primary" size="sm" />
          <SeeButton label="Secondary" variant="secondary" size="sm" />
          <SeeButton label="Outline" variant="outline" size="sm" />
          <SeeButton :icon="IMdiGithub" label="With Icon" size="sm" />
          <SeeButton label="Loading" loading size="sm" />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeIconButton
        </h2>
        <div class="flex flex-wrap items-center gap-4">
          <SeeIconButton :icon="IMdiGithub" variant="primary" size="lg" />
          <SeeIconButton :icon="IMdiGithub" variant="secondary" size="lg" />
          <SeeIconButton :icon="IMdiGithub" variant="outline" size="lg" />
          <SeeIconButton loading size="lg" />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <SeeIconButton :icon="IMdiGithub" variant="primary" />
          <SeeIconButton :icon="IMdiGithub" variant="secondary" />
          <SeeIconButton :icon="IMdiGithub" variant="outline" />
          <SeeIconButton :icon="IMdiGithub" loading />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <SeeIconButton :icon="IMdiGithub" variant="primary" size="sm" />
          <SeeIconButton :icon="IMdiGithub" variant="secondary" size="sm" />
          <SeeIconButton :icon="IMdiGithub" variant="outline" size="sm" />
          <SeeIconButton :icon="IMdiGithub" loading size="sm" />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeModal
        </h2>
        <SeeButton label="测试弹窗" @click="isModalOpen = true" />
        <SeeModal :show="isModalOpen" @blur="isModalOpen = false">
          <div class="rounded-2xl bg-white p-6 shadow-xl">
            <p class="text-rosybrown-800">这是一个调试中的弹窗内容</p>
            <SeeButton class="mt-4" label="关闭" @click="isModalOpen = false" />
          </div>
        </SeeModal>
      </section>

      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeSwitch
        </h2>
        <div class="space-y-6 p-4">
          <SeeSwitch v-model="isChoiceAEnabled"> 选项 A </SeeSwitch>
          <SeeSwitch v-model="isChoiceBEnabled"> 选项 B </SeeSwitch>
          <SeeSwitch v-model="isChoiceCEnabled" disabled> 选项 C </SeeSwitch>
          <SeeSwitch v-model="isChoiceDEnabled" disabled> 选项 C </SeeSwitch>
          <p class="font-mono text-rosybrown-500">
            Status: Choice A ({{ isChoiceAEnabled }}) | Choice B ({{
              isChoiceBEnabled
            }}) | Choice C ({{ isChoiceCEnabled }}) | Choice D ({{
              isChoiceDEnabled
            }})
          </p>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeSwitchCard
        </h2>
        <div class="w-96 space-y-6 p-4">
          <SeeSwitchCard
            v-model="cardChoices.choiceA"
            title="选项 A"
            description="Receive notifications when focus mode is enabled or disabled."
          />
          <SeeSwitchCard
            v-model="cardChoices.choiceB"
            title="选项 B"
            description="Focus is shared across devices, and turns off when you leave the
              app."
          />
          <SeeSwitchCard
            v-model="cardChoices.choiceC"
            title="选项 C"
            description="Receive notifications when focus mode is enabled or disabled."
            disabled
          />
          <SeeSwitchCard
            v-model="cardChoices.choiceD"
            title="选项 D"
            description="Focus is shared across devices, and turns off when you leave the
              app."
            disabled
          />
        </div>
        <p class="font-mono text-rosybrown-500">
          Status: Choice A ({{ cardChoices.choiceA }}) | Choice B ({{
            cardChoices.choiceB
          }}) | Choice C ({{ cardChoices.choiceC }}) | Choice D ({{
            cardChoices.choiceD
          }})
        </p>
      </section>

      <!-- <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeTooltip
        </h2>
        <div class="flex flex-wrap items-center gap-4">
          <SeeButton data-tooltip-target="tooltip-top" label="Tooltip Top" />
          <SeeTooltip id="tooltip-top" placement="top"> Top </SeeTooltip>

          <SeeButton
            data-tooltip-target="tooltip-bottom"
            label="Tooltip Bottom"
          />
          <SeeTooltip id="tooltip-bottom" placement="bottom">
            Bottom
          </SeeTooltip>

          <SeeButton data-tooltip-target="tooltip-left" label="Tooltip Left" />
          <SeeTooltip id="tooltip-left" placement="left"> Left </SeeTooltip>

          <SeeButton
            data-tooltip-target="tooltip-right"
            label="Tooltip Right"
          />
          <SeeTooltip id="tooltip-right" placement="right"> Right </SeeTooltip>
        </div>
      </section> -->

      <section class="space-y-4">
        <h2 class="border-b pb-2 text-xl font-semibold text-rosybrown-600">
          SeeToast
        </h2>
        <div class="flex flex-wrap items-center gap-4">
          <SeeButton label="成功提示" @click="toast.success('操作已成功！')" />
          <SeeButton
            variant="secondary"
            label="错误提示"
            @click="toast.error('系统开小差了...')"
          />
          <SeeButton
            variant="outline"
            label="信息提示"
            @click="toast.info('操作信息')"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IMdiGithub from '~icons/mdi/github';
import SeeButton from '../components/seeui/button/SeeButton.vue';
import SeeIconButton from '../components/seeui/button/SeeIconButton.vue';
import SeeModal from '../components/seeui/modal/SeeModal.vue';
import SeeSwitch from '../components/seeui/switch/SeeSwitch.vue';
import SeeSwitchCard from '../components/seeui/switch/SeeSwitchCard.vue';
import SeeTooltip from '../components/seeui/tooltip/SeeTooltip.vue';
import { toast } from '../utils/toast';

const isModalOpen = ref(false);
const isChoiceAEnabled = ref(true);
const isChoiceBEnabled = ref(false);
const isChoiceCEnabled = ref(true);
const isChoiceDEnabled = ref(false);
const cardChoices = ref({
  choiceA: true,
  choiceB: false,
  choiceC: true,
  choiceD: false,
});
const successToast = ref();
const errorToast = ref();
const infoToast = ref();
</script>
