import { Category } from '@/lib/types/category';
import { CategoryCard } from './category-card';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryListProps {
    categories: Category[];
    isLoading: boolean;
}

export function CategoryList({ categories, isLoading }: CategoryListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No categories yet</p>
                <p className="text-sm text-muted-foreground">
                    Create categories to organize your transactions
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
                <CategoryCard key={category.categoryId} category={category} />
            ))}
        </div>
    );
}
