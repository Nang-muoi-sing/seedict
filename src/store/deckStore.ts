import { defineStore } from 'pinia';
import { apiV1Url } from '../utils/api';
import { circleExplanations } from '../utils/typography';

export type Word = {
  w: string;
  text: string;
  pron: string;
  expl: string[];
};

export const useDeckStore = defineStore('deck', {
  state: () => ({
    words: [] as Word[],
    gone: new Set<number>(),
  }),

  getters: {
    cards(state) {
      return state.words.map((word) => ({
        ...word,
        expl: circleExplanations(word.expl),
      }));
    },

    // 判断是否还有未移除的卡片
    hasRemainingCards(state) {
      return state.gone.size < state.words.length;
    },
  },

  actions: {
    /**
     * 获取单词数据
     */
    async fetchDeck() {
      const response = await fetch(apiV1Url('/shuffle/'));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.status === 200 && responseData.data?.randomWords) {
        this.words = responseData.data.randomWords;
        this.gone = new Set<number>();
      } else {
        throw new Error('无效的响应数据格式');
      }
    },

    /**
     * 添加已移除的卡片索引
     * @param index 卡片索引
     */
    addGoneIndex(index: number) {
      if (index >= 0 && index < this.words.length) {
        this.gone.add(index);
      }
    },

    /**
     * 重置所有状态（手动触发刷新）
     */
    reset() {
      this.words = [];
      this.gone = new Set<number>();
    },
  },
});
