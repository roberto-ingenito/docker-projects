'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { deleteAccount } from '@/lib/redux/slices/accountsSlice';
import { Account } from '@/lib/types/account';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { MoreVertical, Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface AccountCardProps {
    account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
    const dispatch = useAppDispatch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteAccount(account.accountId)).unwrap();
            toast.success('Account deleted successfully');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const isPositive = account.currentBalance >= 0;

    return (
        <>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{account.accountName}</h3>
                        <p className="text-xs text-muted-foreground">
                            Created {formatDate(account.createdAt)}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/accounts/${account.accountId}`}>
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold">
                                {formatCurrency(account.currentBalance, account.currency)}
                            </p>
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                        </div>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {isPositive ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            {`Are you sure you want to delete "${account.accountName}"? This action cannot be undone and will delete all associated transactions.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}