export interface SearchResult {
  w: string;
  text: string;
  pron: string;
  brief: string;
  refs: string[];
}

export interface SearchResponse {
  status: number;
  data: {
    q: string;
    queries: string[];
    results: SearchResult[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}
