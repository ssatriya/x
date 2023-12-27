import { create } from "zustand";

type PreviousPathStore = {
  previousPath: string | undefined;
  setPreviousPath: (previousPath: string) => void;
};

export const usePreviousPath = create<PreviousPathStore>((set) => ({
  previousPath: undefined,
  setPreviousPath: (previousPath: string) =>
    set({ previousPath: previousPath }),
}));
