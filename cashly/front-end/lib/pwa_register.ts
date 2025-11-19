'use client'

import { useEffect } from 'react'

export function PwaRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/cashly/sw.js').catch(console.error)
        }
    }, [])

    return null
}
