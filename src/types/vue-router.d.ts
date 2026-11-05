import 'vue-router';
import type { SearchMode } from '@/search/mode';

declare module 'vue-router' {
  interface RouteMeta {
    searchMode?: SearchMode;
    noScroll?: boolean;
  }
}
