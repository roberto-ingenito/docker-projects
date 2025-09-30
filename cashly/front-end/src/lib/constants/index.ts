export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
} as const;

export const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

export const CATEGORY_ICONS = [
    { name: 'home', label: 'Home', icon: 'Home' },
    { name: 'shopping-cart', label: 'Shopping', icon: 'ShoppingCart' },
    { name: 'utensils', label: 'Food', icon: 'Utensils' },
    { name: 'car', label: 'Transport', icon: 'Car' },
    { name: 'heart', label: 'Health', icon: 'Heart' },
    { name: 'book', label: 'Education', icon: 'BookOpen' },
    { name: 'gift', label: 'Gifts', icon: 'Gift' },
    { name: 'credit-card', label: 'Bills', icon: 'CreditCard' },
    { name: 'briefcase', label: 'Work', icon: 'Briefcase' },
    { name: 'plane', label: 'Travel', icon: 'Plane' },
    { name: 'tv', label: 'Entertainment', icon: 'Tv' },
    { name: 'dumbbell', label: 'Fitness', icon: 'Dumbbell' },
];

export const DATE_RANGES = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: 'last3months', label: 'Last 3 months' },
    { value: 'last6months', label: 'Last 6 months' },
    { value: 'thisYear', label: 'This year' },
    { value: 'lastYear', label: 'Last year' },
    { value: 'all', label: 'All time' },
];

export const CURRENCIES = [
    { value: 'EUR', label: '€ Euro', symbol: '€' },
    { value: 'USD', label: '$ US Dollar', symbol: '$' },
    { value: 'GBP', label: '£ British Pound', symbol: '£' },
    { value: 'JPY', label: '¥ Japanese Yen', symbol: '¥' },
    { value: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
    { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
    { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
];