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
  readonly tight: Final | null;
};

export class Syllable {
  constructor(public readonly value: Readonly<SyllableData>) {
    Object.freeze(this.value);
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
      tight: null,
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

  withTight(newTight: Final): Syllable {
    return new Syllable({ ...this.value, tight: newTight });
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
