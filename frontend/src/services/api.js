import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for JWT token
api.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', request.method.toUpperCase(), request.url, request.data);
    return request;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        return userData;
    },

    register: async (username, password, role) => {
        const response = await api.post('/auth/register', { username, password, role });
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
        try {
            console.log('Creating partner with data:', partner);
            const response = await api.post('/partners', partner);
            console.log('Partner creation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Partner creation error:', error.response?.data || error.message);
            throw error;
        }
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
