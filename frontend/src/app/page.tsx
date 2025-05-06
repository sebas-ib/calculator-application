'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-[#111] p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Financial Calculators
        </h1>
        <p className="text-lg text-gray-600">
          Choose a tool below.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/mortgage"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white transition duration-200 text-gray-800 hover:bg-gray-100"
          >
            Mortgage Calculator
          </Link>
          <Link
            href="/income-tax"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white transition duration-200 text-gray-800 hover:bg-gray-100"
          >
            Income Tax Calculator
          </Link>
          <Link
            href="/retirement"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white transition duration-200 text-gray-800 hover:bg-gray-100"
          >
            Retirement Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
