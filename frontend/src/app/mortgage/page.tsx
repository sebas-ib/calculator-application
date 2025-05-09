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

export default function MortgageCalculator() {
  const [form, setForm] = useState({
    homePrice: '',
    downPayment: '',
    interest: '',
    years: '',
    taxRate: '',
    insurance: '',
    hoa: '',
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/mortgage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get result');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayData = {
    loan: result?.loanPayment || 0,
    tax: result?.tax || 0,
    insurance: result?.insurance || 0,
    hoa: result?.hoa || 0,
  };

  const total = displayData.loan + displayData.tax + displayData.insurance + displayData.hoa;
  const percent = (val: number) => total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-6xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 print:grid-cols-1 print:max-w-full">
        {/* Form Section */}
        <div>
          <h2 className="text-2xl font-semibold text-center lg:text-left mb-6">
            Mortgage Calculator
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'homePrice', label: 'Home Price' },
              { name: 'downPayment', label: 'Down Payment' },
              { name: 'interest', label: 'Interest Rate (%)' },
              { name: 'years', label: 'Loan Term (Years)' },
              { name: 'taxRate', label: 'Property Tax Rate (%)' },
              { name: 'insurance', label: 'Annual Home Insurance' },
              { name: 'hoa', label: 'Monthly HOA Fees' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.label}
                type="number"
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
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

        {/* Results + Chart Section */}
        <div className="flex flex-col items-center justify-between space-y-6">
          <div className="space-y-2 text-center text-gray-800">
            <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
            <p>Loan Payment: <strong>${displayData.loan.toFixed(2)}</strong> ({percent(displayData.loan)}%)</p>
            <p>Property Tax: <strong>${displayData.tax.toFixed(2)}</strong> ({percent(displayData.tax)}%)</p>
            <p>Insurance: <strong>${displayData.insurance.toFixed(2)}</strong> ({percent(displayData.insurance)}%)</p>
            <p>HOA Fees: <strong>${displayData.hoa.toFixed(2)}</strong> ({percent(displayData.hoa)}%)</p>
            <hr className="my-2" />
            <p className="text-lg font-semibold">
              Total: <strong>${total.toFixed(2)}</strong>
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-center gap-4 items-center">
              <label htmlFor="chartType" className="text-sm text-gray-600">
                Chart Type:
              </label>
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

            {chartType === 'pie' ? (
              <Pie
                data={{
                  labels: ['Loan', 'Tax', 'Insurance', 'HOA'],
                  datasets: [
                    {
                      data: [displayData.loan, displayData.tax, displayData.insurance, displayData.hoa],
                      backgroundColor: ['#3b82f6', '#10b981', '#facc15', '#f97316'],
                      borderColor: '#fff',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            ) : (
              <Bar
                data={{
                  labels: ['Loan', 'Tax', 'Insurance', 'HOA'],
                  datasets: [
                    {
                      label: 'Monthly Breakdown ($)',
                      data: [displayData.loan, displayData.tax, displayData.insurance, displayData.hoa],
                      backgroundColor: ['#3b82f6', '#10b981', '#facc15', '#f97316'],
                    },
                  ],
                }}
                options={{ scales: { y: { beginAtZero: true } } }}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-6 flex flex-wrap justify-center gap-3 print:hidden">
            <a href="/" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Back to Home</a>
            <a href="/income-tax" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Income Tax</a>
            <a href="/retirement" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Retirement</a>
          </div>
        </div>
      </div>
    </main>
  );
}
