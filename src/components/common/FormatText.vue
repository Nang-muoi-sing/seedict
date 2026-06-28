<template>
  <template
    v-for="(node, index) in parsedNodes"
    :key="`node_${index}_${node.type}`"
  >
    <span v-if="node.type === 'text'">{{ node.content }}</span>
    <span
      v-else-if="node.type === 'marked'"
      class="marked-char relative after:absolute after:-bottom-[0.1em] after:left-1/2 after:h-[0.2em] after:w-[0.2em] after:-translate-x-1/2 after:rounded-full after:content-['']"
      :class="markedClass"
    >
      {{ node.content }}
    </span>
    <span v-else-if="node.type === 'toggle'" class="toggle-char">
      <template
        v-for="(subNode, subIndex) in node.resolvedOptions[currentModeIndex]"
        :key="`sub_${index}_${subIndex}_${subNode.type}`"
      >
        <span v-if="subNode.type === 'text'">{{ subNode.content }}</span>
        <span
          v-else-if="subNode.type === 'marked'"
          class="marked-char relative after:absolute after:-bottom-[0.1em] after:left-1/2 after:h-[0.2em] after:w-[0.2em] after:-translate-x-1/2 after:rounded-full after:content-['']"
          :class="markedClass"
        >
          {{ subNode.content }}
        </span>
      </template>
    </span>
  </template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';
import {
  correctChinesePunctuation,
  correctChineseQuotes,
  correctChineseSpace,
  correctStops,
} from '../../utils/typography';

const correctionRulesMap = {
  quotes: correctChineseQuotes,
  punctuation: correctChinesePunctuation,
  space: correctChineseSpace,
  stops: correctStops,
} as const;

type TokenType = 'toggle' | 'marked';
interface StoredToken {
  type: TokenType;
  value: string;
  raw: string;
}

interface TokenFormatData {
  protectedText: string;
  tokenMap: Map<string, StoredToken>;
  correctedText: string;
}

type CorrectionRule = keyof typeof correctionRulesMap;
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  glyphMode: {
    type: String as PropType<'original' | 'canonical'>,
    default: 'canonical',
  },
  markedClass: {
    type: [String, Array, Object] as PropType<
      string | string[] | Record<string, boolean>
    >,
    default: 'after:bg-rosybrown-700',
  },
  correctionRules: {
    type: Array as PropType<CorrectionRule[]>,
    default: () => ['punctuation', 'space', 'stops'],
  },
});

const tokenFormatData = ref<TokenFormatData | null>(null);

const currentModeIndex = computed(() => {
  return props.glyphMode === 'original' ? 0 : 1;
});

const cacheKey = computed(() => {
  const rulesKey = props.correctionRules.join('|');
  return `${props.text || ''}|${rulesKey}`;
});

const getTokenFormatData = (): TokenFormatData => {
  const rawText = props.text?.trim() || '';
  let protectedText = '';
  let tokenMap = new Map<string, StoredToken>();
  let correctedText = '';

  if (rawText) {
    const result = protectTokens(rawText);
    protectedText = result.protectedText;
    tokenMap = result.tokenMap;
    correctedText = correctText(protectedText, props.correctionRules);
  }

  return { protectedText, tokenMap, correctedText };
};

onMounted(() => {
  tokenFormatData.value = getTokenFormatData();
});

watch(
  () => cacheKey.value,
  () => {
    tokenFormatData.value = getTokenFormatData();
  },
  { immediate: false, flush: 'post' }
);

const correctText = (text: string, rules: CorrectionRule[] = []): string => {
  if (!text || rules.length === 0) return text;
  return rules.reduce((res, rule) => {
    const fn = correctionRulesMap[rule];
    return fn ? fn(res) : res;
  }, text);
};

const generatePlaceholder = (index: number, type: TokenType) => {
  return `__FORMAT_${type}_${index}__`;
};

const protectTokens = (
  text: string
): { protectedText: string; tokenMap: Map<string, StoredToken> } => {
  const tokenMap = new Map<string, StoredToken>();
  let toggleIndex = 0;
  let markedIndex = 0;

  let protectedText = text.replace(/([^\s\\])\*/gu, (match, char) => {
    const placeholder = generatePlaceholder(markedIndex++, 'marked');
    tokenMap.set(placeholder, {
      type: 'marked',
      value: char,
      raw: match,
    });
    return placeholder;
  });

  protectedText = protectedText.replace(/\{[^{}]*,[^{}]*\}/gu, (match) => {
    const placeholder = generatePlaceholder(toggleIndex++, 'toggle');
    tokenMap.set(placeholder, {
      type: 'toggle',
      value: match.slice(1, -1),
      raw: match,
    });
    return placeholder;
  });

  return { protectedText, tokenMap };
};

const parseNestedPlaceholders = (
  text: string,
  tokenMap: Map<string, StoredToken>
) => {
  const nodes: Array<{ type: 'text' | 'marked'; content: string }> = [];
  const placeholderRegex = /__FORMAT_marked_\d+__/gu;
  let lastIndex = 0;

  text.replace(placeholderRegex, (match, index) => {
    if (index > lastIndex) {
      const plainText = text.slice(lastIndex, index);
      if (plainText) {
        nodes.push({ type: 'text', content: plainText });
      }
    }

    const token = tokenMap.get(match);
    if (token && token.type === 'marked') {
      nodes.push({ type: 'marked', content: token.value });
    }

    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    const plainText = text.slice(lastIndex);
    if (plainText) {
      nodes.push({ type: 'text', content: plainText });
    }
  }

  return nodes;
};

const parseProtectedText = (
  tokenMap: Map<string, StoredToken>,
  correctedText: string
) => {
  type ExtendedNode =
    | { type: 'text'; content: string }
    | { type: 'marked'; content: string }
    | {
        type: 'toggle';
        options: string[];
        resolvedOptions: Array<
          Array<{ type: 'text' | 'marked'; content: string }>
        >;
      };

  const nodes: ExtendedNode[] = [];
  const placeholderRegex = /__FORMAT_(toggle|marked)_\d+__/gu;
  let lastIndex = 0;

  correctedText.replace(placeholderRegex, (match, _type, index) => {
    if (index > lastIndex) {
      const plainText = correctedText.slice(lastIndex, index);
      if (plainText) {
        nodes.push({ type: 'text', content: plainText });
      }
    }

    const token = tokenMap.get(match);
    if (token) {
      if (token.type === 'toggle') {
        const options = token.value
          .split(',')
          .map((item: string) => item.trim());
        const validOptions =
          options.length >= 2 ? options.slice(0, 2) : [...options, ''];
        const resolvedOptions = validOptions.map((option) =>
          parseNestedPlaceholders(option, tokenMap)
        );

        nodes.push({
          type: 'toggle',
          options: validOptions,
          resolvedOptions: resolvedOptions,
        });
      } else if (token.type === 'marked') {
        nodes.push({ type: 'marked', content: token.value });
      }
    }

    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < correctedText.length) {
    const plainText = correctedText.slice(lastIndex);
    if (plainText) {
      nodes.push({ type: 'text', content: plainText });
    }
  }

  return nodes;
};

const parsedNodes = computed(() => {
  const rawText = props.text?.trim() || '';
  if (!rawText) return [];

  if (!tokenFormatData.value) {
    return [];
  }

  const { tokenMap, correctedText } = tokenFormatData.value;
  const nodes = parseProtectedText(tokenMap, correctedText);

  return nodes;
});
</script>
