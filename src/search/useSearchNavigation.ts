import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useSearchMode } from './useSearchMode';
import { type SearchMode } from './mode';
import { usePreferencesStore } from '@/store/preferencesStore';

const homeRouteByMode = {
  fuzzy: 'home',
  yngping: 'yngping-home',
  semantic: 'semantic-home',
} as const satisfies Record<SearchMode, string>;

const searchRouteByMode = {
  fuzzy: 'search',
  yngping: 'yngping-search',
  semantic: 'semantic-search',
} as const satisfies Record<SearchMode, string>;

export function useSearchNavigation() {
  const router = useRouter();
  const mode = useSearchMode();
  const preferences = usePreferencesStore();

  const homeRoute = computed(() => ({
    name: homeRouteByMode[mode.value],
  }));

  const search = (query: string, nextMode: SearchMode) => {
    preferences.setMode(nextMode);

    return router.push({
      name: searchRouteByMode[nextMode],
      query: { q: query },
    });
  };

  return {
    homeRoute,
    search,
  };
}
