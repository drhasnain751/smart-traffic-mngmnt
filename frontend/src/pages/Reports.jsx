import React, { useEffect, useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  FileText, Download, Play, Plus, RefreshCw, Filter, Calendar, CheckSquare, Sparkles 
} from 'lucide-react';

export default function Reports() {
  const { getHeaders } = useTrafficStore();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ type: 'ALL', format: 'ALL' });
  
  // Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('DAILY');
  const [format, setFormat] = useState('PDF');

  const fetchReportsList = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        headers: getHeaders()
      });
      const data = await res.json();
      if (res.ok) setReports(data);
    } catch (err) {
      console.error('Failed to retrieve reports:', err);
    }
  };

  useEffect(() => {
    fetchReportsList();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          type,
          format,
          parameters: { generatedTimestamp: new Date().toISOString() }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTitle('');
        setReports(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId, filename, formatExtension) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}/download`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Download failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/\s+/g, '_')}.${formatExtension.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed downloading file:', err);
    }
  };

  // Filter logic
  const filteredReports = reports.filter(item => {
    const matchType = filters.type === 'ALL' || item.type === filters.type;
    const matchFormat = filters.format === 'ALL' || item.format === filters.format;
    return matchType && matchFormat;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Audit Reports</h1>
          <p className="text-sm text-primary-muted mt-1.5">Generate, filter, and export metropolitan mobility reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Compile New Report (1/3 width) */}
        <div className="lg:col-span-4 bg-panel border border-border p-6 rounded-2xl flex flex-col justify-between shadow-premium h-fit">
          <form onSubmit={handleGenerateReport} className="space-y-5">
            <div className="flex items-center space-x-2 border-b border-border pb-3.5">
              <Plus className="h-4.5 w-4.5 text-brand-blue" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                Compile System Report
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="report-title-input" className="text-xs font-medium text-primary-muted">Report Document Title</label>
              <input 
                id="report-title-input"
                type="text" 
                placeholder="e.g. Midtown Congestion Analysis"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
                required
              />
            </div>

            {/* Type */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="report-type-select" className="text-xs font-medium text-primary-muted">Compilation Scope</label>
              <select
                id="report-type-select"
                value={type}
                onChange={e => setType(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
              >
                <option value="DAILY">Daily Transit Summary</option>
                <option value="WEEKLY">Weekly Commute Metrics</option>
                <option value="MONTHLY">Monthly Mobility Index</option>
                <option value="ANOMALY">Gridlock Anomaly Logs</option>
              </select>
            </div>

            {/* Format */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="report-format-select" className="text-xs font-medium text-primary-muted">File Format</label>
              <select
                id="report-format-select"
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
              >
                <option value="PDF">PDF (Formal Layout)</option>
                <option value="CSV">CSV (Spreadsheet Database)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-muted text-background text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Compiling logs...' : 'Request Document compile'}</span>
            </button>
          </form>
        </div>

        {/* Right List: Previous Reports (2/3 width) */}
        <div className="lg:col-span-8 bg-panel border border-border rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between">
          <div>
            {/* Filter controls bar */}
            <div className="px-6 py-4 bg-surface/30 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono flex items-center space-x-1.5">
                <Filter className="h-3.5 w-3.5" />
                <span>Documents Ledger</span>
              </span>

              <div className="flex items-center space-x-3 text-xs">
                <select
                  value={filters.type}
                  onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-zinc-950 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="ALL">All Scopes</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="ANOMALY">Anomaly</option>
                </select>

                <select
                  value={filters.format}
                  onChange={e => setFilters(prev => ({ ...prev, format: e.target.value }))}
                  className="bg-zinc-950 border border-border px-2.5 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="ALL">All Formats</option>
                  <option value="PDF">PDF</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-border/60">
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between text-xs transition-colors hover:bg-surface/10">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="p-2 bg-zinc-950 border border-border rounded-lg text-primary-muted">
                        <FileText className="h-4.5 w-4.5 text-brand-blue" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-primary truncate">{item.title}</span>
                        <div className="flex items-center space-x-2 text-[10px] text-primary-muted mt-0.5 font-mono">
                          <span className="uppercase">{item.type}</span>
                          <span>•</span>
                          <span>By: {item.generatedBy}</span>
                          <span>•</span>
                          <span>{new Date(item.generatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold rounded ${
                        item.format === 'PDF' ? 'bg-red-950/30 text-red-400 border-red-900/40' : 'bg-green-950/30 text-green-400 border-green-900/40'
                      }`}>
                        {item.format}
                      </span>
                      
                      <button
                        onClick={() => handleDownloadReport(item.id, item.title, item.format)}
                        className="bg-surface hover:bg-zinc-800 border border-border p-2 rounded-lg text-primary-muted hover:text-primary transition-colors"
                        title="Download Document"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-primary-muted">
                  No reports matched chosen criteria.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
