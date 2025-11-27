import React from "react";

interface HeroBackgroundProps {
  children: React.ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ children }) => {
  return (
    <div className="w-full relative lg:pb-3 ">
      {/* Light Mode Background */}
      <div
        className="absolute inset-0 block dark:hidden rounded-2xl"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.05) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.05) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />

      {/* Dark Mode Background */}
      <div
        className="absolute inset-0 hidden dark:block rounded-2xl"
        style={{
          backgroundColor: "#101828",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />

      {/* Children Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HeroBackground;
