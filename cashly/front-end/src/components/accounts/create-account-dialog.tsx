'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/lib/redux/hooks';
import { createAccount } from '@/lib/redux/slices/accountsSlice';
import { accountSchema } from '@/lib/utils/validators';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreateAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    accountName: string;
    initialBalance: number;
}

export function CreateAccountDialog({ open, onOpenChange }: CreateAccountDialogProps) {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(accountSchema),
        defaultValues: {
            accountName: '',
            initialBalance: 0,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await dispatch(createAccount(data)).unwrap();
            toast.success('Account created successfully');
            reset();
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to create account');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                        Add a new account to track your finances
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountName">Account Name</Label>
                            <Input
                                id="accountName"
                                placeholder="e.g., Main Checking"
                                {...register('accountName')}
                            />
                            {errors.accountName && (
                                <p className="text-sm text-destructive">{errors.accountName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="initialBalance">Initial Balance</Label>
                            <Input
                                id="initialBalance"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('initialBalance', { valueAsNumber: true })}
                            />
                            {errors.initialBalance && (
                                <p className="text-sm text-destructive">{errors.initialBalance.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Create Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}