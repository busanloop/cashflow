"use client";

import { useState } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/types";

interface Props {
  onAdd: (tx: Omit<Transaction, "id" | "created_at">) => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("식비");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(t: TransactionType) {
    setType(t);
    setCategory(t === "income" ? "급여" : "식비");
  }

  function handleSubmit() {
    if (!amount || Number(amount) <= 0) return;

    onAdd({
      type,
      amount: Number(amount),
      category,
      description,
      date,
    });

    setAmount("");
    setDescription("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition"
      >
        + 내역 추가
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      {/* 수입/지출 토글 */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTypeChange("expense")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
            type === "expense" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          지출
        </button>
        <button
          onClick={() => handleTypeChange("income")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
            type === "income" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
          }`}
        >
          수입
        </button>
      </div>

      {/* 금액 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xl font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {/* 날짜 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">카테고리</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                category === cat
                  ? type === "income"
                    ? "bg-blue-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">메모 (선택)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="어디서 무엇을?"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!amount || Number(amount) <= 0}
          className={`flex-1 py-2.5 text-white rounded-lg text-sm font-medium transition ${
            type === "income"
              ? "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-200"
              : "bg-red-500 hover:bg-red-600 disabled:bg-red-200"
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
}
