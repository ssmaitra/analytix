import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CsvDataset, WidgetConfig } from '../../types';
import { aggregateForChart } from '../../utils/aggregation';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset;
}

export default function PieChartWidget({ widget, dataset }: Props) {
  if (!widget.xColumn || !widget.yColumn) {
    return <div className="h-full flex items-center justify-center text-xs text-slate-400">Configure category and value columns</div>;
  }

  const data = aggregateForChart(dataset.rows, widget.xColumn, widget.yColumn, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="70%"
          label={({ name }) => name}
          labelLine={{ strokeWidth: 1 }}
          fontSize={10}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
