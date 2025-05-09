'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function IncomeTaxCalculator() {
  const [form, setForm] = useState({
    income: '',
    otherIncome: '',
    deductions: '',
    taxCredits: '',
    filingStatus: 'single',
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/income-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: parseFloat(form.income),
          otherIncome: parseFloat(form.otherIncome),
          deductions: parseFloat(form.deductions),
          taxCredits: parseFloat(form.taxCredits),
          filingStatus: form.filingStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const gross = result?.grossIncome || 0;
  const taxable = result?.taxableIncome || 0;
  const tax = result?.totalTax || 0;
  const rate = result?.effectiveRate || 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-5xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold text-center lg:text-left mb-6">Income Tax Calculator</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="filingStatus"
              value={form.filingStatus}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
            <input
              type="number"
              name="income"
              placeholder="Base Salary ($)"
              value={form.income}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
            <input
              type="number"
              name="otherIncome"
              placeholder="Other Income ($)"
              value={form.otherIncome}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="number"
              name="deductions"
              placeholder="Deductions ($)"
              value={form.deductions}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="number"
              name="taxCredits"
              placeholder="Tax Credits ($)"
              value={form.taxCredits}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
          </form>
        </div>

        {/* Results & Chart */}
        <div className="flex flex-col items-center justify-between space-y-6">
          <div className="text-center text-gray-800 space-y-2">
            <p>Gross Income: <strong>${gross.toFixed(2)}</strong></p>
            <p>Taxable Income: <strong>${taxable.toFixed(2)}</strong></p>
            <p>Total Tax: <strong>${tax.toFixed(2)}</strong></p>
            <p>Effective Tax Rate: <strong>{rate.toFixed(2)}%</strong></p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-center gap-4 items-center">
              <label htmlFor="chartType" className="text-sm text-gray-600">Chart Type:</label>
              <select
                id="chartType"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}
                className="p-2 border rounded text-sm"
              >
                <option value="pie">Pie</option>
                <option value="bar">Bar</option>
              </select>
              <button
                onClick={() => window.print()}
                className="ml-2 text-sm px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Print
              </button>
            </div>

            {result && chartType === 'pie' && (
              <Pie
                data={{
                  labels: ['Tax', 'After-Tax Income'],
                  datasets: [
                    {
                      data: [tax, gross - tax],
                      backgroundColor: ['#ef4444', '#10b981'],
                      borderColor: '#fff',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            )}

            {result && chartType === 'bar' && (
              <Bar
                data={{
                  labels: ['Tax', 'After-Tax Income'],
                  datasets: [
                    {
                      label: 'Income Distribution ($)',
                      data: [tax, gross - tax],
                      backgroundColor: ['#ef4444', '#10b981'],
                    },
                  ],
                }}
                options={{ scales: { y: { beginAtZero: true } } }}
              />
            )}
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-3 print:hidden">
            <a href="/" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Back to Home</a>
            <a href="/mortgage" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Mortgage</a>
            <a href="/retirement" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Retirement</a>
          </div>
        </div>
      </div>
    </main>
  );
}
