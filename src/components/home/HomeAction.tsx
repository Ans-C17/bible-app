import type { LucideIcon } from "lucide-react";

type HomeActionProps = {
  label: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
};

export function HomeAction({
  label,
  icon: Icon,
  color,
  onClick,
}: HomeActionProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex h-16 w-full flex-col items-center justify-center",
        "rounded-xl border sm:h-20 sm:rounded-2xl lg:h-24",
        "transition-all duration-200",
        "active:scale-[0.96]",
        "hover:-translate-y-0.5",
      ].join(" ")}
      style={{
        background: "#ffffff0d",
        borderColor: `${color}80`,
      }}
    >
      <div
        className={[
          "relative flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 lg:h-9 lg:w-9",
        ].join(" ")}
        style={{
          background: color,
          color: "#0a1128",
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
    </button>
  );
}
