"use client";

function formatMoney(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function Summary({ income, expense }: { income: number; expense: number }) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">수입</p>
        <p className="text-lg font-bold text-blue-600">+{formatMoney(income)}</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">지출</p>
        <p className="text-lg font-bold text-red-500">-{formatMoney(expense)}</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">잔액</p>
        <p className={`text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-500"}`}>
          {balance >= 0 ? "+" : ""}{formatMoney(balance)}
        </p>
      </div>
    </div>
  );
}
