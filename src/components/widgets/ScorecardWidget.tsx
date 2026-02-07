import type { CsvDataset, WidgetConfig } from '../../types';
import { toNumber, aggregate, getNumericColumns } from '../../utils/aggregation';
import type { AggFn } from '../../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function ScorecardWidget({ widget, dataset }: Props) {
  const col = widget.scorecardColumn;
  const aggFn: AggFn = (widget.scorecardAggFunc as AggFn) ?? 'sum';

  if (!col) {
    const numCols = getNumericColumns(dataset.rows, dataset.headers);
    if (numCols.length === 0) {
      return <div className="h-full flex items-center justify-center text-xs text-slate-400">No numeric columns found</div>;
    }
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Configure a numeric column</div>;
  }

  const values = dataset.rows
    .map((r) => toNumber(r[col]))
    .filter((v): v is number => v !== null);

  const result = aggregate(values, aggFn);

  const formatted = Math.abs(result) >= 1_000_000
    ? (result / 1_000_000).toFixed(2) + 'M'
    : Math.abs(result) >= 1_000
    ? (result / 1_000).toFixed(1) + 'K'
    : Number.isInteger(result)
    ? result.toLocaleString()
    : result.toFixed(2);

  const aggLabel = aggFn.charAt(0).toUpperCase() + aggFn.slice(1);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="text-4xl font-bold text-slate-800 tabular-nums leading-tight">
        {formatted}
      </div>
      <div className="text-sm text-slate-500 mt-2">
        {aggLabel} of {col}
      </div>
      <div className="text-xs text-slate-400 mt-1">
        {values.length.toLocaleString()} values
      </div>
    </div>
  );
}
