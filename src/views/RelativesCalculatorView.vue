<template>
  <PageContent :show-search-bar="false">
    <div>
      <div class="mb-5 flex flex-row text-4xl font-bold text-rosybrown-800">
        <RubyText
          :text="'称呼计算'"
          :yngping="'cing55 hu55 gie53 looung213'"
        ></RubyText>
      </div>
      <div class="space-y-2 text-sm font-semibold text-rosybrown-600">
        <p>
          不知道这位亲戚如何称呼？输入自身性别和亲属关系，快速为你匹配福州话中的对应亲属称呼。
        </p>
      </div>
    </div>

    <div class="mb-16 mt-5 rounded-2xl bg-white p-6">
      <div class="space-y-3">
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-rosybrown-600"
        >
          <div class="font-semibold text-rosybrown-600">我的性别：</div>
          <label class="flex items-center gap-2">
            <input
              v-model="relationSex"
              type="radio"
              :value="1"
              class="h-4 w-4 accent-rosybrown-600"
            />
            男
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="relationSex"
              type="radio"
              :value="0"
              class="h-4 w-4 accent-rosybrown-600"
            />
            女
          </label>
        </div>
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-rosybrown-600"
        >
          <div class="font-semibold text-rosybrown-600">称呼方式：</div>
          <label class="flex items-center gap-2">
            <input
              v-model="relationReverse"
              type="radio"
              :value="false"
              class="h-4 w-4 accent-rosybrown-600"
            />
            我称呼对方
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="relationReverse"
              type="radio"
              :value="true"
              class="h-4 w-4 accent-rosybrown-600"
            />
            对方称呼我
          </label>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-wheat-200 bg-white">
        <textarea
          v-model="relationText"
          rows="4"
          placeholder="称呼之间用「的」字分开..."
          class="w-full resize-none rounded-xl border-0 bg-transparent p-4 text-sm text-rosybrown-700 outline-none placeholder:text-wheat-600/50"
        ></textarea>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="item in relationQuickKeys"
          :key="item.label"
          type="button"
          :disabled="isRelationQuickKeyDisabled(item.label)"
          class="flex h-9 w-12 items-center justify-center rounded-md bg-wheat-100 text-sm font-semibold text-rosybrown-700"
          :class="{
            'hover:bg-wheat-200': !isRelationQuickKeyDisabled(item.label),
            'cursor-not-allowed opacity-50': isRelationQuickKeyDisabled(
              item.label
            ),
          }"
          @click="handleRelationQuickInsert(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-lg bg-wheat-300 px-6 py-2 text-sm font-semibold text-white hover:bg-wheat-400"
          @click="handleRelationBackspace"
        >
          回退
        </button>
        <button
          type="button"
          class="rounded-lg bg-rosybrown-300 px-6 py-2 text-sm font-semibold text-white hover:bg-rosybrown-400"
          @click="handleRelationClear"
        >
          清空
        </button>
        <button
          type="button"
          class="rounded-lg bg-wheat-600 px-6 py-2 text-sm font-semibold text-white hover:bg-wheat-700"
          @click="handleRelationCalculate"
        >
          计算
        </button>
      </div>

      <div class="mt-6 text-sm font-semibold text-rosybrown-600">
        计算结果：
      </div>
      <div
        class="mt-2 min-h-[160px] rounded-xl border border-wheat-200 bg-white p-4 text-sm text-rosybrown-700"
      >
        <div v-if="relationHasError" class="text-rosybrown-600">
          {{ relationError }}
        </div>
        <div v-else-if="relationHasResult">
          <div class="space-y-4">
            <div
              v-for="(group, index) in relationDisplayGroups"
              :key="`${group.mandarin}-${index}`"
              :class="{ 'border-t border-wheat-100 pt-4': index > 0 }"
            >
              <div class="text-xs font-semibold text-wheat-500">普通话称呼</div>
              <div class="mt-1 text-lg font-semibold text-rosybrown-800">
                {{ group.mandarin }}
              </div>
              <div v-if="group.items.length === 0" class="mt-2 text-wheat-500">
                😮 关系有些复杂，我们还不知道怎么称呼伊
              </div>
              <div v-else class="mt-2 space-y-2">
                <div
                  v-for="item in group.items"
                  :key="`${group.mandarin}-${item.name}-${item.reading}`"
                  class="flex items-center justify-between rounded-lg bg-wheat-50 px-3 py-2"
                >
                  <div class="flex items-baseline">
                    <RouterLink
                      v-if="item.wordId"
                      :to="{ name: 'word', query: { w: item.wordId } }"
                    >
                      <div
                        class="whitespace-normal break-all text-xl font-bold text-rosybrown-800"
                      >
                        <RubyText
                          :text="item.name"
                          :yngping="item.reading"
                        ></RubyText>
                      </div>
                    </RouterLink>
                    <div
                      v-else
                      class="whitespace-normal break-all text-xl font-bold text-rosybrown-800"
                    >
                      <RubyText
                        :text="item.name"
                        :yngping="item.reading"
                      ></RubyText>
                    </div>
                    <span
                      v-if="item.isOutdated"
                      class="cursor-pointer"
                      :data-tooltip-target="`tooltip-${item.name}-${item.reading}-isOutdated`"
                    >
                      〈旧〉
                    </span>
                    <span class="w-3" v-else></span>
                    <InfoTooltip
                      :id="`tooltip-${item.name}-${item.reading}-isOutdated`"
                    >
                      旧称呼，如今已经很少使用
                    </InfoTooltip>
                    <template v-if="item.type != 'formal'">
                      <Badge
                        :data-tooltip-target="`tooltip-${item.name}-${item.reading}-type`"
                        class="cursor-pointer"
                        >{{ getTermTypeLabel(item.type) }}</Badge
                      >
                      <InfoTooltip
                        :id="`tooltip-${item.name}-${item.reading}-type`"
                      >
                        {{ getTermTypeTooltip(item.type) }}
                      </InfoTooltip></template
                    >

                    <span v-if="item.region">（{{ item.region }}）</span>
                  </div>
                  <button
                    type="button"
                    :disabled="!item.audioUrls.length"
                    class="flex items-center gap-1 text-wheat-400"
                    :class="{
                      'cursor-not-allowed opacity-60': !item.audioUrls.length,
                      'text-rosybrown-600 hover:text-rosybrown-700':
                        item.audioUrls.length,
                    }"
                    @click="handleRelationPlay(item.audioUrls)"
                  >
                    <i-material-symbols-play-circle-rounded class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-wheat-500">暂无结果。</div>
      </div>
    </div>
    <div class="mt-6 text-center text-sm text-wheat-400">
      希望改善功能？可以尝试<a
        href="https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnfDrtD7nlpJdryFlYFUU3Lf"
        target="_blank"
        class="underline underline-offset-4 transition-all hover:text-wheat-600"
        >向我们反馈</a
      >
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import { initTooltips } from 'flowbite';
import relationship from 'relationship.js';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Badge from '../components/common/Badge.vue';
import RubyText from '../components/common/RubyText.vue';
import InfoTooltip from '../components/tooltip/SeeTooltip.vue';
import PageContent from '../components/PageContent.vue';
import { getFuzhouTerms } from '../utils/relationshipMapping';

const relationText = ref('');
const relationSex = ref<0 | 1>(1);
const relationReverse = ref(false);

const relationQuickKeys = [
  { label: '父', value: '爸爸' },
  { label: '母', value: '妈妈' },
  { label: '夫', value: '老公' },
  { label: '妻', value: '老婆' },
  { label: '兄', value: '哥哥' },
  { label: '弟', value: '弟弟' },
  { label: '姐', value: '姐姐' },
  { label: '妹', value: '妹妹' },
  { label: '子', value: '儿子' },
  { label: '女', value: '女儿' },
] as const;

const relationUiToQuerySegmentMap: Record<string, string> = {
  爸爸: '父',
  妈妈: '母',
  老公: '夫',
  老婆: '妻',
  哥哥: '兄',
  弟弟: '弟',
  姐姐: '姐',
  妹妹: '妹',
  儿子: '子',
  女儿: '女',
};

const relationQueryToUiSegmentMap = Object.fromEntries(
  Object.entries(relationUiToQuerySegmentMap).map(([ui, query]) => [query, ui])
) as Record<string, string>;

type Gender = 'male' | 'female';
type RelationQuickValue = (typeof relationQuickKeys)[number]['value'];

const maleQuickKeyLabels = new Set(['父', '夫', '兄', '弟', '子']);
const femaleQuickKeyLabels = new Set(['母', '妻', '姐', '妹', '女']);
const maleRelationTerms = new Set<RelationQuickValue>(
  relationQuickKeys
    .filter((item) => maleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);
const femaleRelationTerms = new Set(
  relationQuickKeys
    .filter((item) => femaleQuickKeyLabels.has(item.label))
    .map((item) => item.value)
);

type RelationResult = { mandarins: string[] } | { error: string };

const relationResult = ref<RelationResult | null>(null);
const route = useRoute();
const router = useRouter();
const isSyncingRouteState = ref(false);
const shouldRestoreResult = ref(false);
const relationAudioBaseUrl = `${import.meta.env.VITE_OSS_URL}/audio/relatives`;

const getTermTypeLabel = (type: 'formal' | 'back' | 'child'): string => {
  return { formal: '面称', back: '背称', child: '儿语' }[type];
};

const getTermTypeTooltip = (type: 'formal' | 'back' | 'child'): string => {
  return {
    formal: '当面称呼，直面称呼，面称一般都可以背称',
    back: '背后称呼，向第三方提及此人，背称未必可以面称',
    child: '儿时的说话习惯，模仿小孩的称呼',
  }[type];
};

const isErrorResult = (
  value: RelationResult | null
): value is { error: string } => !!value && 'error' in value;

const isSuccessResult = (
  value: RelationResult | null
): value is { mandarins: string[] } => !!value && 'mandarins' in value;

const relationHasError = computed(() => isErrorResult(relationResult.value));
const relationHasResult = computed(() => isSuccessResult(relationResult.value));
const relationError = computed(() =>
  isErrorResult(relationResult.value) ? relationResult.value.error : ''
);
const relationMandarins = computed(() =>
  isSuccessResult(relationResult.value) ? relationResult.value.mandarins : []
);

const relationDisplayGroups = computed(() => {
  if (!relationHasResult.value) return [];
  return relationMandarins.value.map((mandarin) => {
    const terms = getFuzhouTerms(mandarin);
    return {
      mandarin,
      items: terms.map((term) => ({
        ...term,
        audioUrls: buildFuzhouAudioUrls(term.reading),
      })),
    };
  });
});

const buildFuzhouAudioUrls = (reading: string): string[] => {
  if (!reading) return [];
  const readings = reading
    .split('/')
    .map((item) => item.replace(/\s+/g, '').trim())
    .filter(Boolean);
  return readings.map(
    (item) =>
      `${relationAudioBaseUrl}/${encodeURIComponent(item.toLowerCase())}.mp3`
  );
};

const calculateMandarinRelations = (text: string) => {
  const results = relationship({
    text,
    sex: relationSex.value,
    reverse: relationReverse.value,
  });
  console.log(results);
  if (!Array.isArray(results)) return [];
  return [...new Set(results.map((item) => item.trim()).filter(Boolean))];
};

const getQueryValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

const normalizeRelationForQuery = (text: string) => {
  return text
    .split('的')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => relationUiToQuerySegmentMap[item] ?? item)
    .join('的');
};

const restoreRelationFromQuery = (text: string) => {
  return text
    .split('的')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => relationQueryToUiSegmentMap[item] ?? item)
    .join('的');
};

const buildRelationQuery = () => {
  const query: Record<string, string> = {};
  const trimmed = relationText.value.trim();
  const relationQueryText = normalizeRelationForQuery(trimmed);

  if (relationQueryText) query.relation = relationQueryText;
  if (relationSex.value === 0) query.sex = '0';
  if (relationReverse.value) query.reverse = '1';
  if (shouldRestoreResult.value) query.calc = '1';

  return query;
};

const syncRelationQuery = () => {
  if (isSyncingRouteState.value) return;
  const nextQuery = buildRelationQuery();
  router.replace({ name: 'relatives-calculator', query: nextQuery });
};

const hydrateRelationStateFromQuery = () => {
  isSyncingRouteState.value = true;
  relationText.value = restoreRelationFromQuery(
    getQueryValue(route.query.relation)
  );
  relationSex.value = getQueryValue(route.query.sex) === '0' ? 0 : 1;
  relationReverse.value = getQueryValue(route.query.reverse) === '1';
  shouldRestoreResult.value = getQueryValue(route.query.calc) === '1';
  isSyncingRouteState.value = false;

  if (shouldRestoreResult.value) {
    handleRelationCalculate(false);
  }
};

const isRelationQuickKeyDisabled = (label: string) => {
  const trimmed = relationText.value.trim();
  const segments = trimmed.split('的').filter(Boolean);
  const lastSegment = segments.length ? segments[segments.length - 1] : '';

  let gender: Gender = relationSex.value === 1 ? 'male' : 'female';

  if (lastSegment) {
    if (maleRelationTerms.has(lastSegment as RelationQuickValue))
      gender = 'male';
    else if (femaleRelationTerms.has(lastSegment as RelationQuickValue))
      gender = 'female';
    else return false;
  }

  if (label === '夫') return gender === 'male';
  if (label === '妻') return gender === 'female';
  return false;
};

const handleRelationQuickInsert = (name: string) => {
  const trimmed = relationText.value.trim();
  relationText.value = trimmed ? `${trimmed}的${name}` : name;
};

const handleRelationBackspace = () => {
  const segments = relationText.value.trim().split('的');
  segments.pop();
  relationText.value = segments.join('的');
};

const handleRelationClear = () => {
  relationText.value = '';
  relationResult.value = null;
  shouldRestoreResult.value = false;
  syncRelationQuery();
};

const handleRelationCalculate = (syncOrEvent?: boolean | Event) => {
  const shouldSyncUrl = syncOrEvent !== false;
  const trimmed = relationText.value.trim();

  let mandarins = calculateMandarinRelations(trimmed);
  if (!mandarins.length) {
    relationResult.value = { error: '未找到结果。' };
    shouldRestoreResult.value = true;
    if (shouldSyncUrl) syncRelationQuery();
    return;
  }

  relationResult.value = { mandarins };
  shouldRestoreResult.value = true;

  if (shouldSyncUrl) {
    syncRelationQuery();
  }
};

const playRelationAudio = (audioUrls: string[], index = 0) => {
  if (index >= audioUrls.length) return;
  const audio = new Audio(audioUrls[index]);
  audio.addEventListener(
    'error',
    () => playRelationAudio(audioUrls, index + 1),
    { once: true }
  );
  audio.play().catch((err) => console.error('播放失败:', err));
};

const handleRelationPlay = (audioUrls: string[]) => {
  if (audioUrls.length) playRelationAudio(audioUrls);
};

watch(
  () => route.query,
  () => hydrateRelationStateFromQuery(),
  { immediate: true }
);

watch(
  () => relationResult.value,
  () => {
    setTimeout(() => initTooltips(), 0);
  }
);
</script>
