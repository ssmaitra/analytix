import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import { v4 as uuidv4 } from 'uuid';
import type { Dashboard, CsvDataset, WidgetConfig, WidgetType } from '../types';
import WidgetRenderer from '../components/WidgetRenderer';
import WidgetConfigModal from '../components/WidgetConfigModal';

interface Props {
  dashboards: Dashboard[];
  updateDashboard: (d: Dashboard) => void;
  datasets: CsvDataset[];
}

export default function DashboardEditorPage({ dashboards, updateDashboard, datasets }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dashboard = dashboards.find((d) => d.id === id);
  const { width, containerRef } = useContainerWidth();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(dashboard?.name ?? '');
  const [configWidget, setConfigWidget] = useState<WidgetConfig | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const save = useCallback(
    (updated: Partial<Dashboard>) => {
      if (!dashboard) return;
      updateDashboard({ ...dashboard, ...updated, updatedAt: new Date().toISOString() });
    },
    [dashboard, updateDashboard]
  );

  if (!dashboard) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>Dashboard not found.</p>
        <button onClick={() => navigate('/dashboards')} className="mt-4 text-blue-600 underline text-sm">
          Back to dashboards
        </button>
      </div>
    );
  }

  const { widgets, name } = dashboard;

  function handleNameSave() {
    if (nameInput.trim()) {
      save({ name: nameInput.trim() });
    }
    setEditingName(false);
  }

  function handleAddWidget(type: WidgetType) {
    const newWidget: WidgetConfig = {
      i: uuidv4(),
      type,
      title: type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      datasetId: datasets[0]?.id ?? '',
      x: 0,
      y: Infinity,
      w: type === 'data-table' || type === 'pivot-table' ? 12 : type === 'scorecard' ? 3 : 6,
      h: type === 'summary-stats' ? 3 : type === 'scorecard' ? 3 : 5,
    };
    setShowAddMenu(false);
    setConfigWidget(newWidget);
  }

  function handleSaveWidgetConfig(widget: WidgetConfig) {
    const exists = widgets.some((w) => w.i === widget.i);
    const updatedWidgets = exists
      ? widgets.map((w) => (w.i === widget.i ? widget : w))
      : [...widgets, widget];
    save({ widgets: updatedWidgets });
    setConfigWidget(null);
  }

  function handleDeleteWidget(widgetId: string) {
    save({ widgets: widgets.filter((w) => w.i !== widgetId) });
  }

  function handleLayoutChange(layout: Layout) {
    const updatedWidgets = widgets.map((w) => {
      const item = layout.find((l: LayoutItem) => l.i === w.i);
      if (!item) return w;
      return { ...w, x: item.x, y: item.y, w: item.w, h: item.h };
    });
    save({ widgets: updatedWidgets });
  }

  const layouts = {
    lg: widgets.map((w) => ({
      i: w.i,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      minW: 3,
      minH: 3,
    })),
  };

  return (
    <div className="p-6" ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboards')}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            &larr; Back
          </button>
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              className="text-2xl font-bold text-slate-800 border-b-2 border-blue-500 outline-none bg-transparent"
            />
          ) : (
            <h2
              className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setNameInput(name);
                setEditingName(true);
              }}
            >
              {name}
            </h2>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Widget
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-48">
              {(
                [
                  ['bar-chart', 'Bar Chart'],
                  ['line-chart', 'Line Chart'],
                  ['pie-chart', 'Pie Chart'],
                  ['scatter-chart', 'Scatter Chart'],
                  ['summary-stats', 'Summary Stats'],
                  ['data-table', 'Data Table'],
                  ['pivot-table', 'Pivot Table'],
                  ['scorecard', 'Scorecard'],
                ] as [WidgetType, string][]
              ).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => handleAddWidget(type)}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {datasets.length === 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          No datasets available. <button onClick={() => navigate('/data')} className="underline font-medium">Upload a CSV</button> first.
        </div>
      )}

      {widgets.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg mb-2">Empty dashboard</p>
          <p className="text-sm">Add widgets using the button above to build your analytics view</p>
        </div>
      ) : (
        <Responsive
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          dragConfig={{ enabled: true, handle: '.widget-drag-handle' }}
          resizeConfig={{ enabled: true, handles: ['se'] }}
        >
          {widgets.map((widget) => (
            <div key={widget.i}>
              <WidgetRenderer
                widget={widget}
                dataset={datasets.find((d) => d.id === widget.datasetId)}
                onEdit={() => setConfigWidget(widget)}
                onDelete={() => handleDeleteWidget(widget.i)}
              />
            </div>
          ))}
        </Responsive>
      )}

      {configWidget && (
        <WidgetConfigModal
          widget={configWidget}
          datasets={datasets}
          onSave={handleSaveWidgetConfig}
          onClose={() => setConfigWidget(null)}
        />
      )}
    </div>
  );
}
