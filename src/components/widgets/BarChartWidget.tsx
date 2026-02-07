import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CsvDataset, WidgetConfig } from '../../types';
import { aggregateForChart } from '../../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function BarChartWidget({ widget, dataset }: Props) {
  if (!widget.xColumn || !widget.yColumn) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Configure X and Y columns</div>;
  }

  const data = aggregateForChart(dataset.rows, widget.xColumn, widget.yColumn);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
