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
        // Ajout d'une condition pour ne pas intercepter l'échec du refresh lui-même
        if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Tente de rafraîchir le token sans envoyer de données,
                // le refreshToken HttpOnly sera envoyé automatiquement par le navigateur.
                await axiosInstance.post("/auth/refresh");
                // Si le refresh réussit, la requête originale est relancée avec le nouvel accessToken.
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Si le refresh échoue, on redirige vers le login.
                console.error("Impossible de rafraîchir le token:", refreshError);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;