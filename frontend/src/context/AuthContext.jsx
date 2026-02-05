import { createContext, useState, useEffect } from "react";
import { login as loginAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginAPI(username, password);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Invalid username or password",
            }
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === "admin";
    }
    const isOperator = () => {
        return user?.role === "operador";
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAdmin,
                isOperator,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};