// src/lib/api.ts (Version corrigée)
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer le refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Exclure les endpoints d'authentification
    const isAuthEndpoint =
      originalRequest.url?.includes("/login/") ||
      originalRequest.url?.includes("/register/") ||
      originalRequest.url?.includes("/token/refresh/");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Si access token expiré → essayer refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        console.log("Tentative de refresh du token...");

        if (!refresh) {
          throw new Error("Pas de refresh token disponible");
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/refresh/`,
          { refresh: refresh }
        );

        console.log("Refresh réussi:", res.data);
        setTokens(res.data.access, res.data.refresh);

        // Réessayer la requête avec le nouveau access token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Échec du refresh token:", refreshError);

        // CRITIQUE : Nettoyer les tokens invalides
        clearTokens();

        // Rediriger vers la page de connexion
        if (typeof window !== "undefined") {
          window.location.href = "/connexion";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
