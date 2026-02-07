import Papa from 'papaparse';
import type { CsvDataset } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function parseCsvFile(file: File): Promise<CsvDataset> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rows = results.data as Record<string, string>[];
        if (rows.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        const headers = Object.keys(rows[0]);
        resolve({
          id: uuidv4(),
          name: file.name.replace(/\.csv$/i, ''),
          fileName: file.name,
          headers,
          rows,
          uploadedAt: new Date().toISOString(),
        });
      },
      error(err: Error) {
        reject(err);
      },
    });
  });
}
