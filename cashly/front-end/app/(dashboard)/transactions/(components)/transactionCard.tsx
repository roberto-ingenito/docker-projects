"use client";

import { Transaction, TransactionType, TransactionUpdateDto } from "@/lib/types/transaction";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TagIcon,
  CalendarIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import TransactionFormModal from "@/components/transactionFormModal";
import { useAppSelector } from "@/lib/redux/hooks";
import { useDisclosure, Card, CardBody, Chip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

interface TransactionCardProps {
  transaction: Transaction;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: () => void;
  onUpdate: (transactionId: number, data: TransactionUpdateDto) => void;
}

export default function TransactionCard({ transaction, isDeleting, isUpdating = false, onDelete, onUpdate }: TransactionCardProps) {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

  const categories = useAppSelector((state) => state.categories.categories);

  const transactionCategory = categories.find((x) => x.categoryId === transaction.categoryId);

  // Stati per il form di modifica
  const [editData, setEditData] = useState<TransactionUpdateDto>({
    amount: transaction.amount,
    type: transaction.type,
    categoryId: transaction.categoryId,
    transactionDate: transaction.transactionDate,
    description: transaction.description || null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionUpdateDto, string>>>({});

  // Reset form quando si apre il modal
  useEffect(() => {
    if (isEditOpen) {
      setEditData({
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId,
        transactionDate: transaction.transactionDate.split("T")[0], // Formato YYYY-MM-DD per input date
        description: transaction.description || null,
      });
      setErrors({});
    }
  }, [isEditOpen, transaction]);

  const isIncome = transaction.type === TransactionType.Income;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleConfirmDelete = () => {
    onDelete();
    onDeleteOpenChange();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionUpdateDto, string>> = {};

    if (editData.amount <= 0) {
      newErrors.amount = "L'importo deve essere maggiore di 0";
    }

    if (!editData.transactionDate) {
      newErrors.transactionDate = "La data è obbligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border border-default-200">
        <CardBody className="p-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left side - Icon and details */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isIncome ? "bg-success-100" : "bg-danger-100"}`}>
                {isIncome ? (
                  <ArrowTrendingUpIcon className="w-6 h-6 text-success-600" />
                ) : (
                  <ArrowTrendingDownIcon className="w-6 h-6 text-danger-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Description */}
                <p className="font-semibold text-base truncate">{transaction.description || (isIncome ? "Entrata" : "Uscita")}</p>

                {/* Category */}
                {transactionCategory && (
                  <div className="flex items-center gap-1 mt-1">
                    <TagIcon className="w-3.5 h-3.5 text-default-400" />
                    <span className="text-sm text-default-600">{transactionCategory.categoryName}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 mt-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-default-400" />
                  <span className="text-xs text-default-500">{formatDate(transaction.transactionDate)}</span>
                </div>
              </div>
            </div>

            {/* Right side - Amount and type */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <p className={`text-xl font-bold ${isIncome ? "text-success-600" : "text-danger-600"}`}>
                {isIncome ? "+" : "-"}
                {transaction.amount.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
              <Chip size="sm" variant="flat" color={isIncome ? "success" : "danger"} className="font-medium">
                {isIncome ? "Entrata" : "Uscita"}
              </Chip>
            </div>

            {/* Bottoni modifica - elimina */}
            <div className="flex flex-col gap-2">
              <Button isIconOnly color="primary" variant="flat" size="sm" onPress={onEditOpen} isDisabled={isUpdating || isDeleting} className="ml-2">
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                onPress={onDeleteOpen}
                isDisabled={isDeleting || isUpdating}
                className="ml-2">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal di modifica */}
      <TransactionFormModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} mode="edit" transaction={transaction} />

      {/* Modal di conferma eliminazione */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} placement="center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
                  <span>Conferma Eliminazione</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-default-600">Sei sicuro di voler eliminare la transazione?</p>
                  <p className="text-sm text-danger">⚠️ Questa azione non può essere annullata.</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={isDeleting}>
                  Annulla
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  startContent={!isDeleting && <TrashIcon className="w-4 h-4" />}>
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
