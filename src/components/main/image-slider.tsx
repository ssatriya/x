"use client";

import * as React from "react";

import { Button } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import Icons from "../icons";
import { ExtendedPost } from "@/lib/db/schema";

type ImageSliderProps = {
  slides: string[];
  post: ExtendedPost;
  onClose: () => void;
  isOpen: boolean;
};

const ImageSlider = ({ slides, post, onClose, isOpen }: ImageSliderProps) => {
  // const imagePosition = usePhotoNumber((state) => state.photoNumber);
  const imagePosition = 1;

  const [currentIndex, setCurrentIndex] = React.useState(imagePosition - 1);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    const url = `/${post.users.username}/status/${post.id}/photo/${
      +newIndex + 1
    }`;
    if (isOpen) {
      window.history.pushState("page2", "Title", url);
    }
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);

    const url = `/${post.users.username}/status/${post.id}/photo/${
      +newIndex + 1
    }`;
    if (isOpen) {
      window.history.pushState("page2", "Title", url);
    }
  };

  return (
    <div
      className=" h-[94%] flex items-center z-50"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
    >
      <div className="flex items-center w-full z-50">
        <Button
          disabled={currentIndex + 1 <= 1 && currentIndex < slides.length}
          onClick={goToPrevious}
          isIconOnly
          disableAnimation
          className={cn(
            "rounded-full absolute left-6 bg-transparent hover:bg-text/10",
            currentIndex + 1 <= 1 && currentIndex < slides.length && "hidden"
          )}
        >
          <Icons.arrowLeft className="h-5 w-5 fill-text" />
        </Button>
        <Button
          disabled={currentIndex > 0 && currentIndex + 1 === slides.length}
          onClick={goToNext}
          isIconOnly
          disableAnimation
          className={cn(
            "rounded-full absolute right-6 bg-transparent hover:bg-text/10",
            currentIndex > 0 && currentIndex + 1 === slides.length && "hidden",
            slides.length === 1 && "hidden"
          )}
        >
          <Icons.arrowRight className="h-5 w-5 fill-text" />
        </Button>
      </div>

      <div
        className="w-full h-[96%] absolute right-[50%] left-[50%] translate-x-[-50%] top-0 cursor-default flex items-center justify-center"
        onClick={onClose}
      >
        {/* The sizing not quite right with Image component */}
        {/* <Image
          priority
          src={slides[currentIndex]}
          alt="attachment"
          fill
          className="w-fit max-h-[96%] object-cover cursor-default z-50"
        /> */}
        <img
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="w-fit max-h-[96%] object-cover"
          alt="Attachment"
          src={slides[currentIndex]}
        />
      </div>
    </div>
  );
};
export default ImageSlider;
