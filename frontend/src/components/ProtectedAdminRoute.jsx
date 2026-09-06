import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error(error);
                setAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    if (authenticated === null) {
        return <div>로그인 확인 중...</div>;
    }

    if (!authenticated) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return children;
}

export default ProtectedAdminRoute;