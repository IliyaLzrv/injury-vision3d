import axiosClient from './axiosClient.js';

export const injuryApi = {
	async createInjuryLog(injuryData) {
		const response = await axiosClient.post('/injuries', injuryData);
		return response.data;
	},

	async getInjuryLogs() {
		const response = await axiosClient.get('/injuries');
		return response.data;
	},

	async updateInjuryLog(id, injuryData) {
		const response = await axiosClient.put(`/injuries/${id}`, injuryData);
		return response.data;
	},

	async deleteInjuryLog(id) {
		const response = await axiosClient.delete(`/injuries/${id}`);
		return response.data;
	},
};
