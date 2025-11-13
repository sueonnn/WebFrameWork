import React from "react";

type Item = { color: string; label: string };

export default function MapLegend({ items }: { items: Item[] }) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-700">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}
