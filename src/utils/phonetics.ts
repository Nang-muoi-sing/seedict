import {
  FINALS,
  INITIALS,
  phonologyBanguaceInitialMap,
  phonologyBanguaceRhythmMap,
  ToneCategory,
  toneCategoryMap,
  TONES,
  yngpingFengIPAEndToneMap,
  yngpingFengIPAFinalMap,
  yngpingFengIPAInitialMap,
  yngpingFengIPAToneMap,
  yngpingIPAFinalMap,
  yngpingIPAInitialMap,
  yngpingIPAToneMap,
  yngpingTypingCursiveFinalMap,
  yngpingVowelToneMap,
  CURSIVE_TO_TYPING_RHYTHM_MAP,
  IPA_LOOKUPS,
} from './mapping';

import type { Final, Initial, Tone } from './mapping';

export const yngpingInitialPattern = /^(b|p|m|d|t|l|s|z|c|g|k|h|w|j|ng|nj|n)/;

export const isInitial = (value: unknown): value is Initial => {
  if (typeof value !== 'string') return false;
  return (INITIALS as readonly string[]).includes(value);
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
  scheme: Scheme = 'typing'
): [Initial | null, Final | null, Tone | null] => {
  const text = input.trim();
  if (!text) return [null, null, null];

  switch (scheme) {
    case 'cursive':
      return parseCursiveSyllable(text);
    case 'ipa':
      return parseIPASyllable(text);
    case 'typing':
    default:
      return parseTypingSyllable(text);
  }
};

const parseTone = (
  yngping: string
): { tone: Tone | null; remaining: string } => {
  if (yngping.startsWith('{') && yngping.endsWith('}')) {
    const inner = yngping.replace(/\{|\}/g, '');
    if (!/\d+$/.test(inner))
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
  yngping: string
): [Initial | null, Final | null, Tone | null] => {
  const input = yngping.trim();
  if (input.length === 0) return [null, null, null];
  const { tone, remaining } = parseTone(input);

  const initialMatch = remaining.match(yngpingInitialPattern);
  const initial =
    initialMatch && isInitial(initialMatch[0]) ? initialMatch[0] : '';

  const finalStr = initial ? remaining.slice(initial.length) : remaining;
  let final: Final | null = null;
  if (finalStr) {
    // ng 既作声母也作韵母，当没有其他韵母时就是韵母
    if (initial === 'ng' && finalStr === '') {
      final = 'ng';
    } else if (isFinal(finalStr)) {
      final = finalStr;
    }
  }

  const finalResult = final === 'ng' && initial === 'ng' ? 'ng' : final;
  const initialResult = final === 'ng' && initial === 'ng' ? null : initial;
  return [initialResult, finalResult, tone];
};

const parseCursiveSyllable = (
  input: string
): [Initial | null, Final | null, Tone | null] => {
  if (input.startsWith('{') && input.endsWith('}')) {
    const inner = input.slice(1, -1);
    const initialMatch = inner.match(yngpingInitialPattern);
    const initial = initialMatch ? (initialMatch[0] as Initial) : null;
    const final = (initial ? inner.slice(initial.length) : inner) as Final;
    return [initial, final, '']; // 无定调
  }

  const initialMatch = input.match(yngpingInitialPattern);
  const initial =
    initialMatch && isInitial(initialMatch[0]) ? initialMatch[0] : null;
  const rest = initial ? input.slice(initial.length) : input;

  const match = CURSIVE_TO_TYPING_RHYTHM_MAP[rest];
  if (match) {
    return [initial, match.final, match.tone];
  }

  return [initial, null, null];
};

const parseIPASyllable = (
  input: string
): [Initial | null, Final | null, Tone | null] => {
  let remaining = input;
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

  // 匹配韵母
  const fEntry = IPA_LOOKUPS.finals.find(([, ipa]) => remaining === ipa);
  if (fEntry) final = fEntry[0] as Final;

  return [initial, final, tone];
};

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

  static of(input: string, scheme: Scheme = 'typing'): Syllable {
    const [initial, final, tone] = parseSyllable(input, scheme);
    return new Syllable({
      raw: input.trim(),
      initialRaw: initial,
      finalRaw: final,
      toneRaw: tone,
      initial: initial ?? null,
      final: final ?? null,
      tone: tone ?? null,
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

  getTone(): ToneCategory | null {
    if (!this.isValid()) return null;
    const category = toneCategoryMap[this.value.tone] ?? null;
    if (category === null) return null;

    const end = this.value.final.charAt(this.value.final.length - 1);
    if (category === ToneCategory.YinRu || category === ToneCategory.YangRu) {
      if (end !== 'h' && end !== 'k') return null;
    }
    return category;
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
    const [final, vowel] = yngpingTypingCursiveFinalMap[this.value.final];
    const tonedVowel = yngpingVowelToneMap[vowel][this.value.tone];
    const cursive = `${this.value.initial}${final.replace(vowel, tonedVowel)}`;
    if (this.hasFixedTone()) return cursive;
    return `{${cursive}}`;
  }

  toIPA(): string {
    if (!this.isValid()) return '';
    return `${yngpingIPAInitialMap[this.value.initial]}${yngpingIPAFinalMap[this.value.final]}${yngpingIPAToneMap[this.value.tone]}`;
  }

  renderFeng(isLast: boolean): string {
    if (!this.isValid()) return '';

    const { initial, final, tone } = this.value;
    const toneMap = isLast ? yngpingFengIPAEndToneMap : yngpingFengIPAToneMap;
    const ipaTone = toneMap[tone] ?? '';

    return `${yngpingFengIPAInitialMap[initial]}${yngpingFengIPAFinalMap[final]}${ipaTone}`;
  }
}

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

    const syllables = trimmed
      .split(splitPattern)
      .map((s) => Syllable.of(s, scheme));

    return new Phrase(syllables, forceCompound ?? hasHyphen);
  }

  // applySandhi(): Phrase {
  //   let result = this.syllables;

  //   result = this.applyAssimilation(result);
  //   result = this.applyInitialChange(result);
  //   result = this.applyToneSandhi(result);

  //   return new Phrase(result);
  // }

  // private applyAssimilation(syllables: Syllable[]): Syllable[] {
  //   return syllables.map((s, i) => {
  //     const next = syllables[i + 1];
  //     if (!next || !s.isValid()) return s;

  //     // if (s.getFinal() === 'n' && next.getInitial() === 'b') {
  //     //   return s.withFinal('m');
  //     // }
  //     return s;
  //   });
  // }

  // private applyInitialChange(syllables: Syllable[]): Syllable[] {
  //   return syllables.map((s, i) => {
  //     const prev = syllables[i - 1];
  //     if (!prev || !s.isValid()) return s;

  //     // if (prev.isVowelEnding() && s.getInitial() === 'k') {
  //     //   return s.withInitial('g');
  //     // }
  //     return s;
  //   });
  // }

  // private applyToneSandhi(syllables: Syllable[]): Syllable[] {
  //   return syllables.map((s, i) => {
  //     const next = syllables[i + 1];
  //     if (!next || !s.isValid()) return s;

  //     if (s.getTone() === '3' && next.getTone() === '3') {
  //       return s.withTone('2');
  //     }
  //     return s;
  //   });
  // }

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
