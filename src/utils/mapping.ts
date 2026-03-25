export const TONES = [
  '', // 无固定声调，对应花括号标记
  '0',
  '21',
  '24',
  '242',
  '33',
  '5',
  '53',
  '55',
] as const;
export type Tone = (typeof TONES)[number];
export enum ToneCategory {
  Yinping = '阴平',
  Yangping = '阳平',
  Shang = '上',
  YingQu = '阴去',
  YangQu = '阳去',
  YinRu = '阴入',
  YangRu = '阳入',
}

interface ToneSchema {
  category: ToneCategory | null;
  ipa: string;
}

export const TONE_DETAILS: Record<Tone, ToneSchema> = {
  '': { category: null, ipa: '' },
  '0': { category: null, ipa: '' },
  '55': { category: ToneCategory.Yinping, ipa: '˥˥' },
  '53': { category: ToneCategory.Yangping, ipa: '˥˧' },
  '33': { category: ToneCategory.Shang, ipa: '˧˧' },
  '21': { category: ToneCategory.YingQu, ipa: '˨˩' },
  '242': { category: ToneCategory.YangQu, ipa: '˨˦˨' },
  '24': { category: ToneCategory.YinRu, ipa: '˧˥' },
  '5': { category: ToneCategory.YangRu, ipa: '˥' },
} as const;

export type Glide = 'i' | 'u' | 'y' | '';

interface GlideSchema {
  cursive: string;
  ipa: string;
}

const GLIDE_DETAILS: Record<Glide, GlideSchema> = {
  i: { cursive: 'i', ipa: 'i' },
  u: { cursive: 'u', ipa: 'u' },
  y: { cursive: 'ü', ipa: 'y' },
  '': { cursive: '', ipa: '' },
};

// prettier-ignore
export type Nucleus =
  | 'a'   | 'e'   | 'o'   | 'oo'  | 'i'   | 'u'  | 'y'  | 'eo' // 单元音
  | 'au'  | 'eu'  | 'iu'  | 'ai'  | 'ui'  | 'ei' | 'ou' | 'eoy' | 'ooy' | 'uo'  | 'yo'  | 'oi' | 'oou' // 复合元音
  | ''; // 声化韵

export const VOWELS = ['a', 'e', 'o', 'oo', 'i', 'u', 'y', 'eo', 'ng'] as const;
export type Vowels = (typeof VOWELS)[number];

interface NucleusSchema {
  peak: Vowels;
  cursive: string;
  ipa: string;
}

// prettier-ignore
export const NUCLEUS_DETAILS: Record<Nucleus, NucleusSchema> = {
  a:   { peak: 'a',  cursive: '~',  ipa: 'a',  },
  e:   { peak: 'e',  cursive: '~',  ipa: 'e',  },
  o:   { peak: 'o',  cursive: '~',  ipa: 'o',  },
  oo:  { peak: 'oo', cursive: '~',  ipa: 'ɒ',  },
  i:   { peak: 'i',  cursive: '~',  ipa: 'i',  },
  u:   { peak: 'u',  cursive: '~',  ipa: 'u',  },
  y:   { peak: 'y',  cursive: '~',  ipa: 'y',  },
  eo:  { peak: 'eo', cursive: '~',  ipa: 'ø',  },
  au:  { peak: 'a',  cursive: '~u', ipa: 'au', },
  eu:  { peak: 'e',  cursive: '~u', ipa: 'eu', },
  iu:  { peak: 'i',  cursive: '~u', ipa: 'iu', },
  ai:  { peak: 'a',  cursive: '~i', ipa: 'ai', },
  ui:  { peak: 'u',  cursive: '~i', ipa: 'ui', },
  ei:  { peak: 'e',  cursive: '~i', ipa: 'ei', },
  ou:  { peak: 'o',  cursive: '~u', ipa: 'ou', },
  eoy: { peak: 'eo', cursive: '~ü', ipa: 'øy', },
  ooy: { peak: 'oo', cursive: '~ü', ipa: 'ɒy', },
  uo:  { peak: 'u',  cursive: '~o', ipa: 'uo', },
  yo:  { peak: 'y',  cursive: '~o', ipa: 'yo', },
  oi:  { peak: 'o',  cursive: '~i', ipa: 'oi', },
  oou: { peak: 'oo', cursive: '~y', ipa: 'ɒu', },
  '':  { peak: 'ng', cursive: '~',  ipa: 'ŋ̍',  },  // 声化韵是特例
} as const;

type VowelToneKey = `${Vowels}_${Tone}`;
// prettier-ignore
const VOWEL_CURSIVE_MAP: Record<VowelToneKey, string> = {
   a_: 'a',   a_0: 'ạ',   a_33: 'ā',   a_55: 'a',   a_21: 'ǎ',   a_24: 'á',   a_53: 'à',  a_242:  'â',   a_5: 'a',
   e_: 'e',   e_0: 'ẹ',   e_33: 'ē',   e_55: 'e',   e_21: 'ě',   e_24: 'é',   e_53: 'è',  e_242:  'ê',   e_5: 'e',
   o_: 'o',   o_0: 'ọ',   o_33: 'ō',   o_55: 'o',   o_21: 'ǒ',   o_24: 'ó',   o_53: 'ò',  o_242:  'ô',   o_5: 'o',
  oo_: 'ö',  oo_0: 'ọ̈',  oo_33: 'ȫ',  oo_55: 'ö',  oo_21: 'ö̌',  oo_24: 'ö́',  oo_53: 'ö̀', oo_242:  'ö̂',  oo_5: 'ö',
  eo_: 'ë',  eo_0: 'ẹ̈',  eo_33: 'ë̄',  eo_55: 'ë',  eo_21: 'ë̌',  eo_24: 'ë́',  eo_53: 'ë̀', eo_242:  'ë̂',  eo_5: 'ë',
   i_: 'i',   i_0: 'ị',   i_33: 'ī',   i_55: 'i',   i_21: 'ǐ',   i_24: 'í',   i_53: 'ì',  i_242:  'î',   i_5: 'i',
   u_: 'u',   u_0: 'ụ',   u_33: 'ū',   u_55: 'u',   u_21: 'ǔ',   u_24: 'ú',   u_53: 'ù',  u_242:  'û',   u_5: 'u',
   y_: 'ü',   y_0: 'ụ̈',   y_33: 'ǖ',   y_55: 'ü',   y_21: 'ǚ',   y_24: 'ǘ',   y_53: 'ǜ',  y_242:  'ü̂',   y_5: 'ü',
  ng_: 'ng', ng_0: 'ṇg', ng_33: 'n̄g', ng_55: 'ng', ng_21: 'ňg', ng_24: 'ńg', ng_53: 'ǹg', ng_242: 'n̂g', ng_5: 'ng',
} as const;

type NucleusToneKey = `${Nucleus}_${Tone}`;

const NUCLEUS_CURSIVE_MAP: Record<NucleusToneKey, string> = (() => {
  const map: Record<string, string> = {};
  for (const nKey in NUCLEUS_DETAILS) {
    const n = NUCLEUS_DETAILS[nKey as Nucleus];
    for (const tId of TONES) {
      const vKey: VowelToneKey = `${n.peak}_${tId}`;
      const toneVowel = VOWEL_CURSIVE_MAP[vKey] ?? n.peak;
      map[`${nKey}_${tId}`] = n.cursive.replace('~', toneVowel);
    }
  }
  return map;
})();

export type Coda = 'ng' | 'h' | 'k' | '' | 'n' | 'm' | 'p' | 't'; // n, m, p, t 类化产生

interface CodaSchema {
  ipa: string;
}

const CODA_DETAILS: Record<Coda, CodaSchema> = {
  ng: { ipa: 'ŋ' },
  h: { ipa: 'ʔ' },
  k: { ipa: 'ʔ' },
  '': { ipa: '' },
  n: { ipa: 'n' },
  m: { ipa: 'm' },
  p: { ipa: 'p' },
  t: { ipa: 't' },
} as const;

interface BaseFinalSchema {
  readonly glide: Glide; // 韵头
  readonly nucleus: Nucleus; // 韵腹
  readonly coda: Coda; // 韵尾
}

interface TightFinalSchema extends BaseFinalSchema {
  readonly isLoose: false;
  readonly tightVersion?: never;
}

interface LooseFinalSchema<T extends string = string> extends BaseFinalSchema {
  readonly isLoose: true;
  readonly tightVersion: readonly T[];
}

type FinalSchema<T extends string = string> =
  | TightFinalSchema
  | LooseFinalSchema<T>;

// prettier-ignore
const _META_FINAL_DETAILS  = {
  // a
  // 阴
  'a':     { glide: '',  nucleus: 'a',   coda: '',   isLoose: true, tightVersion: ['a', 'e']    }, // a->a, a->e
  'ia':    { glide: 'i', nucleus: 'a',   coda: '',   isLoose: false },
  'ua':    { glide: 'u', nucleus: 'a',   coda: '',   isLoose: false },
  // 阳
  'ang':   { glide: '',  nucleus: 'a',   coda: 'ng', isLoose: false },
  'iang':  { glide: 'i', nucleus: 'a',   coda: 'ng', isLoose: false },
  'uang':  { glide: 'u', nucleus: 'a',   coda: 'ng', isLoose: false },
  // 入
  'ah':    { glide: '',  nucleus: 'a',   coda: 'h',  isLoose: false },
  'ak':    { glide: '',  nucleus: 'a',   coda: 'k',  isLoose: false },
  'iah':   { glide: 'i', nucleus: 'a',   coda: 'h',  isLoose: false },
  'iak':   { glide: 'i', nucleus: 'a',   coda: 'k',  isLoose: false },
  'uah':   { glide: 'u', nucleus: 'a',   coda: 'h',  isLoose: false },
  'uak':   { glide: 'u', nucleus: 'a',   coda: 'k',  isLoose: false },

  // e
  // 阴
  'e':     { glide: '',  nucleus: 'e',   coda: '',   isLoose: false },
  'ie':    { glide: 'i', nucleus: 'e',   coda: '',   isLoose: false },
  // 阳
  'ieng':  { glide: 'i', nucleus: 'e',   coda: 'ng', isLoose: false },
  // 入
  'eh':    { glide: '',  nucleus: 'e',   coda: 'h',  isLoose: false },
  'ieh':   { glide: 'i', nucleus: 'e',   coda: 'h',  isLoose: false },
  'iek':   { glide: 'i', nucleus: 'e',   coda: 'k',  isLoose: false },

  // o
  // 阴
  'o':     { glide: '',  nucleus: 'o',   coda: '',   isLoose: false },
  'uo':    { glide: 'u', nucleus: 'o',   coda: '',   isLoose: false },
  'yo':    { glide: 'y', nucleus: 'o',   coda: '',   isLoose: false },
  // 阳
  'uong':  { glide: 'u', nucleus: 'o',   coda: 'ng', isLoose: false },
  'yong':  { glide: 'y', nucleus: 'o',   coda: 'ng', isLoose: false },
  // 入
  'oh':    { glide: '',  nucleus: 'o',   coda: 'h',  isLoose: false },
  'uoh':   { glide: 'u', nucleus: 'o',   coda: 'h',  isLoose: false },
  'uok':   { glide: 'u', nucleus: 'o',   coda: 'k',  isLoose: false },
  'yoh':   { glide: 'y', nucleus: 'o',   coda: 'h',  isLoose: false },
  'yok':   { glide: 'y', nucleus: 'o',   coda: 'k',  isLoose: false },
  // 松
  'oo':    { glide: '',  nucleus: 'oo',  coda: '',   isLoose: true, tightVersion: ['o', 'eo']    }, // oo->o, oo-> eo
  'ooh':   { glide: '',  nucleus: 'oo',  coda: 'h',  isLoose: true, tightVersion: ['oh']   },

  // eo
  // 阴
  'eo':    { glide: '',  nucleus: 'eo',  coda: '',   isLoose: false },
  // 入
  'eoh':   { glide: '',  nucleus: 'eo',  coda: 'h',  isLoose: false },

  // au
  // 阴
  'au':    { glide: '',  nucleus: 'au',  coda: '',   isLoose: true, tightVersion: ['au', 'eu']   }, // au->au, au->eu
  'eu':    { glide: '',  nucleus: 'eu',  coda: '',   isLoose: false },
  'iu':    { glide: '',  nucleus: 'iu',  coda: '',   isLoose: false },

  // ai
  // 阴
  'ai':    { glide: '',  nucleus: 'ai',  coda: '',   isLoose: false },
  'uai':   { glide: 'u', nucleus: 'ai',  coda: '',   isLoose: false },
  'ui':    { glide: '',  nucleus: 'ui',  coda: '',   isLoose: false },

  // i/u/y
  // 阴
  'i':     { glide: '',  nucleus: 'i',   coda: '',   isLoose: false },
  'u':     { glide: '',  nucleus: 'u',   coda: '',   isLoose: false },
  'y':     { glide: '',  nucleus: 'y',   coda: '',   isLoose: false },
  // 阳
  'ing':   { glide: '',  nucleus: 'i',   coda: 'ng', isLoose: false },
  'ung':   { glide: '',  nucleus: 'u',   coda: 'ng', isLoose: false },
  'yng':   { glide: '',  nucleus: 'y',   coda: 'ng', isLoose: false },
  // 入
  'ih':    { glide: '',  nucleus: 'i',   coda: 'h',  isLoose: false },
  'ik':    { glide: '',  nucleus: 'i',   coda: 'k',  isLoose: false },
  'uh':    { glide: '',  nucleus: 'u',   coda: 'h',  isLoose: false },
  'uk':    { glide: '',  nucleus: 'u',   coda: 'k',  isLoose: false },
  'yh':    { glide: '',  nucleus: 'y',   coda: 'h',  isLoose: false },
  'yk':    { glide: '',  nucleus: 'y',   coda: 'k',  isLoose: false },
  // 松
  'ei':    { glide: '',  nucleus: 'ei',  coda: '',   isLoose: true, tightVersion: ['i']    },
  'ou':    { glide: '',  nucleus: 'ou',  coda: '',   isLoose: true, tightVersion: ['u']    },

  // eoy/eing/oung/eoyng
  // 阴
  'eoy':   { glide: '',  nucleus: 'eoy', coda: '',   isLoose: false },
  // 阳
  'eing':  { glide: '',  nucleus: 'ei',  coda: 'ng', isLoose: true, tightVersion: ['ing']  },
  'oung':  { glide: '',  nucleus: 'ou',  coda: 'ng', isLoose: true, tightVersion: ['ung']  },
  'eoyng': { glide: '',  nucleus: 'eoy', coda: 'ng', isLoose: true, tightVersion: ['yng']  },
  // 入
  'eih':   { glide: '',  nucleus: 'ei',  coda: 'h',  isLoose: true, tightVersion: ['ih']   },
  'eik':   { glide: '',  nucleus: 'ei',  coda: 'k',  isLoose: true, tightVersion: ['ik']   },
  'ouh':   { glide: '',  nucleus: 'ou',  coda: 'h',  isLoose: true, tightVersion: ['uh']   },
  'ouk':   { glide: '',  nucleus: 'ou',  coda: 'k',  isLoose: true, tightVersion: ['uk']   },
  'eoyh':  { glide: '',  nucleus: 'eoy', coda: 'h',  isLoose: true, tightVersion: ['yh']   },
  'eoyk':  { glide: '',  nucleus: 'eoy', coda: 'k',  isLoose: true, tightVersion: ['yk']   },
  // 松
  'ooy':   { glide: '',  nucleus: 'ooy', coda: '',   isLoose: true, tightVersion: ['eoy']  },
  'aing':  { glide: '',  nucleus: 'ai',  coda: 'ng', isLoose: true, tightVersion: ['eing'] },
  'ooung': { glide: '',  nucleus: 'oo',  coda: 'ng', isLoose: true, tightVersion: ['oung'] },
  'ooyng': { glide: '',  nucleus: 'ooy', coda: 'ng', isLoose: true, tightVersion: ['eoyng']},
  'aik':   { glide: '',  nucleus: 'ai',  coda: 'k',  isLoose: true, tightVersion: ['eik']  },
  'oouk':  { glide: '',  nucleus: 'oo',  coda: 'k',  isLoose: true, tightVersion: ['ouk']  },
  'ooyk':  { glide: '',  nucleus: 'ooy', coda: 'k',  isLoose: true, tightVersion: ['eoyk'] },

  // 声化韵
  'ng':    { glide: '',  nucleus: '',    coda: 'ng', isLoose: false },

  // 旧韵
  'ieu':   { glide: 'i', nucleus: 'eu',  coda: '',   isLoose: false },
  'uoi':   { glide: 'u', nucleus: 'oi',  coda: '',   isLoose: false },

  // 补充音节
  'iau':   { glide: 'i', nucleus: 'au',  coda: '',   isLoose: false },
  'iauh':  { glide: 'i', nucleus: 'au',  coda: 'h',  isLoose: false },
} as const;

// 类化表中没有松紧韵数据，必须先松紧变韵再类化
// prettier-ignore
const _ASSIMILATED_FINAL_DETAILS = {
  // a
  // 阳声类化 ~ng -> ~m, ~n
  'am':    { glide: '',  nucleus: 'a',   coda: 'm', isLoose: false },
  'an':    { glide: '',  nucleus: 'a',   coda: 'n', isLoose: false },
  'iam':   { glide: 'i', nucleus: 'a',   coda: 'm', isLoose: false },
  'ian':   { glide: 'i', nucleus: 'a',   coda: 'n', isLoose: false },
  'uam':   { glide: 'u', nucleus: 'a',   coda: 'm', isLoose: false },
  'uan':   { glide: 'u', nucleus: 'a',   coda: 'n', isLoose: false },
  // 入声类化 ~h, ~k -> ~p | ~h, ~k -> ~t | ~h -> ~k
  'ap':    { glide: '',  nucleus: 'a',   coda: 'p', isLoose: false },
  'at':    { glide: '',  nucleus: 'a',   coda: 't', isLoose: false },
  'iap':   { glide: 'i', nucleus: 'a',   coda: 'p', isLoose: false },
  'iat':   { glide: 'i', nucleus: 'a',   coda: 't', isLoose: false },
  'uap':   { glide: 'u', nucleus: 'a',   coda: 'p', isLoose: false },
  'uat':   { glide: 'u', nucleus: 'a',   coda: 't', isLoose: false },

  // e
  // 阳声类化 ~ng -> ~m, ~n
  'iem':   { glide: 'i', nucleus: 'e',   coda: 'm', isLoose: false },
  'ien':   { glide: 'i', nucleus: 'e',   coda: 'n', isLoose: false },
  // 入声类化 ~h, ~k -> ~p | ~h, ~k -> ~t | ~h -> ~k
  'ep':    { glide: '',  nucleus: 'e',   coda: 'p', isLoose: false },
  'et':    { glide: '',  nucleus: 'e',   coda: 't', isLoose: false },
  'ek':    { glide: '',  nucleus: 'e',   coda: 'k', isLoose: false },
  'iep':   { glide: 'i', nucleus: 'e',   coda: 'p', isLoose: false },
  'iet':   { glide: 'i', nucleus: 'e',   coda: 't', isLoose: false },

  // o
  // 阳声类化 ~ng -> ~m, ~n
  'uom':   { glide: 'u', nucleus: 'o',   coda: 'm',  isLoose: false},
  'uon':   { glide: 'u', nucleus: 'o',   coda: 'n',  isLoose: false},
  'yom':   { glide: 'y', nucleus: 'o',   coda: 'm',  isLoose: false},
  'yon':   { glide: 'y', nucleus: 'o',   coda: 'n',  isLoose: false},
  // 入声类化 ~h, ~k -> ~p | ~h, ~k -> ~t | ~h -> ~k
  'op':    { glide: '',  nucleus: 'o',   coda: 'p',  isLoose: false},
  'ot':    { glide: '',  nucleus: 'o',   coda: 't',  isLoose: false},
  'ok':    { glide: '',  nucleus: 'o',   coda: 'k',  isLoose: false},
  'uop':   { glide: 'u', nucleus: 'o',   coda: 'p',  isLoose: false},
  'uot':   { glide: 'u', nucleus: 'o',   coda: 't',  isLoose: false},
  'yop':   { glide: 'y', nucleus: 'o',   coda: 'p',  isLoose: false},
  'yot':   { glide: 'y', nucleus: 'o',   coda: 't',  isLoose: false},
  // 入声类化产生的紧韵
  'oop':   { glide: '',  nucleus: 'oo',  coda: 'p',  isLoose: false},
  'oot':   { glide: '',  nucleus: 'oo',  coda: 't',  isLoose: false},
  'ook':   { glide: '',  nucleus: 'oo',  coda: 'k',  isLoose: false},

  // eo
  // 入声类化 ~h, ~k -> ~p | ~h, ~k -> ~t | ~h -> ~k
  'eop':   { glide: '',  nucleus: 'eo',  coda: 'p',  isLoose: false},
  'eot':   { glide: '',  nucleus: 'eo',  coda: 't',  isLoose: false},
  'eok':   { glide: '',  nucleus: 'eo',  coda: 'k',  isLoose: false},

  // i/u/y
  // 阳声类化 ~ng -> ~m, ~n
  'im':    { glide: '',  nucleus: 'i',   coda: 'm',  isLoose: false},
  'in':    { glide: '',  nucleus: 'i',   coda: 'n',  isLoose: false},
  'um':    { glide: '',  nucleus: 'u',   coda: 'm',  isLoose: false},
  'un':    { glide: '',  nucleus: 'u',   coda: 'n',  isLoose: false},
  'ym':    { glide: '',  nucleus: 'y',   coda: 'm',  isLoose: false},
  'yn':    { glide: '',  nucleus: 'y',   coda: 'n',  isLoose: false},
  // 阳声类化产生的紧韵
  'eim':   { glide: '',  nucleus: 'ei',  coda: 'm',  isLoose: false},
  'ein':   { glide: '',  nucleus: 'ei',  coda: 'n',  isLoose: false},
  'oum':   { glide: '',  nucleus: 'ou',  coda: 'm',  isLoose: false},
  'oun':   { glide: '',  nucleus: 'ou',  coda: 'n',  isLoose: false},
  'eoym':  { glide: '',  nucleus: 'eoy', coda: 'm',  isLoose: false},
  'eoyn':  { glide: '',  nucleus: 'eoy', coda: 'n',  isLoose: false},
  // 入声类化 ~h, ~k -> ~p | ~h, ~k -> ~t | ~h -> ~k
  'ip':    { glide: '',  nucleus: 'i',   coda: 'p',  isLoose: false},
  'it':    { glide: '',  nucleus: 'i',   coda: 't',  isLoose: false},
  'up':    { glide: '',  nucleus: 'u',   coda: 'p',  isLoose: false},
  'ut':    { glide: '',  nucleus: 'u',   coda: 't',  isLoose: false},
  'yp':    { glide: '',  nucleus: 'y',   coda: 'p',  isLoose: false},
  'yt':    { glide: '',  nucleus: 'y',   coda: 't',  isLoose: false},
  // 入声类化产生的紧韵
  'eip':   { glide: '',  nucleus: 'ei',  coda: 'p',  isLoose: false},
  'eit':   { glide: '',  nucleus: 'ei',  coda: 't',  isLoose: false},
  'oup':   { glide: '',  nucleus: 'ou',  coda: 'p',  isLoose: false},
  'out':   { glide: '',  nucleus: 'ou',  coda: 't',  isLoose: false},
  'eoyp':  { glide: '',  nucleus: 'eoy', coda: 'p',  isLoose: false},
  'eoyt':  { glide: '',  nucleus: 'eoy', coda: 't',  isLoose: false},
  // eoy/eing/oung/eoyng
  // 阳声入声类化都已有
} as const;

export type MetaFinal = keyof typeof _META_FINAL_DETAILS;
export const META_FINAL_DETAILS = _META_FINAL_DETAILS satisfies Record<
  MetaFinal,
  FinalSchema<MetaFinal>
>;
export type AssimilatedFinal = keyof typeof _ASSIMILATED_FINAL_DETAILS;
export const ASSIMILATED_FINAL_DETAILS =
  _ASSIMILATED_FINAL_DETAILS satisfies Record<
    AssimilatedFinal,
    TightFinalSchema
  >;

export const META_FINALS = Object.keys(META_FINAL_DETAILS) as MetaFinal[];
export const ASSIMILATED_FINALS = Object.keys(
  ASSIMILATED_FINAL_DETAILS
) as AssimilatedFinal[];

type CheckNoOverlap<T, U> =
  Extract<keyof T, keyof U> extends never
    ? T & U
    : `Duplicated Keys: ${Extract<keyof T, keyof U> & string}`;

const _ALL_FINALS = {
  ..._META_FINAL_DETAILS,
  ..._ASSIMILATED_FINAL_DETAILS,
};

export const FINAL_DETAILS = _ALL_FINALS as CheckNoOverlap<
  typeof _META_FINAL_DETAILS,
  typeof _ASSIMILATED_FINAL_DETAILS
> &
  typeof _ALL_FINALS;

export type Final = keyof typeof FINAL_DETAILS;
export const FINALS = Object.keys(FINAL_DETAILS) as MetaFinal[];

export const INITIALS = [
  '',
  'b',
  'p',
  'm',
  'd',
  't',
  'n',
  'l',
  's',
  'z',
  'c',
  'g',
  'k',
  'ng',
  'h',
  'w',
  'j',
  'nj',
] as const;

export type Initial = (typeof INITIALS)[number];

const INITIAL_IPA_MAP: Record<Initial, string> = {
  '': '',
  b: 'p',
  p: 'pʰ',
  m: 'm',
  d: 't',
  t: 'tʰ',
  n: 'n',
  l: 'l',
  s: 's',
  z: 't͡s',
  c: 't͡sʰ',
  g: 'k',
  k: 'kʰ',
  ng: 'ŋ',
  h: 'h',
  w: 'β̞',
  j: 'ɹ',
  nj: 'ɹ̃',
} as const;

interface Syllable {
  initial: Initial;
  final: Final;
  tone: Tone;
}

export const renderCursive = (syllable: Syllable): string => {
  const finalDetail = FINAL_DETAILS[syllable.final];
  const glide = GLIDE_DETAILS[finalDetail.glide].cursive;
  const nucleusWithTone =
    NUCLEUS_CURSIVE_MAP[`${finalDetail.nucleus}_${syllable.tone}`];
  const coda = finalDetail.nucleus === '' ? '' : finalDetail.coda;

  if (syllable.tone === '')
    return `{${syllable.initial}${glide}${nucleusWithTone}${coda}}`;

  return `${syllable.initial}${glide}${nucleusWithTone}${coda}`;
};

export const renderIPA = (syllable: Syllable) => {
  const finalDetail = FINAL_DETAILS[syllable.final];

  // 声化韵
  const coda =
    finalDetail.nucleus === '' ? '' : CODA_DETAILS[finalDetail.coda].ipa;
  const nucleus = NUCLEUS_DETAILS[finalDetail.nucleus].ipa;
  const initial = INITIAL_IPA_MAP[syllable.initial];
  const tone = TONE_DETAILS[syllable.tone].ipa;

  return `${initial}${finalDetail.glide}${nucleus}${coda}${tone}`;
};

const reverse_cursive_finals = <S extends 'meta' | 'all'>(
  scope: S
): Record<
  string,
  { final: S extends 'meta' ? MetaFinal : Final; tone: Tone }
> => {
  type ReturnType = Record<
    string,
    { final: S extends 'meta' ? MetaFinal : Final; tone: Tone }
  >;

  const map: Record<string, { final: Final; tone: Tone }> = {};
  const RU_TONES: Tone[] = ['5', '24', '21'];

  const finals = (scope === 'meta' ? META_FINALS : FINALS) as Final[];

  finals.forEach((fId) => {
    const isRu = fId.endsWith('h') || fId.endsWith('k');
    TONES.forEach((tId) => {
      // 无定调不加入映射
      if (tId === '') return;
      // 处理入声调值，非入声没有 '5' 调值
      if (isRu ? !RU_TONES.includes(tId) : tId === '5') return;

      const cursiveRhyme = renderCursive({
        initial: '',
        final: fId,
        tone: tId,
      });

      map[cursiveRhyme] = { final: fId, tone: tId };
    });
  });

  return map as ReturnType;
};

export const CURSIVE_META_RHYTHM_LOOKUP = reverse_cursive_finals('meta');
export const CURSIVE_RHYTHM_LOOKUP = reverse_cursive_finals('all');

const reverseIPAFinals = <S extends 'meta' | 'all'>(
  scope: S
): Record<string, S extends 'meta' ? MetaFinal : Final> => {
  type ReturnType = Record<string, S extends 'meta' ? MetaFinal : Final>;
  const finals = (scope === 'meta' ? META_FINALS : FINALS) as Final[];

  const map: Record<string, Final> = {};
  finals.forEach((fId) => {
    const ipa = renderIPA({ initial: '', final: fId, tone: '' });
    // IPA 的 /ʔ/ 转入声如果重复，优先保留 -k 形态
    if (map[ipa]) {
      if (fId.endsWith('k')) {
        map[ipa] = fId;
      }
    } else {
      map[ipa] = fId;
    }
  });

  return map as ReturnType;
};

export const IPA_LOOKUPS = (() => {
  const sortByIpaLen = <T>(list: [T, string][]) =>
    [...list].sort((a, b) => b[1].length - a[1].length);

  const initials = sortByIpaLen(
    Object.entries(INITIAL_IPA_MAP) as [Initial, string][]
  );

  const metaFinals = sortByIpaLen(
    Object.entries(reverseIPAFinals('meta')).map(([ipa, fId]) => [
      fId as Final,
      ipa,
    ])
  );

  const finals = sortByIpaLen(
    Object.entries(reverseIPAFinals('all')).map(([ipa, fId]) => [
      fId as Final,
      ipa,
    ])
  );

  const tones = sortByIpaLen(
    (Object.keys(TONE_DETAILS) as Tone[])
      .map((t): [Tone, string] => [t, TONE_DETAILS[t].ipa])
      .filter(([, ipa]) => ipa !== '') // 没声调视作无效的 IPA
  );

  return { initials, metaFinals, finals, tones };
})();

export const sourceMap: Record<string, string> = {
  feng: '福州方言词典',
  cikling: '戚林八音校注',
};

export const sourceQuoteMap: Record<string, string> = {
  feng: '《福州方言词典》',
  cikling: '《戚林八音校注》',
  dfd: '《Dictionary of Foochow Dialect》',
  ime: '输入法',
};

export const toneCikLingMap: Record<string, string> = {
  '': '未知',
  1: '上平',
  2: '上上',
  3: '上去',
  4: '上入',
  5: '下平',
  6: '下上',
  7: '下去',
  8: '下入',
};

export const yngpingFengIPAInitialMap: Record<Initial, string> = {
  '': '',
  b: 'p',
  p: 'p’',
  m: 'm',
  d: 't',
  t: 't’',
  n: 'n',
  l: 'l',
  s: 's',
  z: 'ts',
  c: 'ts’',
  g: 'k',
  k: 'k’',
  ng: 'ŋ',
  h: 'h',
  w: 'β',
  j: 'ʒ',
  nj: 'ʒ',
};

export const yngpingFengIPAFinalMap: Record<MetaFinal, string> = {
  a: 'a',
  //   'a': 'ɑ',
  ai: 'ai',
  au: 'au',
  ang: 'aŋ',
  aing: 'aiŋ',
  ah: 'aʔ',
  ak: 'aʔ',
  aik: 'aiʔ',
  e: 'ɛ',
  ei: 'ɛi',
  eo: 'œ',
  eoy: 'øy',
  eu: 'ɛu',
  eing: 'ɛiŋ',
  eoyng: 'øyŋ',
  eh: 'ɛʔ',
  eih: 'ɛiʔ',
  eik: 'ɛiʔ',
  eoh: 'œʔ',
  eoyh: 'øyʔ',
  eoyk: 'øyʔ',
  i: 'i',
  ia: 'ia',
  iau: 'iau',
  iauh: 'iauʔ',
  ie: 'ie',
  ieu: 'ieu',
  iu: 'ieu',
  iang: 'iaŋ',
  ieng: 'ieŋ',
  ing: 'iŋ',
  ih: 'iʔ',
  ik: 'iʔ',
  iah: 'iaʔ',
  iak: 'iaʔ',
  ieh: 'ieʔ',
  iek: 'ieʔ',
  ng: 'ŋ̍',
  o: 'o',
  // 'o': 'ɔ',
  oo: 'ɔ',
  ooy: 'ɔy',
  ou: 'ou',
  ooung: 'ɔuŋ',
  ooyng: 'ɔyŋ',
  oung: 'ouŋ',
  oh: 'oʔ',
  ooh: 'ɔʔ',
  oouk: 'ɔuʔ',
  ooyk: 'ɔyʔ',
  ouh: 'ouʔ',
  ouk: 'ouʔ',
  u: 'u',
  ua: 'ua',
  uai: 'uai',
  ui: 'uoi',
  uo: 'uo',
  uoi: 'uoi',
  ung: 'uŋ',
  uang: 'uaŋ',
  uong: 'uoŋ',
  uh: 'uʔ',
  uk: 'uʔ',
  uah: 'uaʔ',
  uak: 'uaʔ',
  uoh: 'uoʔ',
  uok: 'uoʔ',
  y: 'y',
  yo: 'yo',
  yng: 'yŋ',
  yong: 'yoŋ',
  yh: 'yʔ',
  yk: 'yʔ',
  yoh: 'yoʔ',
  yok: 'yoʔ',
};

export const yngpingFengIPAToneMap: Record<string, string> = {
  0: '',
  21: '˨˩',
  213: '˨˩˨',
  24: '˧˥',
  242: '˨˦˨',
  33: '˧˧',
  5: '˥',
  53: '˥˧',
  55: '˥˥',
};

export const yngpingFengIPAEndToneMap: Record<string, string> = {
  0: '',
  21: '˨˩',
  213: '˨˩˨',
  24: '˨˦',
  242: '˨˦˨',
  33: '˧˧',
  5: '˥',
  53: '˥˧',
  55: '˥˥',
};
// 一对二的映射：原书ipa将单字调的24记为“˨˦”。而连读中的24，记为“˧˥”，此为五度中的35。
// 这种一对二的映射有两种快捷的解决办法。
// 1.暴力映射，只要不处在多音节词汇末尾的24，统统转换为“˧˥”（即35）。
// 2.无视这种差异，在线上词典说明页面说明即可。个人建议选第一种。

export const phonologyBanguaceInitialMap: Record<string, string> = {
  柳: 'l',
  邊: 'b',
  求: 'g',
  氣: 'k',
  低: 'd',
  波: 'p',
  他: 't',
  曾: 'c',
  日: 'n',
  時: 's',
  鶯: '',
  蒙: 'm',
  語: 'ng',
  出: 'ch',
  喜: 'h',
};

export const phonologyBanguaceRhythmMap: Record<string, string> = {
  伓下去: 'n̂g',
  春上平: 'ŭng',
  春上上: 'ūng',
  春上去: 'óng',
  春上入: 'ók',
  春下平: 'ùng',
  春下去: 'ông',
  春下入: 'ŭk',
  花上平: 'uă',
  花上上: 'uā',
  花上去: 'uá',
  花上入: 'uáh',
  花下平: 'uà',
  花下去: 'uâ',
  花下入: 'uăh',
  香上平: 'iŏng',
  香上上: 'iōng',
  香上去: 'ióng',
  香上入: 'iók',
  香下平: 'iòng',
  香下去: 'iông',
  香下入: 'iŏk',
  秋上平: 'ĭu',
  秋上上: 'īu',
  秋上去: 'éu',
  秋上入: 'éuh',
  秋下平: 'ìu',
  秋下去: 'êu',
  秋下入: 'ĭuh',
  山上平: 'ăng',
  山上上: 'āng',
  山上去: 'áng',
  山上入: 'ák',
  山下平: 'àng',
  山下去: 'âng',
  山下入: 'ăk',
  開上平: 'ăi',
  開上上: 'āi',
  開上去: 'ái',
  開上入: 'áih',
  開下平: 'ài',
  開下去: 'âi',
  開下入: 'ăih',
  嘉上平: 'ă',
  嘉上上: 'ā',
  嘉上去: 'á',
  嘉上入: 'áh',
  嘉下平: 'à',
  嘉下去: 'â',
  嘉下入: 'ăh',
  賓上平: 'ĭng',
  賓上上: 'īng',
  賓上去: 'éng',
  賓上入: 'ék',
  賓下平: 'ìng',
  賓下去: 'êng',
  賓下入: 'ĭk',
  歡上平: 'uăng',
  歡上上: 'uāng',
  歡上去: 'uáng',
  歡上入: 'uák',
  歡下平: 'uàng',
  歡下去: 'uâng',
  歡下入: 'uăk',
  歌上平: 'ŏ̤',
  歌上上: 'ō̤',
  歌上去: 'ó̤',
  歌上入: 'ó̤h',
  歌下平: 'ò̤',
  歌下去: 'ô̤',
  歌下入: 'ŏ̤h',
  須上平: 'ṳ̆',
  須上上: 'ṳ̄',
  須上去: 'é̤ṳ',
  須上入: 'é̤ṳh',
  須下平: 'ṳ̀',
  須下去: 'ê̤ṳ',
  須下入: 'ṳ̆h',
  杯上平: 'uŏi',
  杯上上: 'uōi',
  杯上去: 'uói',
  杯上入: 'uóih',
  杯下平: 'uòi',
  杯下去: 'uôi',
  杯下入: 'uŏih',
  孤上平: 'ŭ',
  孤上上: 'ū',
  孤上去: 'ó',
  孤上入: 'óh',
  孤下平: 'ù',
  孤下去: 'ô',
  孤下入: 'ŭh',
  燈上平: 'ĕng',
  燈上上: 'ēng',
  燈上去: 'áing',
  燈上入: 'áik',
  燈下平: 'èng',
  燈下去: 'âing',
  燈下入: 'ĕk',
  光上平: 'uŏng',
  光上上: 'uōng',
  光上去: 'uóng',
  光上入: 'uók',
  光下平: 'uòng',
  光下去: 'uông',
  光下入: 'uŏk',
  輝上平: 'ŭi',
  輝上上: 'ūi',
  輝上去: 'ói',
  輝上入: 'óih',
  輝下平: 'ùi',
  輝下去: 'ôi',
  輝下入: 'ŭih',
  燒上平: 'iĕu',
  燒上上: 'iēu',
  燒上去: 'iéu',
  燒上入: 'iéuh',
  燒下平: 'ièu',
  燒下去: 'iêu',
  燒下入: 'iĕuh',
  銀上平: 'ṳ̆ng',
  銀上上: 'ṳ̄ng',
  銀上去: 'é̤ṳng',
  銀上入: 'é̤ṳk',
  銀下平: 'ṳ̀ng',
  銀下去: 'ê̤ṳng',
  銀下入: 'ṳ̆k',
  釭上平: 'ŏng',
  釭上上: 'ōng',
  釭上去: 'áung',
  釭上入: 'áuk',
  釭下平: 'òng',
  釭下去: 'âung',
  釭下入: 'ŏk',
  之上平: 'ĭ',
  之上上: 'ī',
  之上去: 'é',
  之上入: 'éh',
  之下平: 'ì',
  之下去: 'ê',
  之下入: 'ĭh',
  東上平: 'ĕ̤ng',
  東上上: 'ē̤ng',
  東上去: 'áe̤ng',
  東上入: 'áe̤k',
  東下平: 'è̤ng',
  東下去: 'âe̤ng',
  東下入: 'ĕ̤k',
  郊上上: 'āu',
  郊上平: 'ău',
  郊上去: 'áu',
  郊上入: 'áuh',
  郊下平: 'àu',
  郊下去: 'âu',
  郊下入: 'ăuh',
  過上平: 'uŏ',
  過上上: 'uō',
  過上去: 'uó',
  過上入: 'uóh',
  過下平: 'uò',
  過下去: 'uô',
  過下入: 'uŏh',
  西上平: 'ă̤',
  西上上: 'ā̤',
  西上去: 'á̤',
  西上入: 'á̤h',
  西下平: 'à̤',
  西下去: 'â̤',
  西下入: 'ă̤h',
  橋上平: 'iŏ',
  橋上上: 'iō',
  橋上去: 'ió',
  橋上入: 'ióh',
  橋下平: 'iò',
  橋下去: 'iô',
  橋下入: 'iŏh',
  雞上平: 'iĕ',
  雞上上: 'iē',
  雞上去: 'ié',
  雞上入: 'iéh',
  雞下平: 'iè',
  雞下去: 'iê',
  雞下入: 'iĕh',
  聲上上: 'iāng',
  聲上去: 'iáng',
  聲上入: 'iák',
  聲下平: 'iàng',
  聲下去: 'iâng',
  聲下入: 'iăk',
  聲上平: 'iăng',
  催上平: 'ŏi',
  催上上: 'ōi',
  催上去: 'ó̤i',
  催上入: 'ó̤ih',
  催下平: 'òi',
  催下去: 'ô̤i',
  催下入: 'ŏih',
  初上平: 'ĕ̤',
  初上上: 'ē̤',
  初上去: 'áe̤',
  初上入: 'áe̤h',
  初下平: 'è̤',
  初下去: 'âe̤',
  初下入: 'ĕ̤h',
  天上上: 'iēng',
  天上平: 'iĕng',
  天上去: 'iéng',
  天上入: 'iék',
  天下平: 'ièng',
  天下去: 'iêng',
  天下入: 'iĕk',
  奇上平: 'iă',
  奇上上: 'iā',
  奇上去: 'iá',
  奇上入: 'iáh',
  奇下平: 'ià',
  奇下去: 'iâ',
  奇下入: 'iăh',
  歪上平: 'uăi',
  歪上上: 'uāi',
  歪上去: 'uái',
  歪上入: 'uáih',
  歪下平: 'uài',
  歪下去: 'uâi',
  歪下入: 'uăih',
  溝上平: 'ĕu',
  溝上上: 'ēu',
  溝上去: 'áiu',
  溝上入: 'áiuh',
  溝下平: 'èu',
  溝下去: 'âiu',
  溝下入: 'ĕuh',
};
