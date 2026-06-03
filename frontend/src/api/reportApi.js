import axiosClient from './axiosClient.js';

export const reportApi = {
	async getDashboardSummary() {
		const response = await axiosClient.get('/reports/dashboard');
		return response.data;
	},

	async getWeeklyReport() {
		const response = await axiosClient.get('/reports/weekly');
		return response.data;
	},
};
