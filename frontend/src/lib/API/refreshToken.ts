export async function refreshToken() {
    const res = await fetch('http://localhost:3000/api/auth/refresh', { method: 'POST', credentials: 'include' })
    if (!res.ok) {
        if (res.status === 401) {
            return { success: false, requiresLogin: true }
        }
        return { success: false, requiresLogin: false }
    }
    return { success: true, requiresLogin: false }
}