"use client";

import React from "react";
import { Transaction, TransactionType } from "@/lib/types/transaction";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TagIcon, CalendarIcon } from "@heroicons/react/24/solid";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === TransactionType.Income;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border border-default-200">
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left side - Icon and details */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isIncome ? "bg-success-100" : "bg-danger-100"}`}>
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
              {transaction.category && (
                <div className="flex items-center gap-1 mt-1">
                  <TagIcon className="w-3.5 h-3.5 text-default-400" />
                  <span className="text-sm text-default-600">{transaction.category.categoryName}</span>
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
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
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
        </div>
      </CardBody>
    </Card>
  );
}
