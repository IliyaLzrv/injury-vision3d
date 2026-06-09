import axiosClient from './axiosClient.js';

export const trainingLoadApi = {
	async createTrainingLoad(trainingData) {
		const response = await axiosClient.post('/training-loads', trainingData);
		return response.data;
	},

	async getTrainingLoads() {
		const response = await axiosClient.get('/training-loads');
		return response.data;
	},
};
