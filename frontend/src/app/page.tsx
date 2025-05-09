'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Financial Calculators
        </h1>
        <p className="text-lg text-gray-300">
          Choose a tool below.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/mortgage"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-600 bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] transition"
          >
            Mortgage Calculator
          </Link>
          <Link
            href="/income-tax"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-600 bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] transition"
          >
            Income Tax Calculator
          </Link>
          <Link
            href="/retirement"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-600 bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] transition"
          >
            Retirement Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
