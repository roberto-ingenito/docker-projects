import { Chip } from "@heroui/chip";
import { Transaction } from "@/lib/types/transaction";

interface TopTransactionsListProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

export default function TopTransactionsList({ transactions, emptyMessage = "Nessuna spesa disponibile" }: TopTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-default-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
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
            <p className="text-xl font-bold text-primary">{transaction.amount.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
