"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function formatMoney(n: number) {
  if (n >= 10000) return Math.round(n / 10000) + "만";
  return n.toLocaleString("ko-KR");
}

interface MonthData {
  month: string;
  income: number;
  expense: number;
}

export default function MonthlyTrend({ currentYear, currentMonth }: { currentYear: number; currentMonth: number }) {
  const [data, setData] = useState<MonthData[]>([]);

  useEffect(() => {
    fetchTrend();
  }, [currentYear, currentMonth]);

  async function fetchTrend() {
    // Fetch last 6 months
    const months: MonthData[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
      const nextMonth = new Date(y, m, 1);
      const endDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

      const { data: txs } = await supabase
        .from("transactions")
        .select("type, amount")
        .gte("date", startDate)
        .lt("date", endDate);

      let income = 0;
      let expense = 0;
      for (const tx of txs ?? []) {
        if (tx.type === "income") income += tx.amount;
        else expense += tx.amount;
      }

      months.push({ month: `${m}월`, income, expense });
    }

    setData(months);
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);

  if (data.every((d) => d.income === 0 && d.expense === 0)) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 추이 (최근 6개월)</h3>

      <div className="flex items-end gap-2 h-32">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end justify-center h-24">
              <div
                className="w-3 bg-blue-400 rounded-t"
                style={{ height: `${(d.income / maxVal) * 100}%`, minHeight: d.income > 0 ? 4 : 0 }}
                title={`수입: ${d.income.toLocaleString()}원`}
              />
              <div
                className="w-3 bg-red-400 rounded-t"
                style={{ height: `${(d.expense / maxVal) * 100}%`, minHeight: d.expense > 0 ? 4 : 0 }}
                title={`지출: ${d.expense.toLocaleString()}원`}
              />
            </div>
            <span className="text-xs text-gray-400">{d.month}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm" />
          <span className="text-xs text-gray-500">수입</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-red-400 rounded-sm" />
          <span className="text-xs text-gray-500">지출</span>
        </div>
      </div>
    </div>
  );
}
