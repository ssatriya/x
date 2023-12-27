"use client";

import Icons from "@/components/icons";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black" />
      <Icons.x className="z-[70] fill-white h-24 w-24" />
    </div>
  );
};
export default LoadingOverlay;
