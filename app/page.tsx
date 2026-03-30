"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/lib/types";
import Summary from "@/components/Summary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import CategoryChart from "@/components/CategoryChart";
import MonthlyTrend from "@/components/MonthlyTrend";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(true);

  const [year, month] = currentMonth.split("-").map(Number);

  useEffect(() => {
    fetchTransactions();
  }, [currentMonth]);

  async function fetchTransactions() {
    setLoading(true);
    const startDate = `${currentMonth}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lt("date", month === 12 ? `${year + 1}-01-01` : endDate)
      .order("date", { ascending: false });

    if (error) console.error("Fetch error:", error);
    setTransactions(data ?? []);
    setLoading(false);
  }

  async function handleAdd(tx: Omit<Transaction, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("transactions")
      .insert(tx)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return;
    }
    if (data) setTransactions((prev) => [data, ...prev]);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function prevMonth() {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function nextMonth() {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const income = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const expense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">CashFlow</h1>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-800 min-w-[100px] text-center">
              {year}년 {month}월
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Summary income={income} expense={expense} />
        <TransactionForm onAdd={handleAdd} />
        <CategoryChart transactions={transactions} />
        <MonthlyTrend currentYear={year} currentMonth={month} />
        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
