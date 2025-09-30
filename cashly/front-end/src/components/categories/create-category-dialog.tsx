'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/lib/redux/hooks';
import { createCategory } from '@/lib/redux/slices/categoriesSlice';
import { categorySchema } from '@/lib/utils/validators';
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
import { COLORS, CATEGORY_ICONS } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import React from 'react';

interface CreateCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    categoryName: string;
    colorHex: string | null;
    iconName: string | null;
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
    const dispatch = useAppDispatch();
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0].name);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(categorySchema) as any, // Add type assertion as fallback
        defaultValues: {
            categoryName: '',
            colorHex: COLORS[0],
            iconName: CATEGORY_ICONS[0].name,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await dispatch(createCategory({
                ...data,
                colorHex: selectedColor,
                iconName: selectedIcon,
            })).unwrap();
            toast.success('Category created successfully');
            reset();
            setSelectedColor(COLORS[0]);
            setSelectedIcon(CATEGORY_ICONS[0].name);
            onOpenChange(false);
        } catch {
            toast.error('Failed to create category');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                        Add a new category to organize your transactions
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                                id="categoryName"
                                placeholder="e.g., Groceries"
                                {...register('categoryName')}
                            />
                            {errors.categoryName && (
                                <p className="text-sm text-destructive">{errors.categoryName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <div className="grid grid-cols-6 gap-2">
                                {CATEGORY_ICONS.map((iconConfig) => {
                                    const IconComponent = Icons[iconConfig.icon as keyof typeof Icons] as React.FC<{ className: string }>;
                                    return (
                                        <Button
                                            key={iconConfig.name}
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className={cn(
                                                'h-10 w-10',
                                                selectedIcon === iconConfig.name && 'ring-2 ring-primary'
                                            )}
                                            onClick={() => setSelectedIcon(iconConfig.name)}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="grid grid-cols-10 gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={cn(
                                            'h-8 w-8 rounded-md border-2',
                                            selectedColor === color ? 'border-primary' : 'border-transparent'
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${selectedColor}20` }}
                            >
                                {(() => {
                                    const iconName = CATEGORY_ICONS.find(i => i.name === selectedIcon)?.icon;
                                    if (!iconName) return null;
                                    const IconComponent = Icons[iconName as keyof typeof Icons] as React.FC<{ className: string; style?: React.CSSProperties }>;
                                    return <IconComponent className="h-5 w-5" style={{ color: selectedColor }} />;
                                })()}
                            </div>
                            <span className="font-medium">Preview</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Create Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}