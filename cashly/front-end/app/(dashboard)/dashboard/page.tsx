"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchTransactions } from "@/lib/redux/slices/transactionsSlice";
import { getCategories } from "@/lib/redux/slices/categoriesSlice";
import { TransactionType, Transaction } from "@/lib/types/transaction";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  FireIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useDisclosure } from "@heroui/modal";
import CreateTransactionModal from "@/components/create-transaction-modal";

// Componenti grafici astratti
import ChartCard from "./(components)/ChartCard";
import DailyTrendChart from "./(components)/DailyTrendChart";
import YearlyOverviewChart from "./(components)/YearlyOverviewChart";
import CategoryDistributionChart from "./(components)/CategoryDistributionChart";
import PeriodComparisonChart from "./(components)/PeriodComparisonChart";
import CumulativeBalanceChart from "./(components)/CumulativeBalanceChart";
import WeekdayExpensesChart from "./(components)/WeekdayExpensesChart";
import TopTransactionsList from "./(components)/TopTransactionsList";

// ============================================
// INTERFACCE
// ============================================
interface DailyData {
  day: string;
  entrate: number;
  uscite: number;
}

interface MonthlyData {
  month: string;
  entrate: number;
  uscite: number;
}

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface ComparisonData {
  period: string;
  corrente: number;
  precedente: number;
}

interface CumulativeBalance {
  date: string;
  saldo: number;
}

interface WeekdayExpense {
  day: string;
  spese: number;
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.transactions);
  const isLoading = useAppSelector((state) => state.transactions.isLoading);
  const error = useAppSelector((state) => state.transactions.error);
  const firstLoadDone = useAppSelector((state) => state.transactions.firstLoadDone);
  const categoriesFirstLoadDone = useAppSelector((state) => state.categories.firstLoadDone);

  // Modal states
  const { isOpen: isCreateTransasctionOpen, onOpen: onCreateTransasctionOpen, onOpenChange: onCreateTransasctionOpenChange } = useDisclosure();

  // Stati per la navigazione
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!firstLoadDone) dispatch(fetchTransactions());
    if (!categoriesFirstLoadDone) dispatch(getCategories());
  }, [dispatch, firstLoadDone, categoriesFirstLoadDone]);

  // ============================================
  // CALCOLO STATISTICHE PRINCIPALI
  // ============================================
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const totalIncome = transactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const currentMonthIncome = currentMonthTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
    const currentMonthExpenses = currentMonthTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
    const lastMonthIncome = lastMonthTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpenses = lastMonthTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

    const incomeChange = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
    const expensesChange = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
    const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      currentMonthIncome,
      currentMonthExpenses,
      incomeChange,
      expensesChange,
      savingsRate,
    };
  }, [transactions]);

  // ============================================
  // PREPARAZIONE DATI PER I GRAFICI
  // ============================================
  const dailyData = useMemo((): DailyData[] => {
    const month = selectedDay.getMonth();
    const year = selectedDay.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: DailyData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.transactionDate);
        return tDate.getDate() === day && tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const income = dayTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

      result.push({
        day: day.toString(),
        entrate: Number(income.toFixed(2)),
        uscite: Number(expenses.toFixed(2)),
      });
    }

    return result;
  }, [transactions, selectedDay]);

  const yearlyData = useMemo((): MonthlyData[] => {
    const result: MonthlyData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.transactionDate);
        return tDate.getMonth() === month && tDate.getFullYear() === selectedYear;
      });

      const income = monthTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

      result.push({
        month: new Date(selectedYear, month).toLocaleDateString("it-IT", { month: "short" }),
        entrate: Number(income.toFixed(2)),
        uscite: Number(expenses.toFixed(2)),
      });
    }

    return result;
  }, [transactions, selectedYear]);

  const categoryExpensesData = useMemo((): CategoryExpense[] => {
    const categoryMap = new Map<number, { name: string; value: number; color: string }>();
    const expenseTransactions = transactions.filter((t) => t.type === TransactionType.Expense);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    expenseTransactions.forEach((t) => {
      const categoryId = t.category?.categoryId ?? -1;
      const existing = categoryMap.get(categoryId);

      if (existing) {
        existing.value += t.amount;
      } else {
        categoryMap.set(categoryId, {
          name: t.category?.categoryName ?? "Senza categoria",
          value: t.amount,
          color: t.category?.colorHex || "#9ca3af",
        });
      }
    });

    return Array.from(categoryMap.values())
      .map((item) => ({
        ...item,
        percentage: totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const comparisonData = useMemo((): ComparisonData[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const result: ComparisonData[] = [];

    for (let week = 1; week <= 4; week++) {
      const currentWeekExpenses = transactions
        .filter((t) => {
          const date = new Date(t.transactionDate);
          const weekOfMonth = Math.ceil(date.getDate() / 7);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear && weekOfMonth === week && t.type === TransactionType.Expense;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const lastWeekExpenses = transactions
        .filter((t) => {
          const date = new Date(t.transactionDate);
          const weekOfMonth = Math.ceil(date.getDate() / 7);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && weekOfMonth === week && t.type === TransactionType.Expense;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({
        period: `Settimana ${week}`,
        corrente: Number(currentWeekExpenses.toFixed(2)),
        precedente: Number(lastWeekExpenses.toFixed(2)),
      });
    }

    return result;
  }, [transactions]);

  const cumulativeBalanceData = useMemo((): CumulativeBalance[] => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
    let runningBalance = 0;
    const result: CumulativeBalance[] = [];

    sortedTransactions.forEach((t) => {
      if (t.type === TransactionType.Income) {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }

      result.push({
        date: new Date(t.transactionDate).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }),
        saldo: Number(runningBalance.toFixed(2)),
      });
    });

    return result;
  }, [transactions]);

  const weekdayExpenses = useMemo((): WeekdayExpense[] => {
    const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const dayTotals = new Array(7).fill(0);

    transactions
      .filter((t) => t.type === TransactionType.Expense)
      .forEach((t) => {
        const dayOfWeek = new Date(t.transactionDate).getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        dayTotals[adjustedDay] += t.amount;
      });

    return dayNames.map((name, index) => ({
      day: name,
      spese: Number(dayTotals[index].toFixed(2)),
    }));
  }, [transactions]);

  const topTransactions = useMemo((): Transaction[] => {
    return [...transactions]
      .filter((t) => t.type === TransactionType.Expense)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // ============================================
  // FUNZIONI DI NAVIGAZIONE
  // ============================================
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDay);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDay(newDate);
  };

  const handleNextDay = () => {
    const now = new Date();
    const newDate = new Date(selectedDay);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate <= now) setSelectedDay(newDate);
  };

  const handlePreviousYear = () => {
    setSelectedYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    const currentYear = new Date().getFullYear();
    if (selectedYear < currentYear) setSelectedYear((prev) => prev + 1);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedDay.getMonth() === now.getMonth() && selectedDay.getFullYear() === now.getFullYear();
  };

  const isCurrentYear = () => {
    return selectedYear === new Date().getFullYear();
  };

  // ============================================
  // RENDERING
  // ============================================
  if (isLoading && !firstLoadDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 mt-4">Caricamento dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/80 mt-2">Panoramica completa delle tue finanze</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="w-5 h-5" />}
            className="flex-1 sm:flex-initial font-semibold"
            onPress={onCreateTransasctionOpen}>
            Nuova Transazione
          </Button>
        </div>
      </div>

      {/* Messaggio errore */}
      {error && (
        <Card className="border-l-4 border-danger">
          <CardBody className="bg-danger-50/50">
            <p className="text-danger font-medium">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Cards Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bilancio */}
        <Card className="border-2 border-primary/20 bg-linear-to-br from-primary-50 to-primary-100">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Bilancio Totale</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? "text-success" : "text-danger"}`}>
                  {stats.balance.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="min-w-12 min-h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Entrate */}
        <Card className="border-2 border-success/20 bg-linear-to-br from-success-50 to-success-100">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Entrate (Mese)</p>
                <p className="text-3xl font-bold text-success">
                  {stats.currentMonthIncome.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="min-w-12 min-h-12 rounded-full bg-success/20 flex items-center justify-center">
                <ArrowUpIcon className="w-6 h-6 text-success" />
              </div>
            </div>
            {stats.incomeChange !== 0 && (
              <p className={`text-xs font-medium ${stats.incomeChange > 0 ? "text-success" : "text-danger"}`}>
                {stats.incomeChange > 0 ? "+" : ""}
                {stats.incomeChange.toFixed(1)}% vs mese scorso
              </p>
            )}
          </CardBody>
        </Card>

        {/* Uscite */}
        <Card className="border-2 border-danger/20 bg-linear-to-br from-danger-50 to-danger-100">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Uscite (Mese)</p>
                <p className="text-3xl font-bold text-danger">
                  {stats.currentMonthExpenses.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="min-w-12 min-h-12 rounded-full bg-danger/20 flex items-center justify-center">
                <ArrowDownIcon className="w-6 h-6 text-danger" />
              </div>
            </div>
            {stats.expensesChange !== 0 && (
              <p className={`text-xs font-medium ${stats.expensesChange > 0 ? "text-danger" : "text-success"}`}>
                {stats.expensesChange > 0 ? "+" : ""}
                {stats.expensesChange.toFixed(1)}% vs mese scorso
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Grafico 1: Andamento Giornaliero */}
      <ChartCard
        title="Andamento Giornaliero"
        subtitle={selectedDay.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
        icon={<ChartBarIcon className="w-5 h-5 text-primary" />}
        navigationEnabled
        onPrevious={handlePreviousDay}
        onNext={handleNextDay}
        isNextDisabled={isCurrentMonth()}>
        <DailyTrendChart data={dailyData} />
      </ChartCard>

      {/* Grafico 2: Panoramica Annuale */}
      <ChartCard
        title="Panoramica Annuale"
        subtitle={`Anno ${selectedYear}`}
        icon={<ChartBarIcon className="w-5 h-5 text-primary" />}
        navigationEnabled
        onPrevious={handlePreviousYear}
        onNext={handleNextYear}
        isNextDisabled={isCurrentYear()}>
        <YearlyOverviewChart data={yearlyData} />
      </ChartCard>

      {/* Layout a 2 colonne per grafici medi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico 3: Distribuzione Spese */}
        <ChartCard title="Distribuzione Spese" subtitle="Per categoria" icon={<ChartPieIcon className="w-5 h-5 text-primary" />}>
          <CategoryDistributionChart data={categoryExpensesData} />
        </ChartCard>

        {/* Grafico 4: Confronto Periodi */}
        <ChartCard title="Confronto Periodi" subtitle="Mese corrente vs precedente" icon={<ArrowTrendingUpIcon className="w-6 h-6 text-primary" />}>
          <PeriodComparisonChart data={comparisonData} />
        </ChartCard>
      </div>

      {/* Layout a 2 colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico 6: Saldo Cumulativo */}
        <ChartCard title="Saldo Cumulativo" subtitle="Andamento nel tempo" icon={<ArrowTrendingUpIcon className="w-5 h-5 text-primary" />}>
          <CumulativeBalanceChart data={cumulativeBalanceData} />
        </ChartCard>

        {/* Grafico 7: Spese per Giorno della Settimana */}
        <ChartCard title="Spese per Giorno" subtitle="Analisi settimanale" icon={<CalendarDaysIcon className="w-5 h-5 text-primary" />}>
          <WeekdayExpensesChart data={weekdayExpenses} />
        </ChartCard>
      </div>

      {/* Grafico 9: Top 5 Transazioni */}
      <ChartCard title="Top 5 Spese" subtitle="Le tue transazioni più alte" icon={<FireIcon className="w-5 h-5 text-primary" />}>
        <TopTransactionsList transactions={topTransactions} />
      </ChartCard>

      <CreateTransactionModal isOpen={isCreateTransasctionOpen} onOpenChange={onCreateTransasctionOpenChange} />
    </div>
  );
}
