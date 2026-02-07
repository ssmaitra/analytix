import { useState } from 'react';
import type { CsvDataset, WidgetConfig } from '../types';
import { getNumericColumns, getCategoryColumns } from '../utils/aggregation';

interface Props {
  widget: WidgetConfig;
  datasets: CsvDataset[];
  onSave: (w: WidgetConfig) => void;
  onClose: () => void;
}

export default function WidgetConfigModal({ widget, datasets, onSave, onClose }: Props) {
  const [config, setConfig] = useState<WidgetConfig>({ ...widget });

  const selectedDataset = datasets.find((d) => d.id === config.datasetId);
  const numericCols = selectedDataset ? getNumericColumns(selectedDataset.rows, selectedDataset.headers) : [];
  const categoryCols = selectedDataset ? getCategoryColumns(selectedDataset.rows, selectedDataset.headers) : [];
  const allCols = selectedDataset?.headers ?? [];

  const needsXY = ['bar-chart', 'line-chart', 'scatter-chart'].includes(config.type);
  const needsPieColumns = config.type === 'pie-chart';
  const needsTableColumns = config.type === 'data-table';

  function handleSave() {
    onSave(config);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">Configure Widget</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
            <input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Dataset</label>
            <select
              value={config.datasetId}
              onChange={(e) => setConfig({ ...config, datasetId: e.target.value, xColumn: undefined, yColumn: undefined })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a dataset</option>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.rows.length} rows)
                </option>
              ))}
            </select>
          </div>

          {needsXY && selectedDataset && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  X Axis (Category)
                </label>
                <select
                  value={config.xColumn ?? ''}
                  onChange={(e) => setConfig({ ...config, xColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {(config.type === 'scatter-chart' ? allCols : categoryCols.length > 0 ? categoryCols : allCols).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Y Axis (Value)
                </label>
                <select
                  value={config.yColumn ?? ''}
                  onChange={(e) => setConfig({ ...config, yColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {numericCols.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {needsPieColumns && selectedDataset && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Category Column
                </label>
                <select
                  value={config.xColumn ?? ''}
                  onChange={(e) => setConfig({ ...config, xColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {(categoryCols.length > 0 ? categoryCols : allCols).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Value Column
                </label>
                <select
                  value={config.yColumn ?? ''}
                  onChange={(e) => setConfig({ ...config, yColumn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {numericCols.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {config.type === 'summary-stats' && selectedDataset && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Numeric Column
              </label>
              <select
                value={config.yColumn ?? ''}
                onChange={(e) => setConfig({ ...config, yColumn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All numeric columns</option>
                {numericCols.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {needsTableColumns && selectedDataset && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Columns to display
              </label>
              <p className="text-xs text-slate-400 mb-2">Leave empty to show all columns</p>
              <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 rounded-lg p-2">
                {allCols.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={!config.columns || config.columns.length === 0 || config.columns.includes(c)}
                      onChange={(e) => {
                        const current = config.columns?.length ? config.columns : allCols;
                        const next = e.target.checked
                          ? [...current, c]
                          : current.filter((col) => col !== c);
                        setConfig({ ...config, columns: next });
                      }}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
