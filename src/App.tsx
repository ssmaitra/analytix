import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DashboardListPage from './pages/DashboardListPage';
import DashboardEditorPage from './pages/DashboardEditorPage';
import DataPage from './pages/DataPage';
import { useDashboards, useDatasets } from './store/useStore';

export default function App() {
  const { dashboards, addDashboard, updateDashboard, deleteDashboard } = useDashboards();
  const { datasets, addDataset, deleteDataset } = useDatasets();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">Analytix</h1>
          <p className="text-xs text-slate-400 mt-1">Analytics Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLink
            to="/dashboards"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            Dashboards
          </NavLink>
          <NavLink
            to="/data"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            Data Sources
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-700 text-xs text-slate-500">
          {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} loaded
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboards" replace />} />
          <Route
            path="/dashboards"
            element={
              <DashboardListPage
                dashboards={dashboards}
                addDashboard={addDashboard}
                deleteDashboard={deleteDashboard}
              />
            }
          />
          <Route
            path="/dashboards/:id"
            element={
              <DashboardEditorPage
                dashboards={dashboards}
                updateDashboard={updateDashboard}
                datasets={datasets}
              />
            }
          />
          <Route
            path="/data"
            element={
              <DataPage
                datasets={datasets}
                addDataset={addDataset}
                deleteDataset={deleteDataset}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
