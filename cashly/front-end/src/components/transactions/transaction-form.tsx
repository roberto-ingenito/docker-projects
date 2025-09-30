'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createTransaction } from '@/lib/redux/slices/transactionsSlice';
import { transactionSchema } from '@/lib/utils/validators';
import { TransactionType } from '@/lib/types/transaction';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface TransactionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountId?: number;
}

interface FormData {
    amount: number;
    type: TransactionType;
    categoryId?: number;
    transactionDate?: Date;
    description?: string;
}

export function TransactionForm({ open, onOpenChange, accountId }: TransactionFormProps) {
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state) => state.categories);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(transactionSchema) as any,
        defaultValues: {
            type: TransactionType.Expense,
            transactionDate: new Date(),
        },
    });

    const transactionType = watch('type');

    const onSubmit = async (data: FormData) => {
        if (!accountId) {
            toast.error('Please select an account first');
            return;
        }

        try {
            await dispatch(createTransaction({
                accountId,
                data: {
                    ...data,
                    transactionDate: data.transactionDate?.toISOString(),
                }
            })).unwrap();
            toast.success('Transaction added successfully');
            reset();
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to add transaction');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new income or expense transaction
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <Tabs
                            value={transactionType}
                            onValueChange={(value) => setValue('type', value as TransactionType)}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value={TransactionType.Expense}>
                                    <ArrowDownIcon className="mr-2 h-4 w-4" />
                                    Expense
                                </TabsTrigger>
                                <TabsTrigger value={TransactionType.Income}>
                                    <ArrowUpIcon className="mr-2 h-4 w-4" />
                                    Income
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('amount', { valueAsNumber: true })}
                            />
                            {errors.amount && (
                                <p className="text-sm text-destructive">{errors.amount.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                onValueChange={(value) => setValue('categoryId', Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.categoryId} value={String(category.categoryId)}>
                                            <div className="flex items-center space-x-2">
                                                {category.colorHex && (
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: category.colorHex }}
                                                    />
                                                )}
                                                <span>{category.categoryName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                {...register('transactionDate', { valueAsDate: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Add a note about this transaction"
                                {...register('description')}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Add Transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}