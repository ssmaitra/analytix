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
  | 'data-table'
  | 'pivot-table'
  | 'scorecard';

export type AggregationFunction = 'sum' | 'avg' | 'count' | 'min' | 'max';

export interface WidgetConfig {
  i: string;
  type: WidgetType;
  title: string;
  datasetId: string;
  xColumn?: string;
  yColumn?: string;
  columns?: string[];
  /** Pivot table: row grouping column */
  pivotRowColumn?: string;
  /** Pivot table: column grouping column */
  pivotColColumn?: string;
  /** Pivot table: value column to aggregate */
  pivotValueColumn?: string;
  /** Pivot table: aggregation function */
  pivotAggFunc?: AggregationFunction;
  /** Scorecard: numeric column for the main value */
  scorecardColumn?: string;
  /** Scorecard: aggregation function */
  scorecardAggFunc?: AggregationFunction;
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
