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

export default function RetirementCalculator() {
  const [form, setForm] = useState({
    currentBalance: '',
    contribution: '',
    years: '',
    returnRate: '',
    salary: '',
    matchPercent: '',
    maxMatchPercent: '',
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/401k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBalance: parseFloat(form.currentBalance),
          contribution: parseFloat(form.contribution),
          years: parseInt(form.years),
          returnRate: parseFloat(form.returnRate),
          salary: parseFloat(form.salary),
          matchPercent: parseFloat(form.matchPercent),
          maxMatchPercent: parseFloat(form.maxMatchPercent),
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

  const total = result?.futureValue || 0;
  const fromContributions = result?.fromContributions || 0;
  const fromCurrent = result?.fromCurrentBalance || 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white px-4 py-12">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-lg w-full max-w-5xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold text-center lg:text-left mb-6">401(k) Retirement Calculator</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'currentBalance', label: 'Current Balance ($)' },
              { name: 'contribution', label: 'Monthly Contribution ($)' },
              { name: 'years', label: 'Years to Retirement' },
              { name: 'returnRate', label: 'Annual Return Rate (%)' },
              { name: 'salary', label: 'Annual Salary ($)' },
              { name: 'matchPercent', label: 'Employer Match (%)' },
              { name: 'maxMatchPercent', label: 'Employer Max Match (% of salary)' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.label}
                type="number"
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-600"
                required
              />
            ))}
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
          <div className="text-center space-y-2">
            <p>Total Projected Savings: <strong>${total.toFixed(2)}</strong></p>
            <p>From Contributions + Employer Match: <strong>${fromContributions.toFixed(2)}</strong></p>
            <p>From Current Balance Growth: <strong>${fromCurrent.toFixed(2)}</strong></p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-center gap-4 items-center">
              <label htmlFor="chartType" className="text-sm text-gray-300">Chart Type:</label>
              <select
                id="chartType"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'pie' | 'bar')}
                className="p-2 bg-[#2a2a2a] text-white border border-gray-600 rounded text-sm"
              >
                <option value="pie">Pie</option>
                <option value="bar">Bar</option>
              </select>
              <button
                onClick={() => window.print()}
                className="ml-2 text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Print
              </button>
            </div>

            {result && chartType === 'pie' && (
              <Pie
                data={{
                  labels: ['Contributions + Match', 'Growth from Current Balance'],
                  datasets: [
                    {
                      data: [fromContributions, fromCurrent],
                      backgroundColor: ['#3b82f6', '#10b981'],
                      borderColor: '#2a2a2a',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            )}

            {result && chartType === 'bar' && (
              <Bar
                data={{
                  labels: ['Contributions + Match', 'Current Balance Growth'],
                  datasets: [
                    {
                      label: '401(k) Components ($)',
                      data: [fromContributions, fromCurrent],
                      backgroundColor: ['#3b82f6', '#10b981'],
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: { beginAtZero: true, ticks: { color: 'white' } },
                    x: { ticks: { color: 'white' } },
                  },
                  plugins: { legend: { labels: { color: 'white' } } },
                }}
              />
            )}
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-3 print:hidden">
            <a href="/" className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">Back to Home</a>
            <a href="/mortgage" className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">Mortgage</a>
            <a href="/income-tax" className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">Income Tax</a>
          </div>
        </div>
      </div>
    </main>
  );
}
