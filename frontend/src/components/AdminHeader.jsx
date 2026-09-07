import { NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("로그아웃에 실패했습니다.");
            }

            navigate("/admin/login", {
                replace: true,
            });

        } catch (error) {
            console.error(error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <header className="admin-header">
            <div className="admin-header-inner">

                <NavLink
                    to="/admin"
                    className="admin-logo"
                >
                    RENTAL ADMIN
                </NavLink>

                <nav className="admin-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        대시보드
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        상품 관리
                    </NavLink>

                    <NavLink
                        to="/admin/password"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        비밀번호 변경
                    </NavLink>

                    <NavLink
                        to="/admin/consultations"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        상담 관리
                    </NavLink>

                    <NavLink
                        to="/"
                    >
                        홈페이지 보기
                    </NavLink>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="admin-logout-button"
                    >
                        로그아웃
                    </button>
                </nav>

            </div>
        </header>
    );
}

export default AdminHeader;