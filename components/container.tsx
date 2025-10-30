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
        "mx-auto lg:px-0 px-1",
        "max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px]",
        className
      )}
    >
      {children}
    </div>
  );
};
