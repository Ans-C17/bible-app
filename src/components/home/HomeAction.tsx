import type { LucideIcon } from "lucide-react";

type HomeActionProps = {
  label: string;
  icon: LucideIcon;
  glow: string;
};

export function HomeAction({ label, icon: Icon, glow }: HomeActionProps) {
  return (
    <button
      className={[
        "group relative flex h-16 w-full flex-col items-center justify-center",
        "rounded-xl border sm:h-20 sm:rounded-2xl lg:h-24",
        "transition-all duration-200",
        "active:scale-[0.96]",
        "hover:-translate-y-0.5",
      ].join(" ")}
      style={{
        background: `linear-gradient(145deg, ${glow}75, ${glow}38)`,
        borderColor: `${glow}CC`,
        boxShadow: `0 0 0 1px ${glow}35, 0 6px 16px -8px ${glow}90`,
      }}
    >
      <div
        className={[
          "relative flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 lg:h-9 lg:w-9",
        ].join(" ")}
        style={{
          background: glow,
          color: "#0a1128", // dark icon on the solid chip, match to your bg
        }}
      >
        <Icon
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
          strokeWidth={2}
        />
      </div>

      <span
        className={[
          "relative mt-1 text-[10px] font-medium text-white sm:mt-1.5 sm:text-[11px] lg:text-xs",
        ].join(" ")}
      >
        {label}
      </span>

      {/* subtle glow, hover only — a small lift, not a spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 20px -6px ${glow}80`,
        }}
      />
    </button>
  );
}
