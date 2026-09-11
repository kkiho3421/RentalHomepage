const getCookie = (name) => {
    const cookies = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${name}=`));

    if (!cookies) {
        return null;
    }

    return decodeURIComponent(
        cookies.substring(name.length + 1)
    );
};

export const adminFetch = async (url, options = {}) => {
    const method = (options.method || "GET").toUpperCase();

    const headers = new Headers(options.headers || {});

    if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(method)
    ) {
        const csrfToken = getCookie("XSRF-TOKEN");

        if (csrfToken) {
            headers.set("X-XSRF-TOKEN", csrfToken);
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status === 401) {
        window.location.href = "/admin/login";

        const error = new Error(
            "관리자 세션이 만료되었습니다."
        );

        error.isUnauthorized = true;

        throw error;
    }

    return response;
};