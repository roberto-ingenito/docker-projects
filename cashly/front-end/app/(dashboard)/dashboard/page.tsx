"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchTransactions } from "@/lib/redux/slices/transactionsSlice";
import { getCategories } from "@/lib/redux/slices/categoriesSlice";
import { TransactionType, Transaction } from "@/lib/types/transaction";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import {
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "next-themes";

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

  const { theme } = useTheme();

  // Stati per la navigazione
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [heatmapMonth, setHeatmapMonth] = useState(new Date());

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

    // Tasso di risparmio
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
  // GRAFICO 1: ANDAMENTO GIORNALIERO
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

  // ============================================
  // GRAFICO 2: PANORAMICA ANNUALE
  // ============================================
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

  // ============================================
  // GRAFICO 3: DISTRIBUZIONE SPESE PER CATEGORIA
  // ============================================
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

  // ============================================
  // GRAFICO 4: CONFRONTO PERIODI (Mese corrente vs precedente)
  // ============================================
  const comparisonData = useMemo((): ComparisonData[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const result: ComparisonData[] = [];

    // Raggruppa per settimana
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

  // ============================================
  // GRAFICO 6: SALDO CUMULATIVO
  // ============================================
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

  // ============================================
  // GRAFICO 7: SPESE PER GIORNO DELLA SETTIMANA
  // ============================================
  const weekdayExpenses = useMemo((): WeekdayExpense[] => {
    const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const dayTotals = new Array(7).fill(0);

    transactions
      .filter((t) => t.type === TransactionType.Expense)
      .forEach((t) => {
        const dayOfWeek = new Date(t.transactionDate).getDay();
        // Converti: 0(Dom)=>6, 1(Lun)=>0, 2(Mar)=>1, ..., 6(Sab)=>5
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        dayTotals[adjustedDay] += t.amount;
      });

    return dayNames.map((name, index) => ({
      day: name,
      spese: Number(dayTotals[index].toFixed(2)),
    }));
  }, [transactions]);

  // ============================================
  // GRAFICO 9: TOP 5 TRANSAZIONI
  // ============================================
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
  // TOOLTIP PERSONALIZZATI
  // ============================================
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-default-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-default-700">{payload[0].name}</p>
          <p className="text-sm text-default-600">{payload[0].value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</p>
          <p className="text-xs text-default-500">{payload[0].payload.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  // Helper per colori heatmap

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
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-default-500 mt-2">Panoramica completa delle tue finanze</p>
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
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Bilancio Totale</p>
                <p className={`text-3xl font-bold ${stats.balance >= 0 ? "text-success" : "text-danger"}`}>
                  {stats.balance.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Entrate */}
        <Card className="border-2 border-success/20 bg-linear-to-br from-success-50 to-success-100">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Entrate (Mese)</p>
                <p className="text-3xl font-bold text-success">
                  {stats.currentMonthIncome.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
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
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Uscite (Mese)</p>
                <p className="text-3xl font-bold text-danger">
                  {stats.currentMonthExpenses.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
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

      {/* Tasso di Risparmio */}
      <Card className="border-2 border-primary/20">
        <CardBody className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">Tasso di Risparmio</h3>
              <p className="text-sm text-default-500">Percentuale delle entrate risparmiata questo mese</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${stats.savingsRate >= 0 ? "text-success" : "text-danger"}`}>{stats.savingsRate.toFixed(1)}%</p>
            </div>
          </div>
          <Progress
            value={Math.max(0, Math.min(100, stats.savingsRate))}
            color={stats.savingsRate >= 20 ? "success" : stats.savingsRate >= 10 ? "warning" : "danger"}
            size="lg"
            className="max-w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-default-500">
            <span>Critico (&lt;10%)</span>
            <span>Buono (20%+)</span>
          </div>
        </CardBody>
      </Card>

      {/* Grafico 1: Andamento Giornaliero */}
      <Card>
        <CardHeader className="flex-col sm:flex-row gap-3 pb-0 pt-6 px-6">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Andamento Giornaliero</h3>
              <p className="text-sm text-default-500">{selectedDay.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={handlePreviousDay}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={handleNextDay} isDisabled={isCurrentMonth()}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {dailyData.some((d) => d.entrate > 0 || d.uscite > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorEntrate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorUscite" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
                <XAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} dataKey="day" fontSize={12} />
                <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="entrate" name="Entrate" stroke="#10b981" fillOpacity={1} fill="url(#colorEntrate)" strokeWidth={2} />
                <Area type="monotone" dataKey="uscite" name="Uscite" stroke="#ef4444" fillOpacity={1} fill="url(#colorUscite)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px]">
              <p className="text-default-400">Nessuna transazione in questo mese</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Grafico 2: Panoramica Annuale */}
      <Card>
        <CardHeader className="flex-col sm:flex-row gap-3 pb-0 pt-6 px-6">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Panoramica Annuale</h3>
              <p className="text-sm text-default-500">Anno {selectedYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={handlePreviousYear}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button isIconOnly size="sm" variant="solid" color="default" onPress={handleNextYear} isDisabled={isCurrentYear()}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {yearlyData.some((d) => d.entrate > 0 || d.uscite > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
                <XAxis dataKey="month" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
                <Legend />
                <Bar dataKey="entrate" name="Entrate" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="uscite" name="Uscite" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px]">
              <p className="text-default-400">Nessun dato disponibile per quest'anno</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Layout a 2 colonne per grafici medi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico 3: Distribuzione Spese */}
        <Card>
          <CardHeader className="flex gap-3 pb-0 pt-6 px-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <ChartPieIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Distribuzione Spese</h3>
                <p className="text-sm text-default-500">Per categoria</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            {categoryExpensesData.length > 0 ? (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryExpensesData.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {categoryExpensesData.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryExpensesData.slice(0, 6).map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                      <span className="text-sm text-default-700 flex-1 truncate">{category.name}</span>
                      <span className="text-sm font-medium text-default-900">
                        {category.value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-default-400">Nessuna spesa categorizzata</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Grafico 4: Confronto Periodi */}
        <Card>
          <CardHeader className="flex gap-3 pb-0 pt-6 px-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Confronto Periodi</h3>
                <p className="text-sm text-default-500">Mese corrente vs precedente</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            {comparisonData.some((d) => d.corrente > 0 || d.precedente > 0) ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
                  <XAxis dataKey="period" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                  <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
                  <Legend />
                  <Line type="monotone" dataKey="corrente" name="Mese Corrente" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  <Line
                    type="monotone"
                    dataKey="precedente"
                    name="Mese Precedente"
                    stroke="#9ca3af"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-default-400">Dati insufficienti per il confronto</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Layout a 2 colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico 6: Saldo Cumulativo */}
        <Card>
          <CardHeader className="flex gap-3 pb-0 pt-6 px-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Saldo Cumulativo</h3>
                <p className="text-sm text-default-500">Andamento nel tempo</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            {cumulativeBalanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeBalanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
                  <XAxis
                    dataKey="date"
                    stroke={theme === "light" ? "#000000aa" : "#ffffffaa"}
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
                  <ReferenceLine y={0} stroke={theme === "light" ? "#000" : "#fff"} strokeDasharray="6 6" />
                  <Line type="monotone" dataKey="saldo" name="Saldo" stroke={theme === "light" ? "#000" : "#fff"} strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-default-400">Nessuna transazione disponibile</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Grafico 7: Spese per Giorno della Settimana */}
        <Card>
          <CardHeader className="flex gap-3 pb-0 pt-6 px-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Spese per Giorno</h3>
                <p className="text-sm text-default-500">Analisi settimanale</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            {weekdayExpenses.some((d) => d.spese > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weekdayExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
                  <XAxis dataKey="day" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={11} />
                  <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
                  <Bar dataKey="spese" name="Spese" fill={theme === "light" ? "#b0b0b0" : "#e0e0e0"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-default-400">Nessuna spesa registrata</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Grafico 9: Top 5 Transazioni */}
      <Card>
        <CardHeader className="flex gap-3 pb-0 pt-6 px-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FireIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Top 5 Spese</h3>
              <p className="text-sm text-default-500">Le tue transazioni più alte</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {topTransactions.length > 0 ? (
            <div className="space-y-4">
              {topTransactions.map((transaction, index) => (
                <div key={transaction.transactionId} className="flex items-center gap-4 p-4 rounded-lg bg-primary/15">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 shrink-0">
                    <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-default-900 truncate">{transaction.description || "Nessuna descrizione"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {transaction.category && (
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor: transaction.category.colorHex + "20",
                            color: transaction.category.colorHex,
                          }}>
                          {transaction.category.categoryName}
                        </Chip>
                      )}
                      <span className="text-xs text-default-500">{new Date(transaction.transactionDate).toLocaleDateString("it-IT")}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary">
                      {transaction.amount.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              <p className="text-default-400">Nessuna spesa disponibile</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Empty State */}
      {transactions.length === 0 && (
        <Card className="border-2 border-dashed border-default-300">
          <CardBody className="py-20">
            <div className="text-center">
              <ChartBarIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
              <h3 className="text-xl font-semibold text-default-600 mb-2">Nessun dato disponibile</h3>
              <p className="text-default-500 mb-6">Inizia ad aggiungere le tue transazioni per visualizzare le statistiche</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
