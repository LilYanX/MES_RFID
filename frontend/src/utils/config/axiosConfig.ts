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
 // Intercepteur pour gérer le rafraîchissement automatique du token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = document.cookie.split("; ").find(row => row.startsWith("refreshToken="))?.split("=")[1];
                if (refreshToken) {
                    const response = await axiosInstance.post("/auth/refresh", {
                        refreshToken: refreshToken
                    }, {
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        const accessToken = response.data.accessToken;
                        document.cookie = `accessToken=${accessToken}; path=/`;
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axiosInstance(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error("Erreur lors du rafraîchissement du token:", refreshError);
                // Rediriger vers la page de connexion si le token est invalide
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;