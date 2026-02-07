import { useState, useEffect, useCallback } from 'react';
import type { Dashboard, CsvDataset } from '../types';

const DASHBOARDS_KEY = 'analytix_dashboards';
const DATASETS_KEY = 'analytix_datasets';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>(() =>
    loadFromStorage<Dashboard[]>(DASHBOARDS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(DASHBOARDS_KEY, dashboards);
  }, [dashboards]);

  const addDashboard = useCallback((dashboard: Dashboard) => {
    setDashboards((prev) => [...prev, dashboard]);
  }, []);

  const updateDashboard = useCallback((updated: Dashboard) => {
    setDashboards((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  }, []);

  const deleteDashboard = useCallback((id: string) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { dashboards, addDashboard, updateDashboard, deleteDashboard };
}

export function useDatasets() {
  const [datasets, setDatasets] = useState<CsvDataset[]>(() =>
    loadFromStorage<CsvDataset[]>(DATASETS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(DATASETS_KEY, datasets);
  }, [datasets]);

  const addDataset = useCallback((dataset: CsvDataset) => {
    setDatasets((prev) => [...prev, dataset]);
  }, []);

  const deleteDataset = useCallback((id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { datasets, addDataset, deleteDataset };
}
