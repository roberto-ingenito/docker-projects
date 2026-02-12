import { Chip } from "@heroui/react";
import { Transaction } from "@/lib/types/transaction";
import { useAppSelector } from "@/lib/redux/hooks";
import { useMemo } from "react";

interface TopTransactionsListProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

export default function TopTransactionsList({ transactions, emptyMessage = "Nessuna spesa disponibile" }: TopTransactionsListProps) {
  const categories = useAppSelector((state) => state.categories.categories);

  // 1. Creiamo una Map per accesso O(1)
  const categoriesMap = useMemo(() => {
    return categories.reduce(
      (acc, cat) => {
        acc[cat.categoryId] = cat;
        return acc;
      },
      {} as Record<number, (typeof categories)[0]>,
    );
  }, [categories]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-62.5">
        <p className="text-default-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {transactions.map((transaction, index) => {
        const category = transaction.categoryId ? categoriesMap[transaction.categoryId] : null;

        return (
          <div key={transaction.transactionId} className="flex items-center gap-4 p-4 rounded-lg bg-primary/15">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 shrink-0">
              <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-default-900 truncate">{transaction.description || "Nessuna descrizione"}</p>
              <div className="flex items-center gap-2 mt-1">
                {category && (
                  <Chip
                    size="sm"
                    variant="flat"
                    style={{
                      backgroundColor: category.colorHex + "20",
                      color: category.colorHex,
                    }}>
                    {category.categoryName}
                  </Chip>
                )}
                <span className="text-xs text-default-500">{new Date(transaction.transactionDate).toLocaleDateString("it-IT")}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">{transaction.amount.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
