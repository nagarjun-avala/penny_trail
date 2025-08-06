// app/context/LoadingContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type LoadingContextType = {
    loading: boolean;
    setLoading: (val: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => { },
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
