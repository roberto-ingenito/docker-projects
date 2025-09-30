import { Account } from '@/lib/types/account';
import { AccountCard } from './account-card';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountListProps {
    accounts: Account[];
    isLoading: boolean;
}

export function AccountList({ accounts, isLoading }: AccountListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                ))}
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No accounts yet</p>
                <p className="text-sm text-muted-foreground">
                    Create your first account to start tracking finances
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
                <AccountCard key={account.accountId} account={account} />
            ))}
        </div>
    );
}