import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
  id: string;
}

const Background: React.FC<BackgroundProps> = ({ children, id }) => {
  return (
    <section
      id={id}
      className="py-10 px-3 rounded-xl 
                 bg-gradient-to-b from-amber-50 to-white 
                 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900 
                 transition-colors duration-500"
    >
      {children}
    </section>
  );
};

export default Background;
