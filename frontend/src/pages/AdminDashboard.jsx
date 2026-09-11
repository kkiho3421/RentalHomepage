import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { adminFetch } from "../utils/adminFetch"

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [productsResponse, consultationsResponse] =
                    await Promise.all([
                        adminFetch(
                            `${API_URL}/api/admin/products`
                        ),
                        adminFetch(
                            `${API_URL}/api/consultations`
                        ),
                    ]);

                if (
                    !productsResponse.ok ||
                    !consultationsResponse.ok
                ) {
                    throw new Error(
                        "대시보드 정보를 불러오지 못했습니다."
                    );
                }

                const productsData =
                    await productsResponse.json();

                const consultationsData =
                    await consultationsResponse.json();

                setProducts(productsData);
                setConsultations(consultationsData);

            } catch (error) {
                console.error(error);

                setError(
                    "대시보드 정보를 불러오는 중 오류가 발생했습니다."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const pendingCount = consultations.filter(
        (consultation) =>
            consultation.status === "PENDING"
    ).length;

    const inProgressCount = consultations.filter(
        (consultation) =>
            consultation.status === "IN_PROGRESS"
    ).length;

    const completedCount = consultations.filter(
        (consultation) =>
            consultation.status === "COMPLETED"
    ).length;

    if (loading) {
        return (
            <main className="admin-dashboard-page">
                <p>대시보드 정보를 불러오는 중입니다.</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-dashboard-page">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="admin-dashboard-page">

            <section className="admin-dashboard-header">
                <p>ADMIN</p>
                <h1>관리자 대시보드</h1>
                <span>
                    렌탈 홈페이지의 주요 현황을 확인할 수 있습니다.
                </span>
            </section>

            <section className="admin-dashboard-container">

                <div className="admin-dashboard-cards">

                    <Link
                        to="/admin/products"
                        className="admin-dashboard-card"
                    >
                        <span>등록 상품</span>
                        <strong>{products.length}</strong>
                        <small>개</small>
                    </Link>

                    <Link
                        to="/admin/consultations"
                        className="admin-dashboard-card"
                    >
                        <span>접수 대기</span>
                        <strong>{pendingCount}</strong>
                        <small>건</small>
                    </Link>

                    <Link
                        to="/admin/consultations"
                        className="admin-dashboard-card"
                    >
                        <span>처리 중</span>
                        <strong>{inProgressCount}</strong>
                        <small>건</small>
                    </Link>

                    <Link
                        to="/admin/consultations"
                        className="admin-dashboard-card"
                    >
                        <span>상담 완료</span>
                        <strong>{completedCount}</strong>
                        <small>건</small>
                    </Link>

                </div>

                <section className="admin-dashboard-recent">

                    <div className="admin-dashboard-section-header">
                        <div>
                            <h2>최근 상담 신청</h2>
                            <p>
                                최근 접수된 상담 신청을 확인할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            to="/admin/consultations"
                            className="admin-dashboard-more"
                        >
                            전체 보기
                        </Link>
                    </div>

                    {consultations.length === 0 ? (

                        <div className="admin-dashboard-empty">
                            접수된 상담 신청이 없습니다.
                        </div>

                    ) : (

                        <div className="admin-dashboard-table-wrapper">

                            <table className="admin-dashboard-table">

                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>접수일</th>
                                        <th>이름</th>
                                        <th>회사명</th>
                                        <th>연락처</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {consultations
                                        .slice(0, 5)
                                        .map((consultation) => (

                                            <tr key={consultation.id}>

                                                <td>
                                                    {consultation.id}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        consultation.createdAt
                                                    ).toLocaleString("ko-KR")}
                                                </td>

                                                <td>
                                                    {consultation.name}
                                                </td>

                                                <td>
                                                    {consultation.company || "-"}
                                                </td>

                                                <td>
                                                    {consultation.phone}
                                                </td>

                                                <td>
                                                    {consultation.status === "PENDING"
                                                        ? "접수 대기"
                                                        : consultation.status === "IN_PROGRESS"
                                                            ? "처리 중"
                                                            : "상담 완료"}
                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </section>

        </main>

        
    );
}

export default AdminDashboard;