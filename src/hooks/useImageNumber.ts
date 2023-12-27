import { create } from "zustand";

type ImageNumberStore = {
  imageNumber: number;
  setImageNumber: (number: number) => void;
};

export const useImageNumber = create<ImageNumberStore>((set) => ({
  imageNumber: 0,
  setImageNumber: (number: number) => set({ imageNumber: number }),
}));
