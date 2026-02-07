import type { CsvDataset, WidgetConfig } from '../types';
import BarChartWidget from './widgets/BarChartWidget';
import LineChartWidget from './widgets/LineChartWidget';
import PieChartWidget from './widgets/PieChartWidget';
import ScatterChartWidget from './widgets/ScatterChartWidget';
import SummaryStatsWidget from './widgets/SummaryStatsWidget';
import DataTableWidget from './widgets/DataTableWidget';

interface Props {
  widget: WidgetConfig;
  dataset: CsvDataset | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export default function WidgetRenderer({ widget, dataset, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 h-full flex flex-col overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 widget-drag-handle cursor-grab">
        <h4 className="text-sm font-semibold text-slate-700 truncate">{widget.title}</h4>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="px-2 py-0.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-0.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            &times;
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-auto min-h-0">
        {!dataset ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No dataset selected
          </div>
        ) : (
          <WidgetContent widget={widget} dataset={dataset} />
        )}
      </div>
    </div>
  );
}

function WidgetContent({ widget, dataset }: { widget: WidgetConfig; dataset: CsvDataset }) {
  switch (widget.type) {
    case 'bar-chart':
      return <BarChartWidget widget={widget} dataset={dataset} />;
    case 'line-chart':
      return <LineChartWidget widget={widget} dataset={dataset} />;
    case 'pie-chart':
      return <PieChartWidget widget={widget} dataset={dataset} />;
    case 'scatter-chart':
      return <ScatterChartWidget widget={widget} dataset={dataset} />;
    case 'summary-stats':
      return <SummaryStatsWidget widget={widget} dataset={dataset} />;
    case 'data-table':
      return <DataTableWidget widget={widget} dataset={dataset} />;
    default:
      return <div className="text-xs text-slate-400">Unknown widget type</div>;
  }
}
