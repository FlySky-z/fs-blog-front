import { create } from 'zustand';

interface SearchState {
  keyword: string;
  tag: string;
  sortOrder: 'comprehensive' | 'latest' | 'hottest';
  setKeyword: (keyword: string) => void;
  setTag: (tag: string) => void;
  setSortOrder: (order: 'comprehensive' | 'latest' | 'hottest') => void;
  updateKeywordAndUrl: (keyword: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keyword: '',
  sortOrder: 'comprehensive',
  tag: '',

  setKeyword: (keyword: string) => set({ keyword }),

  setTag: (tag: string) => set({ tag: tag }),

  setSortOrder: (order: 'comprehensive' | 'latest' | 'hottest') => set({ sortOrder: order }),

  updateKeywordAndUrl: (keyword: string) => {
    if (!keyword.trim()) return;

    set({ keyword: keyword.trim() });

    // 更新URL，但不刷新页面
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('q', keyword.trim());
      window.history.pushState({}, '', url.toString());
    }
  },
}));
