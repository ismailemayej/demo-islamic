import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
  id: string;
}

const Background: React.FC<BackgroundProps> = ({ children, id }) => {
  return (
    <section id={id} className="relative py-10 px-4 rounded-xl overflow-hidden">
      {/* Background Gradient + Pattern */}
      <div
        className="
          absolute inset-0 z-0
          bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50
          dark:from-emerald-900 dark:via-cyan-900 dark:to-blue-900
          opacity-70
        "
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px),
            radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Overlay blur and shadow */}
      <div className="relative z-10 backdrop-blur-sm border border-gray-300/40 dark:border-gray-800/40 shadow-xl rounded-xl p-4">
        {children}
      </div>
    </section>
  );
};

export default Background;
