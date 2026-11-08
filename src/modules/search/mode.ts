export type SearchMode = 'fuzzy' | 'yngping' | 'semantic';

interface SearchModeDefinition {
  label: string;
  shortLabel: string;
  placeholders: readonly string[];
}

export const searchModes = {
  fuzzy: {
    label: '按字词查',
    shortLabel: '字词',
    placeholders: [
      '天光',
      '小时候',
      '蓝尾星',
      '讲大话',
      '伓',
      '有时间',
      '会使',
      '半晡',
      '起动',
      '失眠',
      '拜托',
      '快活',
      '我各侬',
      '中秋节',
      '对手',
      '挂号信',
      '厝边',
    ],
  },
  yngping: {
    label: '按榕拼查',
    shortLabel: '榕拼',
    placeholders: ['a lai', 'sieh55 da53', 'ny33', 'huk ziu'],
  },
  semantic: {
    label: '按意思查',
    shortLabel: '语义',
    placeholders: [
      '红色的水果',
      '到处乱跑的人',
      '无法处理的复杂状况',
      '临行前的嘱咐',
      '东西找不到了',
      '明明知道却装不知道',
      '中秋节',
      '倒了大霉',
      '愉悦舒畅的心情',
      '秋高气爽',
      '顺利办成',
      '突然想起很久以前的事',
      '这下麻烦了',
      '事情的尾声',
      '勤俭持家',
      '天快黑但还没黑',
      '得心应手',
      '人多声音嘈杂',
      '夜长梦多',
      '一时想不起来',
    ],
  },
} satisfies Record<SearchMode, SearchModeDefinition>;

export const searchModeOrder = [
  'fuzzy',
  'yngping',
  'semantic',
] as const satisfies readonly SearchMode[];
