import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Dashboard } from '../types';

interface Props {
  dashboards: Dashboard[];
  addDashboard: (d: Dashboard) => void;
  deleteDashboard: (id: string) => void;
}

export default function DashboardListPage({ dashboards, addDashboard, deleteDashboard }: Props) {
  const navigate = useNavigate();

  function handleCreate() {
    const id = uuidv4();
    const newDashboard: Dashboard = {
      id,
      name: 'Untitled Dashboard',
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDashboard(newDashboard);
    navigate(`/dashboards/${id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dashboards</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New Dashboard
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg mb-2">No dashboards yet</p>
          <p className="text-sm">Create your first dashboard to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/dashboards/${d.id}`)}
            >
              <h3 className="font-semibold text-slate-800 mb-1">{d.name}</h3>
              <p className="text-xs text-slate-400 mb-3">
                {d.widgets.length} widget{d.widgets.length !== 1 ? 's' : ''} &middot; Updated{' '}
                {new Date(d.updatedAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this dashboard?')) deleteDashboard(d.id);
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
