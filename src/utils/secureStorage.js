class SecureStorage {
    constructor() {
        this.prefix = "app_";
        this.tokenKey = `${this.prefix}auth_token`;
        this.userKey = `${this.prefix}user`;
        this.storage = sessionStorage; // Use sessionStorage by default
    }

    // Set token with expiration
    setToken(token, expiresInHours = 24) {
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + expiresInHours * 60 * 60 * 1000);

        const tokenData = {
            token,
            expiry: expiry.getTime(),
        };

        this.storage.setItem(this.tokenKey, JSON.stringify(tokenData));
    }

    // Get token if not expired
    getToken() {
        try {
            const tokenData = this.storage.getItem(this.tokenKey);
            if (!tokenData) return null;

            const { token, expiry } = JSON.parse(tokenData);

            // Check if token is expired
            if (new Date().getTime() > expiry) {
                this.removeToken();
                return null;
            }

            return token;
        } catch (error) {
            console.error("Error getting token:", error);
            this.removeToken();
            return null;
        }
    }

    // Remove token
    removeToken() {
        this.storage.removeItem(this.tokenKey);
    }

    // Set user data
    setUser(user) {
        this.storage.setItem(this.userKey, JSON.stringify(user));
    }

    // Get user data
    getUser() {
        try {
            const userData = this.storage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    }

    // Remove user data
    removeUser() {
        this.storage.removeItem(this.userKey);
    }

    // Clear all auth data
    clear() {
        this.removeToken();
        this.removeUser();
    }

    // Check if token exists and is valid
    isAuthenticated() {
        return !!this.getToken();
    }

    // Switch between localStorage and sessionStorage
    setStorageType(type = "session") {
        if (type === "local") {
            this.storage = localStorage;
        } else {
            this.storage = sessionStorage;
        }
    }

    // Get current storage type
    getStorageType() {
        return this.storage === localStorage ? "local" : "session";
    }

    // Migrate data from one storage to another
    migrateStorage(fromType, toType) {
        const fromStorage =
            fromType === "local" ? localStorage : sessionStorage;
        const toStorage = toType === "local" ? localStorage : sessionStorage;

        // Get data from old storage
        const tokenData = fromStorage.getItem(this.tokenKey);
        const userData = fromStorage.getItem(this.userKey);

        // Move to new storage
        if (tokenData) {
            toStorage.setItem(this.tokenKey, tokenData);
            fromStorage.removeItem(this.tokenKey);
        }
        if (userData) {
            toStorage.setItem(this.userKey, userData);
            fromStorage.removeItem(this.userKey);
        }

        // Update current storage reference
        this.storage = toStorage;
    }
}

export default new SecureStorage();
