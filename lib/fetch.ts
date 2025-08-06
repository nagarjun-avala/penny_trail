import { getData, postData } from "./api"
import { Category, Transaction } from "./types"

export const getCategories = async () => {
    try {
        const categories = await getData("/api/category");
        return categories as Category[]
    } catch {
        throw new Error("Falied to fetch data")
    }
}

export const getTrasactions = async () => {
    try {
        const trasactions = await getData("/api/transaction");
        return trasactions as Transaction[]
    } catch {
        throw new Error("Falied to fetch data")
    }
}

export const createTrasaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
    try {
        const res = await postData("/api/transaction", transaction);
        return res as Transaction
    } catch {
        throw new Error("Falied to create trasaction")
    }
}