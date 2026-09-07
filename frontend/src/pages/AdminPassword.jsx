import { useState } from "react";
import { adminFetch } from "../utils/adminFetch";
import "../styles/admin.css";
import { API_URL } from "../config/api";

function AdminPassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword) {
            setError("현재 비밀번호를 입력해주세요.");
            return;
        }

        if (newPassword.length < 8) {
            setError("새 비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                "새 비밀번호는 현재 비밀번호와 다르게 입력해주세요."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await adminFetch(
                `${API_URL}/api/auth/password`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            if (!response.ok) {
                if (response.status === 400) {
                    setError(
                        "현재 비밀번호를 확인하거나 새 비밀번호 조건을 확인해주세요."
                    );
                    return;
                }

                throw new Error(
                    "비밀번호 변경에 실패했습니다."
                );
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setMessage(
                "비밀번호가 정상적으로 변경되었습니다."
            );
        } catch (error) {
            if (error.isUnauthorized) {
                return;
            }

            console.error(error);

            setError(
                "비밀번호 변경 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-password-page">
            <div className="admin-password-card">
                <h1>비밀번호 변경</h1>

                <p className="admin-password-description">
                    관리자 계정의 비밀번호를 변경합니다.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="admin-password-field">
                        <label>현재 비밀번호</label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="admin-password-field">
                        <label>새 비밀번호</label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                        />

                        <span>
                            8자 이상 입력해주세요.
                        </span>
                    </div>

                    <div className="admin-password-field">
                        <label>새 비밀번호 확인</label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <div className="admin-password-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="admin-password-success">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="admin-password-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "변경 중..."
                            : "비밀번호 변경"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminPassword;