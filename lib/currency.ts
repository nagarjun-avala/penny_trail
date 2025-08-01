// Currency mapping based on country codes and regions
const CURRENCY_MAP: Record<string, { code: string; symbol: string; name: string }> = {
    // North America
    US: { code: "USD", symbol: "$", name: "US Dollar" },
    CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    MX: { code: "MXN", symbol: "$", name: "Mexican Peso" },

    // Europe
    GB: { code: "GBP", symbol: "£", name: "British Pound" },
    DE: { code: "EUR", symbol: "€", name: "Euro" },
    FR: { code: "EUR", symbol: "€", name: "Euro" },
    IT: { code: "EUR", symbol: "€", name: "Euro" },
    ES: { code: "EUR", symbol: "€", name: "Euro" },
    NL: { code: "EUR", symbol: "€", name: "Euro" },
    BE: { code: "EUR", symbol: "€", name: "Euro" },
    AT: { code: "EUR", symbol: "€", name: "Euro" },
    CH: { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    NO: { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
    SE: { code: "SEK", symbol: "kr", name: "Swedish Krona" },
    DK: { code: "DKK", symbol: "kr", name: "Danish Krone" },

    // Asia Pacific
    JP: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    CN: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    KR: { code: "KRW", symbol: "₩", name: "South Korean Won" },
    IN: { code: "INR", symbol: "₹", name: "Indian Rupee" },
    AU: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    NZ: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
    SG: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    HK: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
    TH: { code: "THB", symbol: "฿", name: "Thai Baht" },
    MY: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    ID: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
    PH: { code: "PHP", symbol: "₱", name: "Philippine Peso" },
    VN: { code: "VND", symbol: "₫", name: "Vietnamese Dong" },

    // South America
    BR: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
    AR: { code: "ARS", symbol: "$", name: "Argentine Peso" },
    CL: { code: "CLP", symbol: "$", name: "Chilean Peso" },
    CO: { code: "COP", symbol: "$", name: "Colombian Peso" },
    PE: { code: "PEN", symbol: "S/", name: "Peruvian Sol" },

    // Middle East & Africa
    AE: { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    SA: { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    IL: { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
    TR: { code: "TRY", symbol: "₺", name: "Turkish Lira" },
    ZA: { code: "ZAR", symbol: "R", name: "South African Rand" },
    EG: { code: "EGP", symbol: "£", name: "Egyptian Pound" },
    NG: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },

    // Other regions
    RU: { code: "RUB", symbol: "₽", name: "Russian Ruble" },
    UA: { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
    PL: { code: "PLN", symbol: "zł", name: "Polish Zloty" },
    CZ: { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
    HU: { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
};

interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    locale: string;
}

class CurrencyService {
    private currentCurrency: CurrencyInfo | null = null;
    private detectionAttempted = false;

    async detectCurrency(): Promise<CurrencyInfo> {
        if (this.currentCurrency && this.detectionAttempted) {
            return this.currentCurrency;
        }

        this.detectionAttempted = true;

        try {
            // Method 1: Try browser's Intl API to get locale
            const browserLocale = navigator.language || navigator.languages[0];
            const region = browserLocale.split('-')[1]?.toUpperCase();

            if (region && CURRENCY_MAP[region]) {
                this.currentCurrency = {
                    ...CURRENCY_MAP[region],
                    locale: browserLocale,
                };
                this.saveCurrencyPreference(this.currentCurrency);
                return this.currentCurrency;
            }

            // Method 2: Try geolocation API
            if (navigator.geolocation) {
                try {
                    const position = await this.getCurrentPosition();
                    const countryCode = await this.getCountryFromCoordinates(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    if (countryCode && CURRENCY_MAP[countryCode]) {
                        this.currentCurrency = {
                            ...CURRENCY_MAP[countryCode],
                            locale: `${navigator.language.split('-')[0]}-${countryCode}`,
                        };
                        this.saveCurrencyPreference(this.currentCurrency);
                        return this.currentCurrency;
                    }
                } catch (error) {
                    console.warn('Geolocation detection failed:', error);
                }
            }

            // Method 3: Try timezone detection
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const countryFromTimezone = this.getCountryFromTimezone(timezone);

            if (countryFromTimezone && CURRENCY_MAP[countryFromTimezone]) {
                this.currentCurrency = {
                    ...CURRENCY_MAP[countryFromTimezone],
                    locale: browserLocale,
                };
                this.saveCurrencyPreference(this.currentCurrency);
                return this.currentCurrency;
            }

            // Fallback to USD
            this.currentCurrency = {
                ...CURRENCY_MAP.US,
                locale: 'en-US',
            };

        } catch (error) {
            console.warn('Currency detection failed:', error);
            // Fallback to USD
            this.currentCurrency = {
                ...CURRENCY_MAP.US,
                locale: 'en-US',
            };
        }

        this.saveCurrencyPreference(this.currentCurrency);
        return this.currentCurrency;
    }

    private getCurrentPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            });
        });
    }

    private async getCountryFromCoordinates(lat: number, lon: number): Promise<string | null> {
        try {
            // Using a free geocoding service - in production, you might want to use a more reliable service
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );

            if (response.ok) {
                const data = await response.json();
                return data.countryCode;
            }
        } catch (error) {
            console.warn('Geocoding failed:', error);
        }

        return null;
    }

    private getCountryFromTimezone(timezone: string): string | null {
        // Basic timezone to country mapping
        const timezoneCountryMap: Record<string, string> = {
            'America/New_York': 'US',
            'America/Chicago': 'US',
            'America/Denver': 'US',
            'America/Los_Angeles': 'US',
            'America/Toronto': 'CA',
            'America/Vancouver': 'CA',
            'Europe/London': 'GB',
            'Europe/Paris': 'FR',
            'Europe/Berlin': 'DE',
            'Europe/Rome': 'IT',
            'Europe/Madrid': 'ES',
            'Europe/Amsterdam': 'NL',
            'Europe/Stockholm': 'SE',
            'Europe/Oslo': 'NO',
            'Europe/Copenhagen': 'DK',
            'Europe/Zurich': 'CH',
            'Asia/Tokyo': 'JP',
            'Asia/Shanghai': 'CN',
            'Asia/Seoul': 'KR',
            'Asia/Kolkata': 'IN',
            'Asia/Singapore': 'SG',
            'Asia/Hong_Kong': 'HK',
            'Asia/Bangkok': 'TH',
            'Asia/Kuala_Lumpur': 'MY',
            'Asia/Jakarta': 'ID',
            'Asia/Manila': 'PH',
            'Asia/Ho_Chi_Minh': 'VN',
            'Australia/Sydney': 'AU',
            'Australia/Melbourne': 'AU',
            'Pacific/Auckland': 'NZ',
            'America/Sao_Paulo': 'BR',
            'America/Argentina/Buenos_Aires': 'AR',
            'America/Santiago': 'CL',
            'America/Bogota': 'CO',
            'America/Lima': 'PE',
            'Asia/Dubai': 'AE',
            'Asia/Riyadh': 'SA',
            'Asia/Jerusalem': 'IL',
            'Europe/Istanbul': 'TR',
            'Africa/Johannesburg': 'ZA',
            'Africa/Cairo': 'EG',
            'Africa/Lagos': 'NG',
            'Europe/Moscow': 'RU',
            'Europe/Kiev': 'UA',
            'Europe/Warsaw': 'PL',
            'Europe/Prague': 'CZ',
            'Europe/Budapest': 'HU',
        };

        return timezoneCountryMap[timezone] || null;
    }

    private saveCurrencyPreference(currency: CurrencyInfo): void {
        try {
            localStorage.setItem('penny-trail-currency', JSON.stringify(currency));
        } catch (error) {
            console.warn('Failed to save currency preference:', error);
        }
    }

    getCachedCurrency(): CurrencyInfo | null {
        try {
            return {
                code: CURRENCY_MAP['IN'].code,
                symbol: CURRENCY_MAP['IN'].symbol,
                name: CURRENCY_MAP['IN'].name,
                locale: 'en-IN',
            }
        } catch (error) {
            console.warn('Failed to load cached currency:', error)
            return {
                code: CURRENCY_MAP['IN'].code,
                symbol: CURRENCY_MAP['IN'].symbol,
                name: CURRENCY_MAP['IN'].name,
                locale: 'en-IN',
            }
        }
    }

    async getCurrentCurrency(): Promise<CurrencyInfo> {
        if (this.currentCurrency) {
            return this.currentCurrency;
        }

        // Try to load from cache first
        const cached = this.getCachedCurrency();
        if (cached) {
            this.currentCurrency = cached;
            return cached;
        }

        // Otherwise detect
        return this.detectCurrency();
    }

    setCurrency(currency: CurrencyInfo): void {
        this.currentCurrency = currency;
        this.saveCurrencyPreference(currency);
    }

    getAvailableCurrencies(): Array<{ code: string; name: string; symbol: string }> {
        const unique = new Map();
        Object.values(CURRENCY_MAP).forEach(currency => {
            if (!unique.has(currency.code)) {
                unique.set(currency.code, currency);
            }
        });
        return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    formatCurrency(amount: number | string): string {
        const currency = this.currentCurrency || { code: 'USD', locale: 'en-US' };
        const num = typeof amount === "string" ? parseFloat(amount) : amount;

        return new Intl.NumberFormat(currency.locale, {
            style: "currency",
            currency: currency.code,
        }).format(num);
    }
}

export const currencyService = new CurrencyService();
export type { CurrencyInfo };