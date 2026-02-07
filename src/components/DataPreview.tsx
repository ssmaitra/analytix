import type { CsvDataset } from '../types';

interface Props {
  dataset: CsvDataset;
  maxRows?: number;
}

export default function DataPreview({ dataset, maxRows = 20 }: Props) {
  const displayRows = dataset.rows.slice(0, maxRows);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700">
          {dataset.name} — showing {displayRows.length} of {dataset.rows.length} rows
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50">
              {dataset.headers.map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                {dataset.headers.map((h) => (
                  <td key={h} className="px-3 py-1.5 text-slate-700 whitespace-nowrap">
                    {row[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
