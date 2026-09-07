import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { API_URL } from "../config/api";

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "아이디 또는 비밀번호가 올바르지 않습니다."
                );
            }

            navigate("/admin/products");

        } catch (error) {
            console.error(error);

            setError(
                "아이디 또는 비밀번호가 올바르지 않습니다."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">

            <div className="admin-login-box">

                <p className="admin-login-label">
                    ADMIN
                </p>

                <h1>관리자 로그인</h1>

                <form onSubmit={handleSubmit}>

                    <div>
                        <label>아이디</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label>비밀번호</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="admin-login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "로그인 중..."
                            : "로그인"}
                    </button>

                </form>

            </div>

        </main>
    );
}

export default AdminLogin;