"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { currencyService, type CurrencyInfo } from "@/lib/currency";
import { toast } from "sonner";

export default function CurrencySelector() {
    const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        const initCurrency = async () => {
            setIsDetecting(true);
            try {
                const currency = await currencyService.getCurrentCurrency();
                setCurrentCurrency(currency);
            } catch (error) {
                console.error('Failed to detect currency:', error);
            } finally {
                setIsDetecting(false);
            }
        };

        initCurrency();
    }, []);

    const handleCurrencyChange = (currencyCode: string) => {
        const availableCurrencies = currencyService.getAvailableCurrencies();
        const selectedCurrency = availableCurrencies.find(c => c.code === currencyCode);

        if (selectedCurrency) {
            const newCurrency: CurrencyInfo = {
                ...selectedCurrency,
                locale: `${navigator.language.split('-')[0]}-${currencyCode.substring(0, 2)}`,
            };

            currencyService.setCurrency(newCurrency);
            setCurrentCurrency(newCurrency);
            setIsOpen(false);

            toast("Currency Updated", {
                description: `Currency changed to ${selectedCurrency.name} (${selectedCurrency.code})`,
            });

            // Trigger a page refresh to update all currency displays
            window.location.reload();
        }
    };

    const detectCurrency = async () => {
        setIsDetecting(true);
        try {
            const currency = await currencyService.detectCurrency();
            setCurrentCurrency(currency);

            toast("Currency Detected", {
                description: `Detected currency: ${currency.name} (${currency.code})`,
            });

            // Trigger a page refresh to update all currency displays
            window.location.reload();
        } catch {
            toast.error("Detection Failed", {
                description: "Unable to detect currency from location",
            });
        } finally {
            setIsDetecting(false);
        }
    };

    const availableCurrencies = currencyService.getAvailableCurrencies();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <div className="flex items-center space-x-1">
                        <i className="fas fa-globe text-xs"></i>
                        {currentCurrency ? (
                            <Badge variant="secondary" className="text-xs">
                                {currentCurrency.symbol} {currentCurrency.code}
                            </Badge>
                        ) : (
                            <span className="text-xs">Currency</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Currency Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {currentCurrency && (
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{currentCurrency.name}</p>
                                    <p className="text-sm text-slate-600">
                                        {currentCurrency.code} ({currentCurrency.symbol})
                                    </p>
                                </div>
                                <Badge variant="outline">Current</Badge>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                Select Currency
                            </label>
                            <Select onValueChange={handleCurrencyChange} value={currentCurrency?.code || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a currency" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {availableCurrencies.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{currency.name}</span>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <Badge variant="outline" className="text-xs">
                                                        {currency.code}
                                                    </Badge>
                                                    <span className="text-sm text-slate-500">{currency.symbol}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={detectCurrency}
                                disabled={isDetecting}
                                className="w-full"
                            >
                                {isDetecting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-location-arrow mr-2"></i>
                                        Auto-detect from Location
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                Uses your browser location and timezone to detect currency
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}