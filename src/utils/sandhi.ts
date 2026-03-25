import { FINAL_DETAILS, ToneCategory, TONE_DETAILS } from './mapping';

import { Syllable, Phrase } from './phonetics';

import type { Tone } from './mapping';

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

export const applyVowelSandhi = (phrase: Phrase): Phrase => {
  if (!phrase.isCompound) return phrase;

  const newSyllables = phrase.syllables.map((s, i) => {
    const next = phrase.syllables[i + 1];
    if (!next || !s.isValid()) return s;
    const final = FINAL_DETAILS[s.value.final];
    if (!final.isLoose) return s;
    return s.withFinal(s.value.tight || final.tightVersion[0]);
  });

  return new Phrase(newSyllables, phrase.isCompound);
};

/**
 * 松紧变韵有一对多的问题，需要找到歧义点
 */
export const getVowelAmbiguities = (phrase: Phrase) => {
  if (!phrase.isCompound) return [];
  const lastIdx = phrase.syllables.length - 1;

  return phrase.syllables.flatMap((s, i) => {
    if (i === lastIdx) return [];
    const rawFinal = s.value.finalRaw;
    if (!rawFinal) return [];

    const detail = FINAL_DETAILS[rawFinal];
    if (detail?.isLoose && detail.tightVersion.length > 1) {
      return [
        {
          index: i,
          options: detail.tightVersion,
        },
      ];
    }
    return [];
  });
};

export const applyToneSandhi = (phrase: Phrase): Phrase => {
  const len = phrase.syllables.length;
  if (len < 2 || !phrase.isCompound) return phrase;

  if (len === 2) {
    return new Phrase(
      applyBiToneSandhi(phrase.syllables[0], phrase.syllables[1]),
      phrase.isCompound
    );
  }

  if (len === 3) {
    return new Phrase(
      applyTriToneSandhi(
        phrase.syllables[0],
        phrase.syllables[1],
        phrase.syllables[2]
      ),
      phrase.isCompound
    );
  }

  const result = [...phrase.syllables];
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
  return new Phrase(result, phrase.isCompound);
};

export const applyProgressAssimilation = (phrase: Phrase): Phrase => {
  if (!phrase.isCompound) return phrase;

  const newSyllables = phrase.syllables.map((s, i) => {
    const prev = phrase.syllables[i - 1];

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
  return new Phrase(newSyllables, phrase.isCompound);
};

export const applyRegressAssimilation = (phrase: Phrase): Phrase => {
  if (!phrase.isCompound) return phrase;

  const newSyllables = phrase.syllables.map((s, i) => {
    const next = phrase.syllables[i + 1];

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
  return new Phrase(newSyllables, phrase.isCompound);
};
