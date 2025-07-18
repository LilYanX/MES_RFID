import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add the access token to the request cookies
axiosInstance.interceptors.request.use((config) => {
    const accessToken = document.cookie.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1];
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const refreshToken = document.cookie.split("; ").find(row => row.startsWith("refreshToken="))?.split("=")[1];
    if (refreshToken) {
        config.headers.RefreshToken = `Bearer ${refreshToken}`;
    }
    return config;
});


export default axiosInstance;