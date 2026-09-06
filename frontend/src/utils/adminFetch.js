export const adminFetch = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (response.status === 401) {
        window.location.href = "/admin/login";

        const error = new Error("관리자 세션이 만료되었습니다.");
        error.isUnauthorized = true;

        throw error;
    }

    return response;
};