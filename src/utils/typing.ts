interface Glyph {
  glyph: string;
  category: string;
  source: string;
}

export interface Phonetics {
  yngping: string;
  phonologyInitial?: string;
  phonologyFinal?: string;
  phonologyTone?: string;
}

export interface WordSeeDict {
  text: string;
  glyphs: Glyph[];
  commentGlyph?: string;
  pronPrimary: string;
  prons: {
    pron: string;
    isSandhi: boolean;
    location: string;
    source: string;
  }[];
  commentPron?: string;
  phonetics: Phonetics;
  expls: {
    lexical: string;
    expl: string;
    sent: string[];
  }[];
  commentExpl?: string;
  synonym?: string;
  antonym?: string;
}

export interface FengExplNode {
  expl: string;
  sent: string[];
  lexical?: string;
  node?: FengExplNode[];
}

export interface WordFeng {
  text: string;
  pronLiteral: string;
  pronSandhi: string;
  expls: FengExplNode[];
  comment: string;
  correction: string;
  refPage: number;
}

export interface WordCikLing {
  text: string;
  tone: string;
  cikFinal: string;
  cikInitial: string;
  cikAnnotation: string;
  liAnnotateCik: string;
  liAnnotateCikOrder: number | null;
  lingFinal: string;
  lingInitial: string;
  lingAnnotation: string;
  liAnnotateLing: string;
  liAnnotateLingOrder: number | null;
  comment: string;
}

export interface WordResponse {
  status: number;
  data: {
    w: string;
    result: {
      seedict: WordSeeDict;
      fengs: WordFeng[];
      ciklings: WordCikLing[];
    };
  };
}

export interface Audio {
  yngping: string;
  md5: string;
  speaker: string;
}

export interface AudioResponse {
  status: number;
  data: {
    yngping: string;
    results: Audio[];
  };
}
