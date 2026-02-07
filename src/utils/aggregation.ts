export function toNumber(val: string): number | null {
  if (val === '' || val === null || val === undefined) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

export function isNumericColumn(rows: Record<string, string>[], column: string): boolean {
  const sample = rows.slice(0, 50);
  const numericCount = sample.filter((r) => toNumber(r[column]) !== null).length;
  return numericCount / sample.length > 0.7;
}

export function getNumericColumns(rows: Record<string, string>[], headers: string[]): string[] {
  return headers.filter((h) => isNumericColumn(rows, h));
}

export function getCategoryColumns(rows: Record<string, string>[], headers: string[]): string[] {
  return headers.filter((h) => !isNumericColumn(rows, h));
}

export interface SummaryStats {
  column: string;
  count: number;
  mean: number;
  min: number;
  max: number;
  sum: number;
}

export function computeSummary(rows: Record<string, string>[], column: string): SummaryStats {
  const values = rows.map((r) => toNumber(r[column])).filter((v): v is number => v !== null);
  const count = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = count > 0 ? sum / count : 0;
  const min = count > 0 ? Math.min(...values) : 0;
  const max = count > 0 ? Math.max(...values) : 0;
  return { column, count, mean, min, max, sum };
}

export type AggFn = 'sum' | 'avg' | 'count' | 'min' | 'max';

export function aggregate(values: number[], fn: AggFn): number {
  if (values.length === 0) return 0;
  switch (fn) {
    case 'sum': return values.reduce((a, b) => a + b, 0);
    case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'count': return values.length;
    case 'min': return Math.min(...values);
    case 'max': return Math.max(...values);
  }
}

export interface PivotResult {
  rowKeys: string[];
  colKeys: string[];
  cells: Map<string, number>;
  rowTotals: Map<string, number>;
  colTotals: Map<string, number>;
  grandTotal: number;
}

export function computePivot(
  rows: Record<string, string>[],
  rowCol: string,
  colCol: string,
  valCol: string,
  aggFn: AggFn = 'sum'
): PivotResult {
  const grouped = new Map<string, number[]>();
  const rowKeySet = new Set<string>();
  const colKeySet = new Set<string>();

  for (const row of rows) {
    const rk = row[rowCol] ?? 'Unknown';
    const ck = row[colCol] ?? 'Unknown';
    const val = toNumber(row[valCol]);
    if (val === null) continue;
    rowKeySet.add(rk);
    colKeySet.add(ck);
    const key = `${rk}|||${ck}`;
    const arr = grouped.get(key);
    if (arr) arr.push(val);
    else grouped.set(key, [val]);
  }

  const rowKeys = [...rowKeySet].sort();
  const colKeys = [...colKeySet].sort();
  const cells = new Map<string, number>();
  const rowTotals = new Map<string, number>();
  const colTotals = new Map<string, number>();

  for (const rk of rowKeys) {
    const rowVals: number[] = [];
    for (const ck of colKeys) {
      const vals = grouped.get(`${rk}|||${ck}`) ?? [];
      const result = vals.length > 0 ? aggregate(vals, aggFn) : 0;
      cells.set(`${rk}|||${ck}`, result);
      rowVals.push(result);
    }
    rowTotals.set(rk, rowVals.reduce((a, b) => a + b, 0));
  }

  for (const ck of colKeys) {
    let total = 0;
    for (const rk of rowKeys) {
      total += cells.get(`${rk}|||${ck}`) ?? 0;
    }
    colTotals.set(ck, total);
  }

  const grandTotal = [...rowTotals.values()].reduce((a, b) => a + b, 0);

  return { rowKeys, colKeys, cells, rowTotals, colTotals, grandTotal };
}

export function aggregateForChart(
  rows: Record<string, string>[],
  xCol: string,
  yCol: string,
  limit = 30
): { name: string; value: number }[] {
  const grouped = new Map<string, number[]>();
  for (const row of rows) {
    const key = row[xCol] ?? 'Unknown';
    const val = toNumber(row[yCol]);
    if (val === null) continue;
    const arr = grouped.get(key);
    if (arr) {
      arr.push(val);
    } else {
      grouped.set(key, [val]);
    }
  }

  const result: { name: string; value: number }[] = [];
  for (const [name, values] of grouped) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    result.push({ name, value: Math.round(avg * 100) / 100 });
  }

  result.sort((a, b) => b.value - a.value);
  return result.slice(0, limit);
}
