'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAccounts } from '@/lib/redux/slices/accountsSlice';
import { AccountList } from '@/components/accounts/account-list';
import { CreateAccountDialog } from '@/components/accounts/create-account-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AccountsPage() {
    const dispatch = useAppDispatch();
    const { accounts, isLoading } = useAppSelector((state) => state.accounts);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAccounts());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">
                        Manage your financial accounts
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Account
                </Button>
            </div>

            <AccountList accounts={accounts} isLoading={isLoading} />

            <CreateAccountDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </div>
    );
}