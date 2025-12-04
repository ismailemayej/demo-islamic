import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
  id: string;
}

const Background: React.FC<BackgroundProps> = ({ children, id }) => {
  return (
    <section id={id} className="relative px-0 rounded-2xl overflow-hidden">
      {/* Main Soft Gradient (Perfectly Smooth) */}
      <div
        className="
          absolute inset-0 z-0
          bg-gradient-to-br 
          from-blue-50 via-cyan-50 to-blue-100
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        "
      />

      {/* Soft Glow Top Left */}
      <div
        className="
          absolute -top-20 -left-20 w-72 h-72 
          bg-cyan-300/15 dark:bg-cyan-500/10
          blur-[120px] rounded-full
        "
      />

      {/* Soft Glow Bottom Right (Fixed — no harsh overlap) */}
      <div
        className="
          absolute bottom-0 right-0 w-72 h-72 
         
        "
      />

      {/* Very soft pattern (no double color effect) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Content Glass Box */}
      <div className="font-sans relative z-10 backdrop-blur-lg border border-white/20 dark:border-white/5 shadow-xl rounded-2xl p-6">
        {children}
      </div>
    </section>
  );
};

export default Background;
