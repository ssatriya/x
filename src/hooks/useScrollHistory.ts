import { create } from "zustand";

type ScrollHistoryStore = {
  fromTop: number | undefined;
  setFromTop: (from: number) => void;
};

export const useScrollHistory = create<ScrollHistoryStore>((set) => ({
  fromTop: undefined,
  setFromTop: (from: number) => {
    set({ fromTop: from });
  },
}));
