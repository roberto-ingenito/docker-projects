"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchTransactions } from "@/lib/redux/slices/transactionsSlice";
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice";
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
  FireIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useDisclosure } from "@heroui/modal";

// Componenti grafici astratti
import ChartCard from "./(components)/ChartCard";
import DailyTrendChart from "./(components)/DailyTrendChart";
import YearlyOverviewChart from "./(components)/YearlyOverviewChart";
import CategoryDistributionChart from "./(components)/CategoryDistributionChart";
import CumulativeBalanceChart from "./(components)/CumulativeBalanceChart";
import TopTransactionsList from "./(components)/TopTransactionsList";
import TransactionFormModal from "@/components/transactionFormModal";
import CategoryTrendChart from "./(components)/CategoryTrendChart";

export interface MonthlyData {
  month: string;
  entrate: number;
  uscite: number;
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.transactions);
  const isLoading = useAppSelector((state) => state.transactions.isLoading || state.categories.isLoading);
  const error = useAppSelector((state) => state.transactions.error);
  const firstLoadDone = useAppSelector((state) => state.transactions.firstLoadDone);
  const categoriesFirstLoadDone = useAppSelector((state) => state.categories.firstLoadDone);

  const chartHeight = 350;

  // Modal states
  const { isOpen: isCreateTransasctionOpen, onOpen: onCreateTransasctionOpen, onOpenChange: onCreateTransasctionOpenChange } = useDisclosure();

  // Stati per la navigazione
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    if (!firstLoadDone) dispatch(fetchTransactions());
    if (!categoriesFirstLoadDone) dispatch(fetchCategories());
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
  const topTransactions = useMemo((): Transaction[] => {
    return [...transactions]
      .filter((t) => t.type === TransactionType.Expense)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // ============================================
  // FUNZIONI DI NAVIGAZIONE
  // ============================================
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedTime);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedTime(newDate);
  };

  const handleNextMonth = () => {
    const now = new Date();
    const newDate = new Date(selectedTime);

    if (selectedTime.getFullYear() >= now.getFullYear() && selectedTime.getMonth() >= now.getMonth()) {
      setSelectedTime(new Date(now.getFullYear(), now.getMonth()));
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
      setSelectedTime(newDate);
    }
  };

  const handlePreviousYear = () => {
    setSelectedTime((prev) => new Date(prev.getFullYear() - 1, prev.getMonth()));
  };

  const handleNextYear = () => {
    const now = new Date();
    const newDate = new Date(selectedTime);

    if (selectedTime.getFullYear() + 1 >= now.getFullYear()) {
      setSelectedTime(new Date(now.getFullYear(), now.getMonth()));
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
      setSelectedTime(newDate);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedTime.getMonth() === now.getMonth() && selectedTime.getFullYear() === now.getFullYear();
  };

  const isCurrentYear = () => selectedTime.getFullYear() === new Date().getFullYear();

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

      {/* Layout a 2 colonne per grafici medi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuzione Spese */}
        <ChartCard
          title="Distribuzione Spese"
          subtitle={selectedTime.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
          icon={<ChartPieIcon className="w-5 h-5 text-primary" />}
          navigationEnabled
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          isNextDisabled={isCurrentMonth()}>
          <CategoryDistributionChart selectedTime={selectedTime} height={chartHeight} />
        </ChartCard>

        {/* Saldo Cumulativo */}
        <ChartCard title="Saldo Cumulativo" subtitle="Andamento nel tempo" icon={<ArrowTrendingUpIcon className="w-5 h-5 text-primary" />}>
          <CumulativeBalanceChart height={chartHeight} />
        </ChartCard>
      </div>

      {/* Andamento Giornaliero */}
      <ChartCard
        title="Andamento Giornaliero"
        subtitle={selectedTime.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
        icon={<ChartBarIcon className="w-5 h-5 text-primary" />}
        navigationEnabled
        onPrevious={handlePreviousMonth}
        onNext={handleNextMonth}
        isNextDisabled={isCurrentMonth()}>
        <DailyTrendChart selectedTime={selectedTime} height={chartHeight} />
      </ChartCard>

      {/* Panoramica Annuale */}
      <ChartCard
        title="Panoramica Annuale"
        subtitle={`Anno ${selectedTime.getFullYear()}`}
        icon={<ChartBarIcon className="w-5 h-5 text-primary" />}
        navigationEnabled
        onPrevious={handlePreviousYear}
        onNext={handleNextYear}
        isNextDisabled={isCurrentYear()}>
        <YearlyOverviewChart selectedTime={selectedTime} height={chartHeight} />
      </ChartCard>

      {/* Confronto Periodi */}
      <ChartCard
        title="Confronto Categorie"
        subtitle={`Anno ${selectedTime.getFullYear()}`}
        icon={<ChartBarIcon className="w-6 h-6 text-primary" />}
        navigationEnabled
        onPrevious={handlePreviousYear}
        onNext={handleNextYear}
        isNextDisabled={isCurrentYear()}>
        <CategoryTrendChart selectedTime={selectedTime} height={chartHeight} />
      </ChartCard>

      {/* Top 5 Transazioni */}
      <ChartCard title="Top 5 Spese" subtitle="Le tue transazioni più alte" icon={<FireIcon className="w-5 h-5 text-primary" />}>
        <TopTransactionsList transactions={topTransactions} />
      </ChartCard>

      <TransactionFormModal isOpen={isCreateTransasctionOpen} onOpenChange={onCreateTransasctionOpenChange} mode="create" />
    </div>
  );
}
