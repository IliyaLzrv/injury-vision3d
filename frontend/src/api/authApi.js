import axiosClient from './axiosClient.js';

export const authApi = {
	async register(userData) {
		const response = await axiosClient.post('/auth/register', userData);
		return response.data;
	},

	async login(credentials) {
		const response = await axiosClient.post('/auth/login', credentials);
		return response.data;
	},

	async getCurrentUser() {
		const response = await axiosClient.get('/auth/me');
		return response.data;
	},
};
