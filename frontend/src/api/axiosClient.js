import axios from 'axios';

export const TOKEN_KEY = 'injuryvision_token';

const baseURL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosClient.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status ?? null;
		const data = error.response?.data;

		if (status === 401) {
			console.warn('[API] Unauthorized (401)');
		}

		return Promise.reject({
			status,
			message: data?.message ?? error.message ?? 'Request failed',
			errors: data?.errors ?? null,
		});
	}
);

export default axiosClient;
