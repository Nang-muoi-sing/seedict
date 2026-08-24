<template>
  <div class="w-full max-w-4xl space-y-4">
    <CollapsibleTitle
      title-tag="h3"
      :default-open="true"
      title-class="text-xl font-semibold text-rosybrown-800"
      content-class="pt-3 text-base leading-8 text-wheat-700 md:ml-4"
    >
      <template #title>
        没有使用过 RIME？试试<SeeHandUnderline>全新安装</SeeHandUnderline>！
      </template>
      <div class="space-y-4">
        <SeeTabs v-model="freshInstallPlatform" :tabs="platformTabs" />

        <Transition
          mode="out-in"
          @enter="animateTabPanelEnter"
          @leave="animateTabPanelLeave"
        >
          <div
            :key="freshInstallPlatform"
            class="space-y-3 text-base leading-8 text-wheat-700"
          >
            <div v-if="freshInstallPlatform === 'windows'" class="space-y-3">
              <p
                class="border-l-4 border-wheat-300 pl-3 text-sm leading-6 text-wheat-600"
              >
                <strong class="text-rosybrown-700">注：</strong>
                安装过程中，Windows
                可能会显示安全提示；请确认安装包来自米时典官方，再选择接受风险并继续安装
              </p>
              <ol class="list-decimal space-y-2 pl-5">
                <li>
                  RIME 在 Windows 平台的名称为「小狼毫」，榕拼输入法 Windows
                  版基于小狼毫构建
                </li>
                <li>
                  在本网站下载好安装包后双击运行，并按照安装程序的指示进行安装
                </li>
                <li>
                  安装完成后，将系统输入法切换为「小狼毫输入法」，即可使用福州话打字
                </li>
              </ol>
            </div>

            <div v-else-if="freshInstallPlatform === 'macos'" class="space-y-3">
              <p
                class="border-l-4 border-wheat-300 pl-3 text-sm leading-6 text-wheat-600"
              >
                <strong class="text-rosybrown-700">注：</strong
                ><strong>鼠须管要求 macOS 13 Ventura 或以上版本！</strong>
                由于安装包未经 Apple 签名，macOS
                可能会阻止安装；请确认安装包来自米时典官方，再打开
                <SeeKeycap label="系统设置" />
                >
                <SeeKeycap label="隐私与安全性" />
                ，在
                <SeeKeycap label="安全性" />
                栏中选择
                <SeeKeycap label="仍要打开" />
                ，使用密码或 Touch ID 确认后再次运行安装包
              </p>
              <ol class="list-decimal space-y-2 pl-5">
                <li>
                  RIME 在 macOS 平台的名称为「鼠须管」，榕拼输入法 macOS
                  版基于鼠须管构建
                </li>
                <li>
                  在本网站下载好安装包后双击运行，并按照安装程序的指示进行安装
                </li>
                <li>
                  进入
                  <SeeKeycap label="系统设置" />
                  >
                  <SeeKeycap label="键盘" />
                  >
                  <SeeKeycap label="文字输入" />
                  ，在
                  <SeeKeycap label="编辑" />
                  中点击左下角
                  <SeeKeycap label="+" />
                  按钮，找到鼠须管并选择
                  <SeeKeycap label="添加" />
                </li>
                <li>
                  安装完成后，将系统输入法切换为鼠须管，即可使用福州话打字
                </li>
              </ol>
              <SeeImage :src="macImeSelectionImg" class="mx-auto max-w-xl" />
            </div>

            <ol
              v-else-if="freshInstallPlatform === 'linux'"
              class="list-decimal space-y-2 pl-5"
            >
              <li>
                安装
                <Link href="https://github.com/ibus/ibus/wiki/Install"
                  >IBus</Link
                >
                或
                <Link href="https://fcitx-im.org/wiki/Install_Fcitx_5"
                  >Fcitx 5</Link
                >
                输入法后按挂载方式配置
              </li>
            </ol>

            <ol v-else class="list-decimal space-y-2 pl-5">
              <li>在本网站下载好安装包后点击运行，并按照安装指示完成安装</li>
              <li>
                点击安装后出现的「同文输入法」，按应用提示给予权限并启用输入法
              </li>
              <li>
                回到应用界面，选择
                <SeeKeycap label="方案" />，
                点击右上角的编辑按钮，关闭全部自带的输入方案，再点击界面右下角的添加按钮，勾选「榕拼输入法」并点击
                <SeeKeycap label="确认" />，就可以使用输入法打字了
                <div class="mt-3 grid gap-3 sm:grid-cols-2 sm:items-start">
                  <SeeImage
                    :src="androidImeSelectionImg"
                    class="mx-auto w-full max-w-64"
                  />
                  <SeeImage
                    :src="androidImeTypingImg"
                    class="mx-auto w-full max-w-64"
                  />
                </div>
              </li>

              <li>
                （可选）同文输入法内置的键盘样式不太容易使用，推荐<Link
                  href="https://tseing.ysepan.com/"
                  >下载</Link
                >安卓主题 <SeeCode code="lightbulb.zip" /> 并解压至用户目录（访问密码：seedict） 。
                安卓端同文输入法的默认用户目录位于
                <SeeCode code="/storage/emulated/0/rime" />
                （常常显示为
                <SeeCode code="内部存储/rime" />
                或
                <SeeCode code="手机存储/rime" />
                ）
              </li>
              <li>
                （可选）接着打开应用界面，
                <SeeKeycap label="键盘样式" /> > <SeeKeycap label="主题" /> >
                <SeeKeycap
                  label="日光灯（lightbulb）"
                />，套用该主题后能够在输入法中显示生僻汉字
              </li>
            </ol>
          </div>
        </Transition>
      </div>
    </CollapsibleTitle>

    <CollapsibleTitle
      title-tag="h3"
      title-class="text-xl font-semibold text-rosybrown-800"
      content-class="pt-3 space-y-4 text-base leading-8 text-wheat-700 md:ml-4"
    >
      <template #title>
        已经在用 RIME
        了？开始<SeeHandUnderline>挂载</SeeHandUnderline>输入法配方
      </template>
      <template #header>
        <SeeTabs v-model="mountInstallPlatform" :tabs="platformTabs" />
      </template>
      <Transition
        mode="out-in"
        @enter="animateTabPanelEnter"
        @leave="animateTabPanelLeave"
      >
        <div
          :key="mountInstallPlatform"
          class="space-y-3 text-base leading-8 text-wheat-700"
        >
          <ImeDownloadStep />

          <ol
            v-if="mountInstallPlatform === 'windows'"
            class="list-decimal space-y-2 pl-5"
          >
            <li>
              点击小狼毫输入法的托盘图标，选择
              <SeeKeycap label="用户文件夹" />
              ，将下载的配方文件复制到该文件夹的根目录
            </li>
            <li>
              再次点击托盘图标，选择
              <SeeKeycap label="输入法设定" />
              ，勾选需要的福州话输入方案
            </li>
            <li>
              再次点击托盘图标，选择
              <SeeKeycap label="重新部署" />
              ，并等待部署完成
            </li>
            <li>将系统输入法切换为「小狼毫输入法」，即可使用福州话打字</li>
          </ol>

          <ol
            v-else-if="mountInstallPlatform === 'macos'"
            class="list-decimal space-y-2 pl-5"
          >
            <li>
              点击菜单栏中的鼠须管图标，选择
              <SeeKeycap label="用户设定" />
              可打开 RIME 用户配置文件夹
            </li>
            <li>将下载的配方文件复制到该文件夹</li>
            <li>
              再次点击菜单栏中的鼠须管图标选择
              <SeeKeycap label="重新部署" />
              ，或按下
              <SeeKeycap label="ctrl" />
              +
              <SeeKeycap label="option" />
              +
              <SeeKeycap label="`" />
              ，并等待部署完成
            </li>
            <li>将系统输入法切换为「鼠须管」，即可使用福州话打字</li>
          </ol>

          <ol
            v-else-if="mountInstallPlatform === 'linux'"
            class="list-decimal space-y-2 pl-5"
          >
            <li>
              根据相应发行版的桌面框架选择并安装
              <Link href="https://github.com/ibus/ibus/wiki/Install">IBus</Link>
              或
              <Link href="https://fcitx-im.org/wiki/Install_Fcitx_5"
                >Fcitx 5</Link
              >
            </li>
            <li>
              若使用 IBus，将配方文件复制到
              <SeeCode code="~/.config/ibus/rime/default.custom.yaml" />：
              <SeeCodeBlock :code="ibusInstallCommand" />
            </li>
            <li>
              若使用 Fcitx 5，将配方文件复制到
              <SeeCode
                code="~/.local/share/fcitx5/rime/default.custom.yaml"
              />：
              <SeeCodeBlock :code="fcitxInstallCommand" />
            </li>
            <li>
              若配置文件不存在，则新建文件并添加以下内容；若配置文件已经存在，则在
              <SeeCode code="schema_list" />
              节点下添加需要启用的输入方案：
              <SeeCodeBlock :code="linuxCustomPatch" />
            </li>
            <li>
              完成后，点击托盘中的输入法图标，选择
              <SeeKeycap label="重新部署" />
              ，并等待部署完成
            </li>
          </ol>

          <ol v-else class="list-decimal space-y-2 pl-5">
            <li>
              安卓端同文输入法的默认用户目录位于
              <SeeCode code="/storage/emulated/0/rime" />
              （常常显示为
              <SeeCode code="内部存储/rime" />
              或
              <SeeCode code="手机存储/rime" />
              ），使用文件传输或文件管理软件将配方文件复制到该目录
            </li>
            <li>
              新建文件
              <SeeCode code="default.custom.yaml" />
              并写入以下内容；若配置文件已经存在，则在
              <SeeCode code="schema_list" />
              节点下添加需要启用的输入方案：
              <SeeCodeBlock :code="androidCustomPatch" />
            </li>
            <li>
              打开同文输入法，点击应用中的
              <SeeKeycap label="部署" />
              ；部署完成后，依次选择
              <SeeKeycap label="方案" />
              >
              <SeeKeycap label="启用方案" />
              ，勾选需要的福州话输入方案，即可使用福州话打字
            </li>
          </ol>

          <div
            v-if="
              mountInstallPlatform === 'windows' ||
              mountInstallPlatform === 'macos'
            "
            class="pt-1"
          >
            <SeeImage
              v-if="mountInstallPlatform === 'windows'"
              :src="winUserFolderImg"
              class="mx-auto max-w-xl"
            />
            <SeeImage
              v-else-if="mountInstallPlatform === 'macos'"
              :src="macUserFolderImg"
              class="mx-auto max-w-xs"
            />
          </div>
        </div>
      </Transition>
    </CollapsibleTitle>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs';
import { ref, watch } from 'vue';
import macImeSelectionImg from '../assets/ime/mac-ime-selection.png';
import androidImeSelectionImg from '../assets/ime/android-ime-selection.jpg';
import androidImeTypingImg from '../assets/ime/android-ime-typing.jpg';
import winUserFolderImg from '../assets/ime/win-user-folder.png';
import macUserFolderImg from '../assets/ime/mac-user-folder.png';
import CollapsibleTitle from './CollapsibleTitle.vue';
import ImeDownloadStep from './ImeDownloadStep.vue';
import SeeTabs from './seeui/tabs/SeeTabs.vue';
import SeeImage from './seeui/media/SeeImage.vue';
import SeeCode from './seeui/code/SeeCode.vue';
import SeeCodeBlock from './seeui/code/SeeCodeBlock.vue';
import SeeHandUnderline from './seeui/decor/SeeHandUnderline.vue';
import SeeKeycap from './seeui/keycap/SeeKeycap.vue';
import Link from './common/Link.vue';
import type { SeeTabItem } from './seeui/tabs/SeeTabs.vue';

type PlatformId = 'windows' | 'macos' | 'linux' | 'android';

interface Props {
  selectedPlatform?: PlatformId;
}

const props = withDefaults(defineProps<Props>(), {
  selectedPlatform: 'windows',
});

const platformTabs: SeeTabItem[] = [
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'android', label: 'Android' },
];

const ibusInstallCommand = `git clone -b release https://github.com/Nang-muoi-sing/rime-hokchew.git
cp -r rime-hokchew/* ~/.config/ibus/rime/
`;
const fcitxInstallCommand = `git clone -b release https://github.com/Nang-muoi-sing/rime-hokchew.git
cp -r rime-hokchew/* ~/.local/share/fcitx5/rime/
`;
const linuxCustomPatch = `patch:
  schema_list:
    - schema: hokchew
    - schema: hokchew_roma
    - schema: hokchew_yngping
`;
const androidCustomPatch = `schema_list:
  - schema: hokchew
  - schema: hokchew_roma
  - schema: hokchew_yngping
`;

const freshInstallPlatform = ref<PlatformId>(props.selectedPlatform);
const mountInstallPlatform = ref<PlatformId>(props.selectedPlatform);

watch(
  () => props.selectedPlatform,
  (platform) => {
    freshInstallPlatform.value = platform;
    mountInstallPlatform.value = platform;
  }
);

const animateTabPanelEnter = (el: Element, done: () => void) => {
  const panel = el as HTMLElement;
  panel.style.opacity = '0';
  panel.style.transform = 'translateY(8px)';

  animate(panel, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 220,
    easing: 'easeOutQuad',
    onComplete: done,
  });
};

const animateTabPanelLeave = (el: Element, done: () => void) => {
  const panel = el as HTMLElement;

  animate(panel, {
    opacity: [1, 0],
    translateY: [0, -4],
    duration: 140,
    easing: 'easeOutQuad',
    onComplete: done,
  });
};
</script>

<style scoped>
ol > li::marker {
  color: #c96f4a;
}
</style>
