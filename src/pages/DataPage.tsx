import { useRef, useState } from 'react';
import type { CsvDataset } from '../types';
import { parseCsvFile } from '../utils/csvParser';
import DataPreview from '../components/DataPreview';

interface Props {
  datasets: CsvDataset[];
  addDataset: (d: CsvDataset) => void;
  deleteDataset: (id: string) => void;
}

export default function DataPage({ datasets, addDataset, deleteDataset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const dataset = await parseCsvFile(file);
      addDataset(dataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const previewDataset = previewId ? datasets.find((d) => d.id === previewId) : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Data Sources</h2>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
          + Upload CSV
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Parsing CSV file...
        </div>
      )}

      {datasets.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg mb-2">No datasets uploaded</p>
          <p className="text-sm">Upload a CSV file to get started with analytics</p>
        </div>
      ) : (
        <div className="space-y-3">
          {datasets.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-800">{d.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {d.rows.length} rows &middot; {d.headers.length} columns &middot;{' '}
                  {d.fileName} &middot; Uploaded {new Date(d.uploadedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Columns: {d.headers.slice(0, 6).join(', ')}
                  {d.headers.length > 6 ? ` +${d.headers.length - 6} more` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewId(previewId === d.id ? null : d.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {previewId === d.id ? 'Hide' : 'Preview'}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this dataset?')) deleteDataset(d.id);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewDataset && (
        <div className="mt-6">
          <DataPreview dataset={previewDataset} />
        </div>
      )}
    </div>
  );
}
