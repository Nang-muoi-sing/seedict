<template>
  <div class="w-full max-w-4xl space-y-4">
    <CollapsibleTitle
      title-tag="h3"
      title="没有使用过 RIME？试试全新安装！"
      :default-open="true"
      title-class="text-xl font-semibold text-rosybrown-800"
      content-class="ml-8 pt-3 text-base leading-8 text-wheat-700"
    >
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
            <ol
              v-if="freshInstallPlatform === 'windows'"
              class="list-decimal space-y-2 pl-5"
            >
              <li>
                下载安装包后双击打开，安装时可能会提示软件风险，确保安装包来自米时典官方，选择接受风险继续安装，根据提示完成安装过程。
              </li>
              <li>将系统输入法改为「小狼毫输入法」，就能使用福州话打字了。</li>
            </ol>

            <ol
              v-else-if="freshInstallPlatform === 'macos'"
              class="list-decimal space-y-2 pl-5"
            >
              <li>
                下载安装包并点击安装，由于安装包未签名，安装会出现弹窗提醒风险，请在确保安装包来自米时典官方后执行以下步骤：
                <ol class="pl-5 list-[lower-alpha]">
                  <li>
                    打开
                    <SeeKeycap label="系统设置" />
                    >
                    <SeeKeycap label="隐私与安全性" />
                    ，往下滑动看见
                    <SeeKeycap label="安全性" />
                    栏；
                  </li>
                  <li>
                    出现类似：已阻止「rime-hokchew-squirrel-x.x.x-unsigned.pkg」
                    使用；
                  </li>
                  <li>
                    点
                    <SeeKeycap label="仍要打开" />
                    后，输入密码或 Touch ID 确认；
                  </li>
                  <li>再次点击安装包即可进入安装流程，根据提示完成安装。</li>
                </ol>
              </li>
              <li>
                进入
                <SeeKeycap label="系统设置" />
                >
                <SeeKeycap label="键盘" />
                >
                <SeeKeycap label="文字输入" />
                ，
                <SeeKeycap label="编辑" />
                中，点击左下角
                <SeeKeycap label="+" />
                按钮添加输入法方案，找到鼠须管选择
                <SeeKeycap label="添加" />
                <SeeImage :src="macImeSelectionImg" class="mt-3 max-w-xl" />
              </li>
              <li>将设备输入法切换至鼠须管，就可以开始使用了。</li>
            </ol>

            <ol
              v-else-if="freshInstallPlatform === 'linux'"
              class="list-decimal space-y-2 pl-5"
            >
              <li>
                安装
                <Link href="https://github.com/ibus/ibus/wiki/Install">IBus</Link>
                或
                <Link href="https://fcitx-im.org/wiki/Install_Fcitx_5"
                  >Fcitx 5</Link
                >
                输入法后按挂载方式配置。
              </li>
            </ol>

            <ol v-else class="list-decimal space-y-2 pl-5">
              <li>
                安装<Link href="https://github.com/osfans/trime"
                  >同文安卓輸入法平臺</Link
                >后按挂载方式配置。
              </li>
            </ol>
          </div>
        </Transition>
      </div>
    </CollapsibleTitle>

    <CollapsibleTitle
      title-tag="h3"
      title="已经在用 RIME 了？开始挂载输入法配方"
      title-class="text-xl font-semibold text-rosybrown-800"
      content-class="ml-8 pt-3 text-base leading-8 text-wheat-700"
    >
      <div class="space-y-4">
        <SeeTabs v-model="mountInstallPlatform" :tabs="platformTabs" />

        <Transition
          mode="out-in"
          @enter="animateTabPanelEnter"
          @leave="animateTabPanelLeave"
        >
          <div
            :key="mountInstallPlatform"
            class="space-y-3 text-base leading-8 text-wheat-700"
          >
            <ol
              v-if="mountInstallPlatform === 'windows'"
              class="list-decimal space-y-2 pl-5"
            >
              <li><ImeDownloadStep /></li>
              <li>
                由小狼毫输入法的托盘图标进入
                <SeeKeycap label="用户文件夹" />
                ，将下载好的配方文件复制到该文件夹下。
                <SeeImage :src="winUserFolderImg" class="mt-3 max-w-xl" />
              </li>
              <li>
                由小狼毫输入法的托盘图标打开
                <SeeKeycap label="输入法设定" />
                ，勾选相应的福州话输入方案。
              </li>
              <li>
                再次点击小狼毫输入法的托盘图标，选择
                <SeeKeycap label="重新部署" />
                ，该步骤可能比较耗时，耐心等待其完成。
              </li>
              <li>切换到小狼毫输入法，可以使用福州话打字了！</li>
            </ol>

            <ol
              v-else-if="mountInstallPlatform === 'macos'"
              class="list-decimal space-y-2 pl-5"
            >
              <li><ImeDownloadStep /></li>
              <li>
                启用鼠须管后，在菜单栏中点击鼠须管输入法图标进入 RIME
                的用户配置目录。
              </li>
              <li>
                点击
                <SeeKeycap label="用户设定 " />
                弹出鼠须管配置文件夹，将下载好的配方文件复制到文件夹中。
              </li>
              <li>
                回到输入法托盘，点击
                <SeeKeycap label="重新部署" />
                或按下
                <SeeKeycap label="ctrl" />
                +
                <SeeKeycap label="option" />
                +
                <SeeKeycap label="`" />
                执行重新部署，就可以使用输入法了。
                <SeeImage :src="macUserFolderImg" class="mt-3 max-w-xs" />
              </li>
            </ol>

            <ol
              v-else-if="mountInstallPlatform === 'linux'"
              class="list-decimal space-y-2 pl-5"
            >
              <li><ImeDownloadStep /></li>
              <li>
                根据相应发行版的桌面框架选择并安装
                <Link href="https://github.com/ibus/ibus/wiki/Install">IBus</Link>
                或
                <Link href="https://fcitx-im.org/wiki/Install_Fcitx_5"
                  >Fcitx 5</Link
                >。
              </li>
              <li>
                IBus 的配置文件位于
                <SeeCode
                  code="~/.config/ibus/rime/default.custom.yaml"
                />，下载并复制配方文件：
                <SeeCodeBlock :code="ibusInstallCommand" />
              </li>
              <li>
                Fcitx5 的配置文件位于
                <SeeCode
                  code="~/.local/share/fcitx5/rime/default.custom.yaml"
                />，下载并复制配方文件：
                <SeeCodeBlock :code="fcitxInstallCommand" />
              </li>
              <li>
                若该配置文件不存在，则新建配置文件添加以下内容；若配置文件存在，可在配置文件中的
                <SeeCode code="schema_list" />
                节点下添加相启用的输入方案：
                <SeeCodeBlock :code="linuxCustomPatch" />
              </li>
              <li>
                完成后，选择托盘中的输入法图标，选择
                <SeeKeycap label="重新部署" />
                即可启用榕拼输入法。
              </li>
            </ol>

            <ol v-else class="list-decimal space-y-2 pl-5">
              <li><ImeDownloadStep /></li>
              <li>
                安卓端同文输入法的默认用户目录位于
                <SeeCode code="/storage/emulated/0/rime" />
                （常常显示为
                <SeeCode code="内部存储/rime" />
                或
                <SeeCode code="手机存储/rime" />
                ），需要使用文件传输或文件管理软件等方法将压缩包中的配方文件保存到该目录下。
              </li>
              <li>
                新建文件
                <SeeCode code="default.custom.yaml" />
                ，在文件中写入以下内容后移至相同的用户目录中；若配置文件存在，可在配置文件中的
                <SeeCode code="schema_list" />
                节点下添加相启用的输入方案：
                <SeeCodeBlock :code="androidCustomPatch" />
              </li>
              <li>
                打开同文输入法，点击应用中的
                <SeeKeycap label="部署" />
                ，部署完成后选择
                <SeeKeycap label="方案" />
                >
                <SeeKeycap label="启用方案" />
                ，就应当可以看见福州话输入法了，勾选需要的方案后就可以在手机上打字了。
              </li>
            </ol>
          </div>
        </Transition>
      </div>
    </CollapsibleTitle>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs';
import { ref, watch } from 'vue';
import macImeSelectionImg from '../assets/ime/mac-ime-selection.png';
import winUserFolderImg from '../assets/ime/win-user-folder.png';
import macUserFolderImg from '../assets/ime/mac-user-folder.png';
import CollapsibleTitle from './CollapsibleTitle.vue';
import ImeDownloadStep from './ImeDownloadStep.vue';
import SeeTabs from './seeui/tabs/SeeTabs.vue';
import SeeImage from './seeui/media/SeeImage.vue';
import SeeCode from './seeui/code/SeeCode.vue';
import SeeCodeBlock from './seeui/code/SeeCodeBlock.vue';
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
