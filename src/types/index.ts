export interface CsvDataset {
  id: string;
  name: string;
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  uploadedAt: string;
}

export type WidgetType =
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'scatter-chart'
  | 'summary-stats'
  | 'data-table';

export interface WidgetConfig {
  i: string;
  type: WidgetType;
  title: string;
  datasetId: string;
  xColumn?: string;
  yColumn?: string;
  columns?: string[];
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: string;
  updatedAt: string;
}
