import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const authApi = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },
};

export const orderApi = {
    getAll: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    getByStatus: async (status) => {
        const response = await api.get(`/orders/status/${status}`);
        return response.data;
    },

    create: async (order) => {
        const response = await api.post('/orders', order);
        return response.data;
    },

    assignPartner: async (orderId, partnerId) => {
        const response = await api.post(`/orders/${orderId}/assign/${partnerId}`);
        return response.data;
    },

    updateStatus: async (orderId, status) => {
        const response = await api.put(`/orders/${orderId}/status?status=${status}`);
        return response.data;
    },
};

export const partnerApi = {
    getAll: async () => {
        const response = await api.get('/partners');
        return response.data;
    },

    getAvailable: async () => {
        const response = await api.get('/partners/available');
        return response.data;
    },

    create: async (partner) => {
        const response = await api.post('/partners', partner);
        return response.data;
    },

    updateAvailability: async (partnerId, isAvailable) => {
        const response = await api.put(`/partners/${partnerId}/availability?isAvailable=${isAvailable}`);
        return response.data;
    },

    updateEta: async (partnerId, eta) => {
        const response = await api.put(`/partners/${partnerId}/eta?eta=${eta}`);
        return response.data;
    },
};
