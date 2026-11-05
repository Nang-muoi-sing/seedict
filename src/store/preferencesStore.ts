import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SearchMode } from '@/search/mode';

const STORAGE_KEY = 'seedict.searchPreference';

const readStoredPreferredMode = (): SearchMode => {
  if (typeof window === 'undefined') {
    return 'fuzzy';
  }

  switch (window.localStorage.getItem(STORAGE_KEY)) {
    case 'fuzzy':
      return 'fuzzy';
    case 'yngping':
      return 'yngping';
    case 'semantic':
      return 'semantic';
    default:
      return 'fuzzy';
  }
};

export const usePreferencesStore = defineStore('searchPreferences', () => {
  const preferredMode = ref<SearchMode>(readStoredPreferredMode());

  const setPreferredMode = (mode: SearchMode) => {
    preferredMode.value = mode;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  return {
    mode: preferredMode,
    setMode: setPreferredMode,
  };
});
