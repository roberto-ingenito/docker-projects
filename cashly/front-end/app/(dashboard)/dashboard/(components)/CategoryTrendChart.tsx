"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import { Transaction, TransactionType } from "@/lib/types/transaction";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

// Colori predefiniti per le barre
const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
];

interface CategoryTrendChartProps {
  selectedTime: Date;
  height: number;
}

export default function CategoryTrendChart({ selectedTime, height }: CategoryTrendChartProps) {
  const { theme } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const categories = useAppSelector((state) => state.categories.categories);

  const filteredTransactionsSelector = createSelector(
    (state: RootState) => state.transactions,
    (transactions) =>
      transactions.transactions.filter((t) => {
        const tDate = new Date(t.transactionDate);
        return tDate.getFullYear() === selectedTime.getFullYear();
      }),
  );
  const transactions = useAppSelector(filteredTransactionsSelector);

  const maxSelectableCategories = 3;

  // Calcola le top maxSelectableCategories categorie per spesa totale (default iniziale)
  const topCategories = useMemo(() => {
    const categoryTotals = new Map<number, number>();

    transactions
      .filter((t) => t.type === TransactionType.Expense && t.categoryId)
      .forEach((t) => {
        const current = categoryTotals.get(t.categoryId!) || 0;
        categoryTotals.set(t.categoryId!, current + t.amount);
      });

    return Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxSelectableCategories)
      .map(([id]) => id);
  }, []);

  // Imposta le top maxSelectableCategories come default alla prima renderizzazione
  useMemo(() => {
    if (selectedCategories.length === 0 && topCategories.length > 0) {
      setSelectedCategories(topCategories);
    }
  }, [topCategories]);

  // Prepara i dati per il grafico
  const chartData = useMemo(() => {
    return prepareMonthlyData(transactions, selectedCategories);
  }, [transactions, selectedCategories, categories]);

  // Gestisci la selezione delle categorie
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Rimuovi se già selezionata
        return prev.filter((id) => id !== categoryId);
      } else {
        // Aggiungi solo se non hai già 4 categorie
        if (prev.length < maxSelectableCategories) {
          return [...prev, categoryId];
        }
        return prev;
      }
    });
  };

  // Ottieni le categorie selezionate con i loro dettagli
  const selectedCategoriesData = categories
    .filter((cat) => selectedCategories.includes(cat.categoryId))
    .map((cat, index) => ({
      ...cat,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

  return (
    <div className="space-y-6">
      {/* Selettore categorie */}
      <div>
        <div className="text-sm mb-2">
          {selectedCategories.length}/{maxSelectableCategories} categorie selezionate
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.categoryId);
            const isDisabled = !isSelected && selectedCategories.length >= maxSelectableCategories;

            return (
              <label
                key={category.categoryId}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                  isSelected
                    ? "border-2 border-primary cursor-pointer"
                    : isDisabled
                      ? "border-1 border-primary-200 opacity-50 cursor-not-allowed"
                      : "border-1 border-primary-300 cursor-pointer"
                }`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category.categoryId)}
                  disabled={isDisabled}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium truncate">{category.categoryName}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Grafico */}
      {selectedCategories.length > 0 ? (
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
              barGap={0}
              barCategoryGap={4}
              height={height}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
              <XAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} />
              <Tooltip
                content={<CustomTooltip />}
                // formatter={(value: number) => `€${value.toFixed(2)}`}
                contentStyle={{ fontSize: "14px" }}
                cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }}
              />
              <Legend />

              {selectedCategoriesData.map((category) => (
                <Bar
                  key={category.categoryId}
                  dataKey={`cat_${category.categoryId}`}
                  name={category.categoryName}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Seleziona almeno una categoria per visualizzare il grafico</p>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-default-700 mb-2">{`${label}`}</p>
        {(payload as Array<any>).map((e, index) => (
          <p key={index} className="text-sm" style={{ color: e.fill }}>{`${e.name}: €${(e.value as number).toFixed(2)}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

// Funzione per preparare i dati mensili
function prepareMonthlyData(transactions: Transaction[], selectedCategories: number[]) {
  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  // Inizializza l'oggetto per ogni mese
  const monthlyData = months.map((month, index) => {
    const data: any = {
      month,
      monthNumber: index,
    };

    // Inizializza tutte le categorie selezionate a 0
    selectedCategories.forEach((catId) => {
      data[`cat_${catId}`] = 0;
    });

    return data;
  });

  // Aggrega le spese per mese e categoria
  transactions
    .filter((t) => {
      if (t.type !== TransactionType.Expense || !t.categoryId) return false;
      if (!selectedCategories.includes(t.categoryId)) return false;
      return true;
    })
    .forEach((transaction) => {
      const txDate = new Date(transaction.transactionDate);
      const monthIndex = txDate.getMonth();

      monthlyData[monthIndex][`cat_${transaction.categoryId}`] += transaction.amount;
    });

  // Arrotonda i valori
  monthlyData.forEach((month) => {
    selectedCategories.forEach((catId) => {
      month[`cat_${catId}`] = parseFloat(month[`cat_${catId}`].toFixed(2));
    });
  });

  return monthlyData;
}
