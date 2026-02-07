import type { CsvDataset, WidgetConfig } from '../../types';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function DataTableWidget({ widget, dataset }: Props) {
  const columns = widget.columns?.length ? widget.columns : dataset.headers;
  const displayRows = dataset.rows.slice(0, 100);

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-xs">
        <thead className="sticky top-0">
          <tr className="bg-slate-50">
            {columns.map((h) => (
              <th key={h} className="px-2 py-1.5 text-left font-semibold text-slate-600 whitespace-nowrap border-b border-slate-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
              {columns.map((h) => (
                <td key={h} className="px-2 py-1 text-slate-700 whitespace-nowrap">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {dataset.rows.length > 100 && (
        <div className="text-center text-xs text-slate-400 py-2">
          Showing 100 of {dataset.rows.length} rows
        </div>
      )}
    </div>
  );
}
