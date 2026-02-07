import type { CsvDataset, WidgetConfig } from '../../types';
import { computeSummary, getNumericColumns } from '../../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function SummaryStatsWidget({ widget, dataset }: Props) {
  const numCols = widget.yColumn
    ? [widget.yColumn]
    : getNumericColumns(dataset.rows, dataset.headers);

  if (numCols.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">No numeric columns found</div>;
  }

  const stats = numCols.map((col) => computeSummary(dataset.rows, col));

  return (
    <div className="grid grid-cols-2 gap-2 text-xs h-full content-start overflow-auto">
      {stats.map((s) => (
        <div key={s.column} className="bg-slate-50 rounded-lg p-2">
          <div className="font-semibold text-slate-700 mb-1 truncate">{s.column}</div>
          <div className="space-y-0.5 text-slate-500">
            <div className="flex justify-between"><span>Count</span><span className="font-medium text-slate-700">{s.count.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Mean</span><span className="font-medium text-slate-700">{s.mean.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Min</span><span className="font-medium text-slate-700">{s.min.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Max</span><span className="font-medium text-slate-700">{s.max.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Sum</span><span className="font-medium text-slate-700">{s.sum.toFixed(2)}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}
