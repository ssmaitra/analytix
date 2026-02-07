import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CsvDataset, WidgetConfig } from '../../types';
import { toNumber } from '../../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function ScatterChartWidget({ widget, dataset }: Props) {
  if (!widget.xColumn || !widget.yColumn) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Configure X and Y columns</div>;
  }

  const data = dataset.rows
    .map((row) => {
      const x = toNumber(row[widget.xColumn!]);
      const y = toNumber(row[widget.yColumn!]);
      if (x === null || y === null) return null;
      return { x, y };
    })
    .filter((d): d is { x: number; y: number } => d !== null)
    .slice(0, 500);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name={widget.xColumn} tick={{ fontSize: 10 }} />
        <YAxis type="number" dataKey="y" name={widget.yColumn} tick={{ fontSize: 10 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#3b82f6" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
