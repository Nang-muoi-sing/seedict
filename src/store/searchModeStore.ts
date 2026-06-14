import { defineStore } from 'pinia';
import { ref } from 'vue';

export type SearchMode = 'fuzzy' | 'semantic';

const STORAGE_KEY = 'seedict.searchMode';

const readStoredMode = (): SearchMode => {
  if (typeof window === 'undefined') {
    return 'fuzzy';
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'semantic' ? 'semantic' : 'fuzzy';
};

export const searchRouteNameByMode: Record<SearchMode, 'search' | 'semantic-search'> = {
  fuzzy: 'search',
  semantic: 'semantic-search',
};

export const buildSearchRoute = (mode: SearchMode, query: string) => ({
  name: searchRouteNameByMode[mode],
  query: { q: query },
});

export const useSearchModeStore = defineStore('searchMode', () => {
  const mode = ref<SearchMode>(readStoredMode());

  const setMode = (nextMode: SearchMode) => {
    mode.value = nextMode;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    }
  };

  const toggleMode = () => {
    setMode(mode.value === 'fuzzy' ? 'semantic' : 'fuzzy');
  };

  return {
    mode,
    setMode,
    toggleMode,
  };
});
