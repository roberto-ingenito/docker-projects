'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { checkAuth } from '@/lib/redux/slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Check authentication status on app load
        store.dispatch(checkAuth());
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster richColors position="top-right" />
            </ThemeProvider>
        </Provider>
    );
}