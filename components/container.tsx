import React from "react";
import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "mx-auto w-full",
        "px-2 sm:px-2 md:px-2 lg:px-0",
        "max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};
