import { deleteData, getData, patchData, postData } from "./api"
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

/**
 * Creates or updates a category based on the presence of an `id`.
 *
 * - If `id` exists ➜ updates the existing category (PATCH).
 * - If no `id` ➜ creates a new category (POST).
 *
 * @param category The category data to create or update.
 * @returns The created or updated category object.
 */
export const createOrUpdateCategory = async (
    category: Partial<Category>
): Promise<Category> => {
    console.log(category)
    try {
        if (category.id && category.id !== "") {
            // ✏️ Update existing category
            const res = await patchData(`/api/category/${category.id}`, category);
            return res as Category;
        } else {
            // ➕ Create new category
            const res = await postData("/api/category", category);
            return res as Category;
        }
    } catch {
        throw new Error(
            category.id ? "Failed to update category" : "Failed to create category"
        );
    }
};

/**
 * Deletes a category by ID.
 *
 * @param id - The ID of the category to delete
 * @returns A success boolean or throws on failure
 * @throws If deletion fails or category has associated transactions
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
    try {
        await deleteData(`/api/category/${id}`);
        return true;
    } catch {
        // console.error("❌ Failed to delete category:", error);
        throw new Error(
            "Unable to delete category. It might be in use."
        );
    }
};


/**
 * Logs out the current user.
 *
 * Clears stored auth tokens and redirects to the homepage.
 *
 * @returns A success boolean or throws on failure
 * @throws If logout logic encounters an unexpected error
 */
export const logout = async (): Promise<boolean> => {
    try {
        // Clear tokens or session data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.clear();

        // Optionally, hit logout endpoint on backend
        await getData("/api/logout")

        // Redirect to home/login page
        window.location.href = "/";
        return true;
    } catch {
        // console.error("❌ Failed to logout:", error);
        throw new Error("Logout failed. Please try again.");
    }
};


/**
 * Registers a new user by sending their data to the registration API endpoint.
 *
 * @param user The user data (name, email, password).
 * @returns The created user object or throws an error if registration fails.
 */
export const registerUser = async (user: {
    name: string;
    email: string;
    password: string;
}) => {
    try {
        const res = await postData("/api/register", user);
        return res;
    } catch {
        throw new Error("Failed to register user");
    }
};

/**
 * Logs in a user by sending their credentials to the login API endpoint.
 *
 * @param credentials The user's login credentials (email, password).
 * @returns The logged-in user data (or token) or throws an error if login fails.
 */
export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    try {
        const res = await postData("/api/login", credentials);
        return res;
    } catch {
        throw new Error("Failed to login");
    }
};
