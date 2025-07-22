import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// The request interceptor is no longer needed as credentials (cookies) are handled by the browser.

 // Intercepteur pour gérer le rafraîchissement automatique du token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axiosInstance.post("/auth/refresh", {}, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    return axiosInstance(originalRequest);
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