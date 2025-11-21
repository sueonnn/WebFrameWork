interface Props {
  days: { label: string; dateText: string }[];
  hours: number[];
  schedules: Record<string, number>;
  getColor: (v: number) => string;
}

export default function TimelineHeatmapTable({ days, hours, schedules, getColor }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-[2px] text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="w-20"></th>
            {days.map((d) => (
              <th key={d.label} className="w-[120px] text-center">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-800">{d.label}</span>
                  <span className="text-[12px] text-gray-400 mt-[2px]">{d.dateText}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="text-right pr-2 text-xs text-gray-400 whitespace-nowrap">
                {String(hour).padStart(2, "0")}:00
              </td>

              {Array.from({ length: 7 }).map((_, day) => {
                const key = `${day}-${hour}`;
                const value = schedules[key] || 0;

                return (
                  <td
                    key={key}
                    className="h-10 w-[120px] border-[1.5px] border-[#EEEFF2] rounded-sm"
                    style={{ backgroundColor: getColor(value) }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
