export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
};

export const formatDateTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
};

export const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('it-IT').format(value);
};
