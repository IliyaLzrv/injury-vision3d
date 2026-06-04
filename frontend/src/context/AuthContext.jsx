import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { authApi } from '../api/authApi.js';
import { TOKEN_KEY } from '../api/axiosClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function restoreSession() {
			const storedToken = localStorage.getItem(TOKEN_KEY);

			if (!storedToken) {
				setLoading(false);
				return;
			}

			try {
				const currentUser = await authApi.getCurrentUser();
				setUser(currentUser);
				setToken(storedToken);
			} catch {
				localStorage.removeItem(TOKEN_KEY);
				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		}

		restoreSession();
	}, []);

	const login = useCallback(async (credentials) => {
		setError(null);
		const response = await authApi.login(credentials);
		localStorage.setItem(TOKEN_KEY, response.token);
		setToken(response.token);
		setUser(response.user);
		return response;
	}, []);

	const register = useCallback(async (userData) => {
		setError(null);
		const response = await authApi.register(userData);

		if (response.token) {
			localStorage.setItem(TOKEN_KEY, response.token);
			setToken(response.token);
			setUser(response.user);
		}

		return response;
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setUser(null);
		setError(null);
	}, []);

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(token && user),
			loading,
			error,
			setError,
			login,
			register,
			logout,
		}),
		[user, token, loading, error, login, register, logout]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
}
