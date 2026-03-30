"use client";

import type { Transaction } from "@/lib/types";

function formatMoney(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">이번 달 내역이 없습니다</p>
      </div>
    );
  }

  // Group by date
  const grouped = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = tx.date;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(tx);
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">거래 내역</h3>
      {Array.from(grouped.entries()).map(([date, txs]) => (
        <div key={date}>
          <p className="text-xs text-gray-400 mb-2">{formatDate(date)}</p>
          <div className="space-y-2">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      tx.type === "income"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {tx.category.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="text-xs text-gray-400">{tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === "income" ? "text-blue-600" : "text-red-500"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}{formatMoney(tx.amount)}
                  </span>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-400 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
