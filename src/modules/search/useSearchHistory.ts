import { ref } from 'vue';

import { Trie } from '@/utils/trie';

const STORAGE_KEY = 'searchHistory';
const MAX_SUGGESTIONS = 10;

const loadTrie = (): Trie => {
  if (typeof window === 'undefined') {
    return new Trie();
  }

  try {
    const json = window.localStorage.getItem(STORAGE_KEY);
    return json ? Trie.deserialize(json) : new Trie();
  } catch (error) {
    console.error('failed to deserialize history: ', error);
    return new Trie();
  }
};

export function useSearchHistory() {
  const trie = loadTrie();
  const suggestions = ref<string[]>([]);

  const persist = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, trie.serialize());
    } catch (error) {
      console.error('failed to save history: ', error);
    }
  };

  const find = (query: string) => {
    const matches = trie.findWords(query);

    matches.sort((a, b) => b.timestamp - a.timestamp);

    suggestions.value = matches
      .slice(0, MAX_SUGGESTIONS)
      .map((item) => item.word);
  };

  const add = (query: string) => {
    trie.insert(query);
    persist();
  };

  const remove = (word: string) => {
    trie.delete(word);
    persist();

    suggestions.value = suggestions.value.filter((item) => item !== word);
  };

  const clear = () => {
    trie.clear();
    suggestions.value = [];

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('failed to clear history: ', error);
    }
  };

  return {
    suggestions,
    find,
    add,
    remove,
    clear,
  };
}
