import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePreferencesStore } from '@/store/preferencesStore';

export function useSearchMode() {
  const route = useRoute();
  const preferences = usePreferencesStore();

  return computed(() => route.meta.searchMode ?? preferences.mode);
}
