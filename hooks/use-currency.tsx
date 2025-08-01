import { useEffect, useState } from "react";
import { currencyService, type CurrencyInfo } from "@/lib/currency";

export function useCurrency() {
    const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeCurrency = async () => {
            try {
                const detectedCurrency = await currencyService.getCurrentCurrency();
                setCurrency(detectedCurrency);
            } catch (error) {
                console.error('Failed to initialize currency:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeCurrency();
    }, []);

    return {
        currency,
        isLoading,
        setCurrency: (newCurrency: CurrencyInfo) => {
            currencyService.setCurrency(newCurrency);
            setCurrency(newCurrency);
        },
    };
}