"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchTransactions, createTransaction, setFilters, clearFilters } from "@/lib/redux/slices/transactionsSlice";
import { getCategories } from "@/lib/redux/slices/categoriesSlice";
import { TransactionCreateDto, TransactionType } from "@/lib/types/transaction";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import TransactionCard from "./(components)/transactionCard";
import CreateTransactionModal from "@/components/create-transaction-modal";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();

  // Selectors
  const transactions = useAppSelector((state) => state.transactions.transactions);
  const isLoading = useAppSelector((state) => state.transactions.isLoading);
  const error = useAppSelector((state) => state.transactions.error);
  const firstLoadDone = useAppSelector((state) => state.transactions.firstLoadDone);
  const filters = useAppSelector((state) => state.transactions.filters);

  const userCurrency = useAppSelector((state) => state.auth.user?.currency) ?? "EUR";
  const categories = useAppSelector((state) => state.categories.categories);
  const categoriesLoaded = useAppSelector((state) => state.categories.firstLoadDone);

  // Modal states
  const { isOpen: isCreateTransasctionOpen, onOpen: onCreateTransasctionOpen, onOpenChange: onCreateTransasctionOpenChange } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onOpenChange: onFilterOpenChange } = useDisclosure();

  // Filter form data
  const [filterFormData, setFilterFormData] = useState({
    type: "",
    categoryId: "",
    dateFrom: "",
    dateTo: "",
  });

  // Load initial data
  useEffect(() => {
    if (!categoriesLoaded) dispatch(getCategories());
    if (!firstLoadDone) dispatch(fetchTransactions());
  }, []);

  // Handle filter submit
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setFilters({
        type: filterFormData.type || undefined,
        categoryId: filterFormData.categoryId ? parseInt(filterFormData.categoryId) : undefined,
        dateFrom: filterFormData.dateFrom || undefined,
        dateTo: filterFormData.dateTo || undefined,
      })
    );
    onFilterOpenChange();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setFilterFormData({
      type: "",
      categoryId: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Filter transactions based on active filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filters.type && transaction.type !== filters.type) return false;
      if (filters.categoryId && transaction.category?.categoryId !== filters.categoryId) return false;
      if (filters.dateFrom && new Date(transaction.transactionDate) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(transaction.transactionDate) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [transactions, filters]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined).length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-primary bg-clip-text text-transparent">Transazioni</h1>
          <p className="text-default-500 mt-2">Gestisci le tue entrate e uscite</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            color="default"
            variant="flat"
            size="lg"
            startContent={<FunnelIcon className="w-5 h-5" />}
            onPress={onFilterOpen}
            className="flex-1 sm:flex-initial">
            Filtri
            {activeFiltersCount > 0 && (
              <Chip size="sm" color="primary" variant="flat" className="ml-1">
                {activeFiltersCount}
              </Chip>
            )}
          </Button>
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={onCreateTransasctionOpen}
            className="flex-1 sm:flex-initial font-semibold">
            Nuova Transazione
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Card className="mb-6 border-l-4 border-danger">
          <CardBody className="bg-danger-50">
            <p className="text-danger font-medium">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-6 bg-primary-50 border border-primary-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-default-700">Filtri attivi:</span>
                {filters.type && (
                  <Chip size="sm" variant="flat" color={filters.type === TransactionType.Income ? "success" : "danger"}>
                    {filters.type === TransactionType.Income ? "Entrate" : "Uscite"}
                  </Chip>
                )}
                {filters.categoryId && (
                  <Chip size="sm" variant="flat" color="primary">
                    {categories.find((c) => c.categoryId === filters.categoryId)?.categoryName}
                  </Chip>
                )}
                {(filters.dateFrom || filters.dateTo) && (
                  <Chip size="sm" variant="flat" color="secondary">
                    {filters.dateFrom && `Da ${new Date(filters.dateFrom).toLocaleDateString("it-IT")}`}
                    {filters.dateFrom && filters.dateTo && " - "}
                    {filters.dateTo && `A ${new Date(filters.dateTo).toLocaleDateString("it-IT")}`}
                  </Chip>
                )}
              </div>
              <Button size="sm" variant="light" color="danger" startContent={<XMarkIcon className="w-4 h-4" />} onPress={handleClearFilters}>
                Cancella
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Statistics Cards */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Income Card */}
          <Card className="bg-success-100 border-2 border-success-400">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-success-700 font-medium mb-1">Entrate</p>
                  <p className="text-2xl font-bold text-success-700">
                    {statistics.income.toLocaleString("it-IT", {
                      style: "currency",
                      currency: userCurrency,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success-200/50 flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-success-700" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Expense Card */}
          <Card className="bg-danger-100 border-2 border-danger-400">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-danger-700 font-medium mb-1">Uscite</p>
                  <p className="text-2xl font-bold text-danger-700">
                    {statistics.expense.toLocaleString("it-IT", {
                      style: "currency",
                      currency: userCurrency,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-danger-200/50 flex items-center justify-center">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-danger-700" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Balance Card */}
          <Card className="bg-primary-100 border-2 border-primary-400">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-700 font-medium mb-1">Bilancio</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {statistics.balance.toLocaleString("it-IT", {
                      style: "currency",
                      currency: userCurrency,
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-200/50 flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-primary-700" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500 mt-4">Caricamento transazioni...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <Card className="border-2 border-dashed border-default-300">
            <CardBody className="py-20">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
                <h3 className="text-xl font-semibold text-default-600 mb-2">
                  {activeFiltersCount > 0 ? "Nessuna transazione trovata" : "Nessuna transazione"}
                </h3>
                <p className="text-default-500 mb-6">
                  {activeFiltersCount > 0 ? "Prova a modificare i filtri di ricerca" : "Crea la tua prima transazione per iniziare"}
                </p>
                {activeFiltersCount === 0 && (
                  <Button color="primary" variant="flat" startContent={<PlusIcon className="w-5 h-5" />} onPress={onCreateTransasctionOpen}>
                    Nuova Transazione
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-default-600 font-medium">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? "transazione" : "transazioni"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {filteredTransactions.map((transaction) => (
                <TransactionCard key={transaction.transactionId} transaction={transaction} />
              ))}
            </div>
          </>
        )}
      </div>

      <CreateTransactionModal isOpen={isCreateTransasctionOpen} onOpenChange={onCreateTransasctionOpenChange} />

      {/* Modal Filters */}
      <Modal isOpen={isFilterOpen} onOpenChange={onFilterOpenChange} size="xl" placement="center" backdrop="blur">
        <ModalContent as="form" onSubmit={handleFilterSubmit}>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-2xl font-bold">Filtra Transazioni</h2>
              </ModalHeader>
              <ModalBody className="gap-4">
                {/* Type Filter */}
                <Select
                  label="Tipo"
                  placeholder="Tutti i tipi"
                  selectedKeys={filterFormData.type ? [filterFormData.type] : []}
                  onChange={(e) => setFilterFormData({ ...filterFormData, type: e.target.value })}
                  variant="bordered">
                  <SelectItem key={TransactionType.Income}>Entrate</SelectItem>
                  <SelectItem key={TransactionType.Expense}>Uscite</SelectItem>
                </Select>

                {/* Category Filter */}
                <Select
                  label="Categoria"
                  placeholder="Tutte le categorie"
                  selectedKeys={filterFormData.categoryId ? [filterFormData.categoryId] : []}
                  onChange={(e) => setFilterFormData({ ...filterFormData, categoryId: e.target.value })}
                  variant="bordered">
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId.toString()}>{category.categoryName}</SelectItem>
                  ))}
                </Select>

                {/* Date From */}
                <Input
                  label="Data da"
                  type="date"
                  value={filterFormData.dateFrom}
                  onChange={(e) => setFilterFormData({ ...filterFormData, dateFrom: e.target.value })}
                  variant="bordered"
                />

                {/* Date To */}
                <Input
                  label="Data a"
                  type="date"
                  value={filterFormData.dateTo}
                  onChange={(e) => setFilterFormData({ ...filterFormData, dateTo: e.target.value })}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="flat">
                  Annulla
                </Button>
                <Button type="submit" color="primary" startContent={<FunnelIcon className="w-5 h-5" />}>
                  Applica Filtri
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
