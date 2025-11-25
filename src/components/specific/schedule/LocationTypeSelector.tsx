import { cloneElement } from "react";
import { HomeIcon, BuildingIcon, SchoolIcon } from "../../icons";
import LocationIconMono from "../../icons/LocationIconMono";

type LocationType = "home" | "company" | "school" | "etc";

type Props = {
  value: LocationType;
  onChange: (v: LocationType) => void;
};

export default function LocationTypeSelector({ value, onChange }: Props) {
  const options = [
    { key: "home", label: "집", icon: <HomeIcon /> },
    { key: "company", label: "회사", icon: <BuildingIcon /> },
    { key: "school", label: "학교", icon: <SchoolIcon /> },
    { key: "etc", label: "기타", icon: <LocationIconMono /> }, 
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {options.map((o) => {
        const active = value === o.key;

        const coloredIcon = cloneElement(o.icon, {
          className: "stroke-current text-inherit",
        });

        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`
              flex items-center justify-center gap-2 h-12 rounded-xl border transition

              ${active
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"}
            `}
          >
            {coloredIcon}
            <span className="text-sm font-medium">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
