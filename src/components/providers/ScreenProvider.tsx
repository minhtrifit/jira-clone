"use client";

import { useScreenWidth } from "@/hooks/useScreenWidth";

type Props = {
  children?: React.ReactNode;
};

const ScreenProvider = ({ children }: Props) => {
  const screen = useScreenWidth();

  if (screen < 700) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white dark:bg-black">
        <p className="text-black dark:text-white text-xl font-bold">
          App is not available on mobile
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ScreenProvider;
