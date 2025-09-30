import { Account } from '@/lib/types/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Wallet, Calendar, TrendingUp } from 'lucide-react';

interface AccountDetailsProps {
    account: Account;
}

export function AccountDetails({ account }: AccountDetailsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{account.accountName}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Wallet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                            <p className="text-xl font-bold">
                                {formatCurrency(account.currentBalance, account.currency)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Change</p>
                            <p className="text-xl font-bold text-green-600">+12.5%</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                            <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created</p>
                            <p className="text-xl font-bold">{formatDate(account.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}