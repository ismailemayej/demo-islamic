import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
  id: string;
}

const Background: React.FC<BackgroundProps> = ({ children, id }) => {
  return (
    <section
      id={id}
      className="
        py-10 px-4 rounded-xl 
        bg-white/70 backdrop-blur-sm 
        dark:bg-gray-900/60 
        border border-gray-300/40 dark:border-gray-800/40
        shadow-xl 
        transition-all duration-300
      "
    >
      {children}
    </section>
  );
};

export default Background;
