"use client";

import { FC, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { Sun, Moon } from "lucide-react"; // ✅ Modern icons

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  // Toggle theme
  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  // Update <html> background for full screen effect
  useEffect(() => {
    if (!isSSR) {
      const html = document.documentElement;
      html.classList.remove("bg-white", "bg-gray-900");
      if (theme === "dark") {
        html.classList.add("bg-gray-900");
      } else {
        html.classList.add("bg-white");
      }
    }
  }, [theme, isSSR]);

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "dark" && !isSSR,
    "aria-label": `Switch to ${theme === "light" ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-1 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>

      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          className: clsx(
            "flex items-center justify-center w-auto h-auto rounded-lg !ring-0 !outline-none !focus:ring-0 !active:ring-0 !bg-transparent",
            classNames?.wrapper
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <Sun
            size={22}
            className="text-yellow-500 hover:text-yellow-400 transition-transform duration-300"
          />
        ) : (
          <Moon
            size={22}
            className="text-blue-300 hover:text-blue-400 transition-transform duration-300"
          />
        )}
      </div>
    </Component>
  );
};
