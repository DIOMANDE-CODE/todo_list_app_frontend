
// Sauvegarder les tokens dans un localStorage
export const setTokens = (access:string, refresh:string) => {
    localStorage.setItem("access",access);
    localStorage.setItem("refresh",refresh);
}

export const getAccessToken = () => localStorage.getItem("access")
export const getRefreshToken = () => localStorage.getItem("refresh")    

// Suppression des tokens
export const clearTokens = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
}