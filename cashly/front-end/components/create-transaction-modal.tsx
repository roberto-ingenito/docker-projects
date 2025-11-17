"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createTransaction } from "@/lib/redux/slices/transactionsSlice";
import { TransactionCreateDto, TransactionType } from "@/lib/types/transaction";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, PlusIcon } from "@heroicons/react/24/solid";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
}

export default function CreateTransactionModal({ isOpen, onOpenChange, onSuccess }: CreateTransactionModalProps) {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.transactions.isLoading);
  const userCurrency = useAppSelector((state) => state.auth.user?.currency) ?? "EUR";
  const categories = useAppSelector((state) => state.categories.categories);

  // Helper functions
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const getDefaultTime = () => new Date().toTimeString().slice(0, 5);

  // Form state
  const [formData, setFormData] = useState<TransactionCreateDto>({
    amount: 0,
    type: TransactionType.Expense,
    transactionDate: new Date().toISOString(),
    description: "",
    categoryId: undefined,
  });

  const [transactionDate, setTransactionDate] = useState(getCurrentDate());
  const [transactionTime, setTransactionTime] = useState(getDefaultTime());

  // Update transactionDate when date or time changes
  useEffect(() => {
    const dateTimeString = `${transactionDate}T${transactionTime}:00`;
    setFormData((prev) => ({ ...prev, transactionDate: dateTimeString }));
  }, [transactionDate, transactionTime]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        amount: 0,
        type: TransactionType.Expense,
        transactionDate: new Date().toISOString(),
        description: "",
        categoryId: undefined,
      });
      setTransactionDate(getCurrentDate());
      setTransactionTime(getDefaultTime());
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createTransaction(formData));

    if (result.meta.requestStatus === "fulfilled") {
      onOpenChange();
      onSuccess?.();
    }
  };

  // Format date and time for preview
  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" placement="center" backdrop="blur">
      <ModalContent as="form" onSubmit={handleSubmit}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Nuova Transazione</h2>
              <p className="text-sm text-default-500 font-normal">Registra una nuova entrata o uscita</p>
            </ModalHeader>

            <ModalBody className="gap-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Tipo di Transazione</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    size="lg"
                    variant={formData.type === TransactionType.Income ? "solid" : "bordered"}
                    color={formData.type === TransactionType.Income ? "success" : "default"}
                    startContent={<ArrowTrendingUpIcon className="w-5 h-5" />}
                    onPress={() => setFormData({ ...formData, type: TransactionType.Income })}
                    className="h-16">
                    Entrata
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant={formData.type === TransactionType.Expense ? "solid" : "bordered"}
                    color={formData.type === TransactionType.Expense ? "danger" : "default"}
                    startContent={<ArrowTrendingDownIcon className="w-5 h-5" />}
                    onPress={() => setFormData({ ...formData, type: TransactionType.Expense })}
                    className="h-16">
                    Uscita
                  </Button>
                </div>
              </div>

              {/* Amount */}
              <Input
                label="Importo"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount.toString()}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                isRequired
                variant="bordered"
                size="lg"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">€</span>
                  </div>
                }
              />

              {/* Category */}
              <Select
                label="Categoria"
                placeholder="Seleziona una categoria (opzionale)"
                selectedKeys={formData.categoryId ? [formData.categoryId.toString()] : []}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                variant="bordered"
                size="lg">
                {categories.map((category) => (
                  <SelectItem key={category.categoryId.toString()}>{category.categoryName}</SelectItem>
                ))}
              </Select>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Data"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  variant="bordered"
                  size="lg"
                  isRequired
                />
                <Input
                  label="Ora"
                  type="time"
                  value={transactionTime}
                  onChange={(e) => setTransactionTime(e.target.value)}
                  variant="bordered"
                  size="lg"
                  isRequired
                />
              </div>

              {/* Description */}
              <Textarea
                label="Descrizione"
                placeholder="Aggiungi una nota (opzionale)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="bordered"
                size="lg"
                maxLength={500}
                minRows={3}
              />

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium mb-3">Anteprima</label>
                <div
                  className={`p-4 border-2 rounded-lg ${
                    formData.type === TransactionType.Income ? "border-success-300 bg-success-100" : "border-danger-300 bg-danger-100"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">
                        {formData.description || (formData.type === TransactionType.Income ? "Entrata" : "Uscita")}
                      </p>
                      {formData.categoryId && (
                        <p className="text-sm text-default-600 mt-1">{categories.find((c) => c.categoryId === formData.categoryId)?.categoryName}</p>
                      )}
                      <p className="text-xs text-default-500 mt-1">{formatDateTime(transactionDate, transactionTime)}</p>
                    </div>
                    <p className={`text-2xl font-bold ${formData.type === TransactionType.Income ? "text-success-700" : "text-danger-700"}`}>
                      {formData.type === TransactionType.Income ? "+" : "-"}
                      {formData.amount.toLocaleString("it-IT", {
                        style: "currency",
                        currency: userCurrency,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button onPress={onClose} variant="flat">
                Annulla
              </Button>
              <Button
                type="submit"
                color={formData.type === TransactionType.Income ? "success" : "danger"}
                isLoading={isLoading}
                startContent={!isLoading && <PlusIcon className="w-5 h-5" />}>
                Crea Transazione
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
