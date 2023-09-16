import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
    },
});

const api = {
    get: async (endpoint, authToken) => {
        try {
            const response = await instance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
    post: async (endpoint, data, authToken) => {
        try {
            const response = await instance.post(endpoint, data, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    },
    put: async (endpoint, data, authToken) => {
        try {
            const response = await instance.put(endpoint, data, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    },

    deleteFunc: async (endpoint, authToken) => {
        try {
            const response = await instance.delete(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    },
};

export default api;
