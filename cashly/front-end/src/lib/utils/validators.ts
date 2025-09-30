import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const signupSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

export const accountSchema = yup.object({
    accountName: yup
        .string()
        .min(1, 'Account name is required')
        .max(100, 'Account name is too long')
        .required('Account name is required'),
    initialBalance: yup
        .number()
        .min(0, 'Balance cannot be negative')
        .required('Initial balance is required'),
});

export const categorySchema = yup.object({
    categoryName: yup
        .string()
        .min(1, 'Category name is required')
        .max(100, 'Category name is too long')
        .required('Category name is required'),
    colorHex: yup
        .string()
        .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .nullable(),
    iconName: yup.string().max(50).nullable(),
});

export const transactionSchema = yup.object({
    amount: yup
        .number()
        .min(0.01, 'Amount must be greater than 0')
        .required('Amount is required'),
    type: yup
        .string()
        .oneOf(['income', 'expense'], 'Invalid transaction type')
        .required('Type is required'),
    categoryId: yup.number().nullable(),
    transactionDate: yup.date().nullable(),
    description: yup.string().max(500).nullable(),
});
