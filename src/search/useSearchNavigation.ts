import { useRoute, useRouter } from 'vue-router';
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

const homeRoutes = new Set<string>(Object.values(homeRouteByMode));
const searchRoutes = new Set<string>(Object.values(searchRouteByMode));

export function useSearchNavigation() {
  const route = useRoute();
  const router = useRouter();
  const preferences = usePreferencesStore();
  const mode = useSearchMode();

  const search = (query: string) => {
    return router.push({
      name: searchRouteByMode[mode.value],
      query: { q: query },
    });
  };

  const switchMode = (nextMode: SearchMode) => {
    preferences.setMode(nextMode);

    if (homeRoutes.has(route.name as string)) {
      return router.push({
        name: homeRouteByMode[nextMode],
      });
    }

    if (searchRoutes.has(route.name as string)) {
      return router.push({
        name: searchRouteByMode[nextMode],
        query: { q: route.query.q },
      });
    }
  };

  return {
    search,
    switchMode,
  };
}
