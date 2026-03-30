"use client";

import type { Transaction } from "@/lib/types";

const COLORS = [
  "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-yellow-400",
  "bg-lime-400", "bg-green-400", "bg-teal-400", "bg-cyan-400",
  "bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-pink-400",
];

function formatMoney(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  if (expenses.length === 0) return null;

  const byCategory = new Map<string, number>();
  for (const tx of expenses) {
    byCategory.set(tx.category, (byCategory.get(tx.category) ?? 0) + tx.amount);
  }

  const sorted = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">카테고리별 지출</h3>

      {/* Bar */}
      <div className="flex rounded-lg overflow-hidden h-4 mb-4">
        {sorted.map(([cat, amount], i) => (
          <div
            key={cat}
            className={`${COLORS[i % COLORS.length]} transition-all`}
            style={{ width: `${(amount / total) * 100}%` }}
            title={`${cat}: ${formatMoney(amount)}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {sorted.map(([cat, amount], i) => (
          <div key={cat} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${COLORS[i % COLORS.length]}`} />
              <span className="text-gray-700">{cat}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">{Math.round((amount / total) * 100)}%</span>
              <span className="text-gray-900 font-medium">{formatMoney(amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
