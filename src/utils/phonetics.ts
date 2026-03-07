import {
  CURSIVE_RHYTHM_LOOKUP,
  FINAL_DETAILS,
  FINALS,
  INITIALS,
  IPA_LOOKUPS,
  META_FINALS,
  phonologyBanguaceInitialMap,
  phonologyBanguaceRhythmMap,
  renderCursive,
  renderIPA,
  CURSIVE_META_RHYTHM_LOOKUP,
  ToneCategory,
  TONE_DETAILS,
  TONES,
  yngpingFengIPAEndToneMap,
  yngpingFengIPAFinalMap,
  yngpingFengIPAInitialMap,
  yngpingFengIPAToneMap,
} from './mapping';

import type { Coda, Final, Initial, MetaFinal, Tone } from './mapping';

export const yngpingInitialPattern = /^(b|p|m|d|t|l|s|z|c|g|k|h|w|j|ng|nj|n)/;

export const isInitial = (value: unknown): value is Initial => {
  if (typeof value !== 'string') return false;
  return (INITIALS as readonly string[]).includes(value);
};

export const isMetaFinal = (value: unknown): value is MetaFinal => {
  if (typeof value !== 'string') return false;
  return (META_FINALS as readonly string[]).includes(value);
};

export const isFinal = (value: unknown): value is Final => {
  if (typeof value !== 'string') return false;
  return (FINALS as readonly string[]).includes(value);
};

export const isTone = (value: unknown): value is Tone => {
  if (typeof value !== 'string') return false;
  return (TONES as readonly string[]).includes(value);
};

export type Scheme = 'typing' | 'cursive' | 'ipa';

export const parseSyllable = (
  input: string,
  scheme: Scheme = 'typing',
  scope: 'meta' | 'all' = 'meta'
): [Initial | null, Final | null, Tone | null] => {
  const text = input.trim();
  if (!text) return [null, null, null];

  switch (scheme) {
    case 'cursive':
      return parseCursiveSyllable(text, scope);
    case 'ipa':
      return parseIPASyllable(text, 'all');
    case 'typing':
    default:
      return parseTypingSyllable(text, scope);
  }
};

const parseTone = (
  yngping: string
): { tone: Tone | null; remaining: string } => {
  if (yngping.startsWith('{') && yngping.endsWith('}')) {
    const inner = yngping.replace(/\{|\}/g, '');
    if (/\d+$/.test(inner))
      return { tone: null, remaining: inner.replace(/\d+$/, '') };
    else return { tone: '', remaining: inner };
  }

  const toneMatch = yngping.match(/\d+$/);
  if (!toneMatch) return { tone: null, remaining: yngping };
  const remaining = yngping.slice(0, -toneMatch[0].length);
  // 213 -> 21
  const tone = ((): string => {
    switch (toneMatch[0]) {
      case '213':
        return '21';
      default:
        return toneMatch[0];
    }
  })();

  return isTone(tone) ? { tone, remaining } : { tone: null, remaining };
};

export const parseTypingSyllable = (
  input: string,
  scope: 'meta' | 'all'
): [Initial | null, Final | null, Tone | null] => {
  const text = input.trim();
  if (text.length === 0) return [null, null, null];
  const { tone, remaining } = parseTone(text);

  const initialMatch = remaining.match(yngpingInitialPattern);
  let initial =
    initialMatch && isInitial(initialMatch[0]) ? initialMatch[0] : '';

  const finalStr = initial ? remaining.slice(initial.length) : remaining;
  let final: Final | null = null;
  const isFinalValid = scope === 'all' ? isFinal : isMetaFinal;

  if (initial === 'ng' && !finalStr) {
    // ng 既作声母也作韵母，当没有其他韵母时就是韵母
    initial = '';
    final = 'ng';
  } else if (finalStr && isFinalValid(finalStr)) {
    final = finalStr;
  }

  return [initial, final, tone];
};

const parseCursiveSyllable = (
  input: string,
  scope: 'meta' | 'all'
): [Initial | null, Final | null, Tone | null] => {
  const findInitial = (s: string) => {
    const initialMatch = s.match(yngpingInitialPattern);
    return initialMatch ? (initialMatch[0] as Initial) : '';
  };

  const text = input.trim().normalize('NFC');
  if (text.length === 0) return [null, null, null];
  if (text.startsWith('{') && text.endsWith('}')) {
    const inner = text.slice(1, -1);
    const initial = findInitial(inner);
    const final = (initial ? inner.slice(initial.length) : inner) as Final;
    return [initial, final, '']; // 无定调
  }

  const initial = findInitial(text);
  const rest = initial ? text.slice(initial.length) : text;

  const match =
    scope === 'all'
      ? CURSIVE_RHYTHM_LOOKUP[rest]
      : CURSIVE_META_RHYTHM_LOOKUP[rest];
  if (match) {
    return [initial, match.final, match.tone];
  }

  return [initial, null, null];
};

const parseIPASyllable = (
  input: string,
  scope: 'meta' | 'all'
): [Initial | null, Final | null, Tone | null] => {
  let remaining = input.trim();
  if (remaining.length === 0) return [null, null, null];

  let tone: Tone | null = null;
  let initial: Initial | null = null;
  let final: Final | null = null;

  // 从末尾贪婪匹配匹配声调
  const tEntry = IPA_LOOKUPS.tones.find(([, ipa]) => remaining.endsWith(ipa));
  if (tEntry) {
    tone = tEntry[0] as Tone;
    remaining = remaining.slice(0, -tEntry[1].length);
  }

  // 从开头贪婪匹配匹配声母
  const iEntry = IPA_LOOKUPS.initials.find(([, ipa]) =>
    remaining.startsWith(ipa)
  );
  if (iEntry) {
    initial = iEntry[0] as Initial;
    remaining = remaining.slice(iEntry[1].length);
  }

  const finalLookup =
    scope === 'all' ? IPA_LOOKUPS.finals : IPA_LOOKUPS.metaFinals;
  // 匹配韵母
  if (remaining === '\u030D' && initial === 'ng') {
    initial = '';
    final = 'ng';
  } else {
    const fEntry = finalLookup.find(([, ipa]) => remaining === ipa);
    if (fEntry) final = fEntry[0] as Final;
  }

  return [initial, final, tone];
};

// 入声检查
// const validateSyllable = () => {};

export type SyllableData = {
  readonly raw: string;
  readonly initialRaw: Initial | null;
  readonly finalRaw: Final | null;
  readonly toneRaw: Tone | null;
  readonly initial: Initial | null;
  readonly final: Final | null;
  readonly tone: Tone | null;
};

export class Syllable {
  public readonly value: SyllableData;

  constructor(syllable: SyllableData) {
    this.value = Object.freeze(syllable);
  }

  static of(
    input: string,
    scheme: Scheme = 'typing',
    useAssimilated?: boolean
  ): Syllable {
    const [initial, final, tone] = parseSyllable(
      input,
      scheme,
      useAssimilated ? 'all' : 'meta'
    );
    return new Syllable({
      raw: input.trim(),
      initialRaw: initial,
      finalRaw: final,
      toneRaw: tone,
      initial: initial,
      final: final,
      tone: tone,
    });
  }

  withInitial(newInitial: Initial): Syllable {
    return new Syllable({ ...this.value, initial: newInitial });
  }

  withFinal(newFinal: Final): Syllable {
    return new Syllable({ ...this.value, final: newFinal });
  }

  withTone(newTone: Tone): Syllable {
    return new Syllable({ ...this.value, tone: newTone });
  }

  withCoda(newCoda: Coda): Syllable {
    if (this.value.final === null) return this;
    const fDetail = FINAL_DETAILS[this.value.final];
    const newFinal = `${fDetail.glide}${fDetail.nucleus}${newCoda}`;
    if (!(newFinal in FINAL_DETAILS)) {
      return this;
    }
    return new Syllable({ ...this.value, final: newFinal as Final });
  }

  reset(): Syllable {
    return new Syllable({
      ...this.value,
      initial: this.value.initialRaw,
      final: this.value.finalRaw,
      tone: this.value.toneRaw,
    });
  }

  isValid(
    type: 'initial'
  ): this is { value: SyllableData & { initial: Initial } };
  isValid(type: 'final'): this is { value: SyllableData & { final: Final } };
  isValid(type: 'tone'): this is { value: SyllableData & { tone: Tone } };
  isValid(type?: undefined): this is {
    value: SyllableData & { initial: Initial; final: Final; tone: Tone };
  };
  isValid(type?: 'initial' | 'final' | 'tone'): boolean {
    const { initial, final, tone } = this.value;
    switch (type) {
      case 'initial':
        return initial !== null;
      case 'final':
        return final !== null;
      case 'tone':
        return tone !== null;
      default:
        return initial !== null && final !== null && tone !== null;
    }
  }

  hasFixedTone(): boolean {
    return this.value.tone !== null && this.value.tone !== '';
  }

  toRaw(): string {
    return this.value.raw;
  }

  toString(): string {
    if (!this.isValid()) return '';
    if (this.hasFixedTone())
      return `${this.value.initial}${this.value.final}${this.value.tone}`;
    return `{${this.value.initial}${this.value.final}}`;
  }

  toCursive(): string {
    if (!this.isValid()) return '';
    return renderCursive(this.value);
  }

  toIPA(): string {
    if (!this.isValid()) return '';
    return renderIPA(this.value);
  }

  renderFeng(isLast: boolean): string {
    if (!this.isValid()) return '';
    const { initial, final, tone } = this.value;
    if (!isMetaFinal(final)) return '';

    const toneMap = isLast ? yngpingFengIPAEndToneMap : yngpingFengIPAToneMap;
    const ipaTone = toneMap[tone] ?? '';

    return `${yngpingFengIPAInitialMap[initial]}${yngpingFengIPAFinalMap[final]}${ipaTone}`;
  }
}

type ToneSandhiKey =
  | '阴平'
  | '上'
  | '阴去'
  | '阴入-k'
  | '阴入-h'
  | '阳平'
  | '阳去'
  | '阳入';

// prettier-ignore
const TONE_SANDHI_RULES: Record<ToneSandhiKey, Record<ToneCategory, Tone>> = {
  '阴平'  : { '阴平': '55', '上': '53', '阴去': '53', '阴入': '53', '阳平': '55', '阳去': '53', '阳入': '55' },
  '上'    : { '阴平': '21', '上': '24', '阴去': '55', '阴入': '55', '阳平': '21', '阳去': '55', '阳入': '21' },
  '阴去'  : { '阴平': '55', '上': '53', '阴去': '53', '阴入': '53', '阳平': '55', '阳去': '53', '阳入': '55' },
  '阴入-k': { '阴平': '21', '上': '24', '阴去': '55', '阴入': '55', '阳平': '21', '阳去': '55', '阳入': '21' },
  '阴入-h': { '阴平': '55', '上': '53', '阴去': '53', '阴入': '53', '阳平': '55', '阳去': '53', '阳入': '55' },
  '阳平'  : { '阴平': '55', '上': '33', '阴去': '21', '阴入': '21', '阳平': '55', '阳去': '21', '阳入': '55' },
  '阳去'  : { '阴平': '55', '上': '53', '阴去': '53', '阴入': '53', '阳平': '55', '阳去': '53', '阳入': '55' },
  '阳入'  : { '阴平': '55', '上': '33', '阴去': '21', '阴入': '21', '阳平': '55', '阳去': '21', '阳入': '55' },
};

const getToneCategory = (syllable: Syllable): ToneCategory | null => {
  const tone = syllable.value.toneRaw;
  if (tone === null) return null;
  return TONE_DETAILS[tone].category;
};

const getToneSandhiKey = (s: Syllable): ToneSandhiKey | null => {
  const category = getToneCategory(s);
  if (!category) return null;

  if (category === ToneCategory.YinRu) {
    const final = s.value.final;
    const coda = final ? FINAL_DETAILS[final].coda : '';

    if (coda === 'h') return '阴入-h';
    if (coda === 'k') return '阴入-k';
    // 理论上必为 h/k
    return null;
  }

  return category as ToneSandhiKey;
};

const getBiToneSandhi = (prev: Syllable, next: Syllable): Tone | null => {
  const ruleKey = getToneSandhiKey(prev);
  const nextCat = getToneCategory(next);

  if (ruleKey && nextCat) {
    return TONE_SANDHI_RULES[ruleKey]?.[nextCat] ?? null;
  }

  return null;
};

const applyBiToneSandhi = (
  prev: Syllable,
  next: Syllable
): [Syllable, Syllable] => {
  const sandhiTone = getBiToneSandhi(prev, next);
  return [sandhiTone ? prev.withTone(sandhiTone) : prev, next];
};

const applyTriToneSandhi = (
  s0: Syllable,
  s1: Syllable,
  s2: Syllable
): [Syllable, Syllable, Syllable] => {
  // 后两字先按二字变调规律变调
  const [sandhiS1, sandhiS2] = applyBiToneSandhi(s1, s2);

  const s1Cat = getToneCategory(s1);
  let sandhiS0: Syllable;
  if (s1Cat === ToneCategory.Yangping || s1Cat === ToneCategory.YangRu) {
    // 若第二字为下平或下入，第三字与变调后的倒数第二字变调
    [sandhiS0] = applyBiToneSandhi(s0, sandhiS1);
  } else {
    // 否则倒数第三字变为21
    sandhiS0 = s0.withTone('21');
  }

  return [sandhiS0, sandhiS1, sandhiS2];
};

export class Phrase {
  readonly isCompound: boolean;

  constructor(
    public readonly syllables: Syllable[],
    useCompound: boolean = false
  ) {
    this.isCompound = useCompound && syllables.length > 1;
  }

  static of(
    input: string,
    scheme: Scheme = 'typing',
    forceCompound?: boolean
  ): Phrase {
    const trimmed = input.trim();
    if (!trimmed) return new Phrase([]);

    const hasHyphen = trimmed.includes('-');
    // 强制 compound 时将空格当连字符
    const splitPattern = forceCompound ? /[-\s]+/ : '-';
    const segments = trimmed.split(splitPattern).filter((s) => s.length > 0);
    const isCompound = forceCompound ?? (hasHyphen && segments.length > 1);
    const syllables = segments.map((s) => Syllable.of(s, scheme, isCompound));

    return new Phrase(syllables, isCompound);
  }

  applyVowelSandhi(): Phrase {
    if (!this.isCompound) return this;

    const newSyllables = this.syllables.map((s, i) => {
      const next = this.syllables[i + 1];
      if (!next || !s.isValid()) return s;
      const final = FINAL_DETAILS[s.value.final];
      if (!final.isLoose) return s;
      return s.withFinal(final.tightVersion);
    });

    return new Phrase(newSyllables, this.isCompound);
  }

  applyToneSandhi(): Phrase {
    const len = this.syllables.length;
    if (len < 2 || !this.isCompound) return this;

    if (len === 2) {
      return new Phrase(
        applyBiToneSandhi(this.syllables[0], this.syllables[1]),
        this.isCompound
      );
    }

    if (len === 3) {
      return new Phrase(
        applyTriToneSandhi(
          this.syllables[0],
          this.syllables[1],
          this.syllables[2]
        ),
        this.isCompound
      );
    }

    const result = [...this.syllables];
    // 倒数第四字及更多音节，统一变为21
    for (let i = 0; i <= len - 4; i++) {
      result[i] = result[i].withTone('21');
    }

    const lastThree = applyTriToneSandhi(
      result[len - 3],
      result[len - 2],
      result[len - 1]
    );

    result.splice(len - 3, 3, ...lastThree);
    return new Phrase(result, this.isCompound);
  }

  applyProgressAssimilation(): Phrase {
    if (!this.isCompound) return this;

    const newSyllables = this.syllables.map((s, i) => {
      const prev = this.syllables[i - 1];

      // 不定调不参加
      if (!prev || !prev.isValid() || !s.isValid() || s.value.tone === '') {
        return s;
      }

      const prevFinal = FINAL_DETAILS[prev.value.final];
      const initial = s.value.initial;

      // 后字是轻声
      if (s.value.tone === '0') {
        if (['h', 'k'].includes(prevFinal.coda)) {
          // ~h, ~k + d~, t~, s~, l~ -> g~
          if (['d', 't', 's', 'l'].includes(initial)) return s.withInitial('g');
          // ~h, ~k + d~, k~, h~, ""~ -> d~
          if (['g', 'k', 'h', ''].includes(initial)) return s.withInitial('d');
        }
        return s;
      }

      // 后字是非轻声，~k 不变
      if (prevFinal.coda === 'k') return s;

      // ~ng
      if (prevFinal.coda === 'ng') {
        // ~ng + ~b, ~p -> ~m
        if (['b', 'p'].includes(initial)) return s.withInitial('m');
        // ~ng + ~d, ~t, ~n, ~l -> ~n
        if (['d', 't', 's', 'l'].includes(initial)) return s.withInitial('n');
        // ~ng + ~z, ~c -> ~nj
        if (['z', 'c'].includes(initial)) return s.withInitial('nj');
        // ~ng + ~g, ~h, ~h -> ~ng
        if (['g', 'k', 'h', ''].includes(initial)) return s.withInitial('ng');
        return s;
      }

      // 无韵尾 / ~h
      if (prevFinal.coda === '' || prevFinal.coda === 'h') {
        // ~h + ~b, ~p -> ~w
        if (['b', 'p'].includes(initial)) return s.withInitial('w');
        // ~h + ~d, ~t, ~n, ~l -> ~l
        if (['d', 't', 's', 'l'].includes(initial)) return s.withInitial('l');
        // ~h + ~z, ~c -> ~j
        if (['z', 'c'].includes(initial)) return s.withInitial('j');
        // ~h + ~g, ~k, ~h -> 无声母
        if (['g', 'k', 'h'].includes(initial)) return s.withInitial('');
        return s;
      }
      return s;
    });
    return new Phrase(newSyllables, this.isCompound);
  }

  applyRegressAssimilation(): Phrase {
    if (!this.isCompound) return this;

    const newSyllables = this.syllables.map((s, i) => {
      const next = this.syllables[i + 1];

      if (
        !next ||
        !next.isValid() ||
        !s.isValid() ||
        FINAL_DETAILS[s.value.final].nucleus === '' // 声化韵不参加
      ) {
        return s;
      }

      const nextInitial = next.value.initial;
      const coda = FINAL_DETAILS[s.value.final].coda;

      if (coda === 'ng') {
        if (['b', 'p', 'm'].includes(nextInitial)) return s.withCoda('m');
        if (['d', 't', 'z', 'c', 's', 'n', 'l'].includes(nextInitial))
          return s.withCoda('n');
        return s;
      }
      if (coda === 'h') {
        if (['b', 'p', 'm'].includes(nextInitial)) return s.withCoda('p');
        if (['d', 't', 'z', 'c', 's', 'n', 'l'].includes(nextInitial))
          return s.withCoda('t');
        if (['g', 'k', 'h', 'ng', ''].includes(nextInitial))
          return s.withCoda('k');
        return s;
      }
      if (coda === 'k') {
        if (['b', 'p', 'm'].includes(nextInitial)) return s.withCoda('p');
        if (['d', 't', 'z', 'c', 's', 'n', 'l'].includes(nextInitial))
          return s.withCoda('t');
        return s;
      }
      return s;
    });
    return new Phrase(newSyllables, this.isCompound);
  }

  toRaw(): string {
    const separator = this.isCompound ? '-' : ' ';
    return this.syllables.map((s) => s.toRaw()).join(separator);
  }

  toString(useCompound?: boolean): string {
    const activeCompound = useCompound ?? this.isCompound;
    const separator = activeCompound ? '-' : ' ';
    return this.syllables.map((s) => s.toString()).join(separator);
  }

  toCursive(useCompound?: boolean): string {
    const activeCompound = useCompound ?? this.isCompound;
    const separator = activeCompound ? '-' : ' ';
    return this.syllables.map((s) => s.toCursive()).join(separator);
  }

  toIPA(): string {
    return this.syllables.map((s) => s.toIPA()).join(' ');
  }

  toFengIPA(): string {
    const validSyllables = this.syllables.filter((s) => s.isValid());
    if (validSyllables.length === 0) return '';

    return validSyllables
      .map((s, index) => {
        const isLast = index === validSyllables.length - 1;
        return s.renderFeng(isLast);
      })
      .join(' ');
  }
}

export class Utterance {
  constructor(public readonly phrases: Phrase[]) {}

  static of(input: string, scheme: Scheme = 'typing'): Utterance {
    const trimmed = input.trim();
    if (!trimmed) return new Utterance([]);
    return new Utterance(trimmed.split(/\s+/).map((p) => Phrase.of(p, scheme)));
  }

  toRaw(): string {
    return this.phrases.map((p) => p.toRaw()).join(' ');
  }

  toString(useCompound?: boolean): string {
    return this.phrases.map((p) => p.toString(useCompound)).join(' ');
  }

  toCursive(useCompound?: boolean): string {
    return this.phrases.map((p) => p.toCursive(useCompound)).join(' ');
  }

  toIPA(): string {
    return this.phrases.map((p) => p.toIPA()).join(' ');
  }

  toSyllables(): Syllable[] {
    return this.phrases.flatMap((phrase) => phrase.syllables);
  }
}

export const phonologyToBanguace = (
  phobologyInitial: string,
  phonologyFinal: string,
  phonologyTone: string
) => {
  const initial = phonologyBanguaceInitialMap[phobologyInitial] ?? '';
  const rhythm =
    phonologyBanguaceRhythmMap[`${phonologyFinal}${phonologyTone}`] ?? '';
  return `${initial}${rhythm}`;
};
