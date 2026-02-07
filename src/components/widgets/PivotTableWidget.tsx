import type { CsvDataset, WidgetConfig } from '../../types';
import { computePivot } from '../../utils/aggregation';
import type { AggFn } from '../../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function PivotTableWidget({ widget, dataset }: Props) {
  if (!widget.pivotRowColumn || !widget.pivotColColumn || !widget.pivotValueColumn) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Configure row, column, and value fields</div>;
  }

  const pivot = computePivot(
    dataset.rows,
    widget.pivotRowColumn,
    widget.pivotColColumn,
    widget.pivotValueColumn,
    (widget.pivotAggFunc as AggFn) ?? 'sum'
  );

  const fmt = (n: number) => Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2);

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0">
          <tr className="bg-slate-100">
            <th className="px-2 py-1.5 text-left font-semibold text-slate-600 border border-slate-200 sticky left-0 bg-slate-100 z-10">
              {widget.pivotRowColumn} / {widget.pivotColColumn}
            </th>
            {pivot.colKeys.map((ck) => (
              <th key={ck} className="px-2 py-1.5 text-right font-semibold text-slate-600 border border-slate-200 whitespace-nowrap">
                {ck}
              </th>
            ))}
            <th className="px-2 py-1.5 text-right font-bold text-slate-700 border border-slate-200 bg-slate-50">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {pivot.rowKeys.map((rk) => (
            <tr key={rk} className="hover:bg-blue-50/50">
              <td className="px-2 py-1 font-medium text-slate-700 border border-slate-200 whitespace-nowrap sticky left-0 bg-white z-10">
                {rk}
              </td>
              {pivot.colKeys.map((ck) => {
                const val = pivot.cells.get(`${rk}|||${ck}`) ?? 0;
                return (
                  <td key={ck} className="px-2 py-1 text-right text-slate-600 border border-slate-200 tabular-nums">
                    {val !== 0 ? fmt(val) : <span className="text-slate-300">-</span>}
                  </td>
                );
              })}
              <td className="px-2 py-1 text-right font-semibold text-slate-700 border border-slate-200 bg-slate-50 tabular-nums">
                {fmt(pivot.rowTotals.get(rk) ?? 0)}
              </td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold">
            <td className="px-2 py-1.5 text-slate-700 border border-slate-200 sticky left-0 bg-slate-50 z-10">
              Total
            </td>
            {pivot.colKeys.map((ck) => (
              <td key={ck} className="px-2 py-1.5 text-right text-slate-700 border border-slate-200 tabular-nums">
                {fmt(pivot.colTotals.get(ck) ?? 0)}
              </td>
            ))}
            <td className="px-2 py-1.5 text-right text-slate-800 border border-slate-200 tabular-nums">
              {fmt(pivot.grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
