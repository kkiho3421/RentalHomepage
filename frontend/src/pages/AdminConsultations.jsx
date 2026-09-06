import { useEffect, useState } from "react";
import { adminFetch } from "../utils/adminFetch";

function AdminConsultations() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [products, setProducts] = useState([]);

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await adminFetch(
                    "http://localhost:8080/api/consultations"
                );

                if (!response.ok) {
                    throw new Error(
                        "상담 목록을 불러오지 못했습니다."
                    );
                }

                const data = await response.json();

                setConsultations(data);

            } catch (error) {
                if (error.isUnauthorized) {
                    return;
                }

                console.error(error);

                setError(
                    "상담 목록을 불러오는 중 오류가 발생했습니다."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();

    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await adminFetch(
                    "http://localhost:8080/api/products"
                );

                if (!response.ok) {
                    throw new Error(
                        "상품 목록을 불러오지 못했습니다."
                    );
                }

                const data = await response.json();

                setProducts(data);

            } catch (error) {
                if (error.isUnauthorized) {
                    return;
                }

                console.error(
                    "상품 목록 조회 오류:",
                    error
                );
            }
        };

        fetchProducts();
    }, []);
    
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await adminFetch(
                `http://localhost:8080/api/consultations/${id}/status?status=${newStatus}`,
                {
                    method: "PATCH",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "상태 변경에 실패했습니다."
                );
            }

            const updatedConsultation =
                await response.json();

            setConsultations((prev) =>
                prev.map((consultation) =>
                    consultation.id === id
                        ? updatedConsultation
                        : consultation
                )
            );

            setSelectedConsultation((prev) =>
                prev && prev.id === id
                    ? updatedConsultation
                    : prev
            );

        } catch (error) {
            if (error.isUnauthorized) {
                return;
            }
            
            console.error(error);

            alert(
                "상담 상태를 변경하는 중 오류가 발생했습니다."
            );
        }
    };

    const handleDeleteConsultation = async (id) => {
        const confirmed = window.confirm(
            "정말 이 상담 신청을 삭제하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await adminFetch(
                `http://localhost:8080/api/consultations/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "상담 삭제에 실패했습니다."
                );
            }

            setConsultations((prev) =>
                prev.filter(
                    (consultation) =>
                        consultation.id !== id
                )
            );

            setSelectedConsultation(null);

        } catch (error) {
            if (error.isUnauthorized) {
                return;
            }

            console.error(error);

            alert(
                "상담 삭제 중 오류가 발생했습니다."
            );
        }
    };

    const pendingCount = consultations.filter(
        (consultation) => consultation.status === "PENDING"
    ).length;

    const inProgressCount = consultations.filter(
        (consultation) => consultation.status === "IN_PROGRESS"
    ).length;

    const completedCount = consultations.filter(
        (consultation) => consultation.status === "COMPLETED"
    ).length;

    const filteredConsultations = consultations.filter((consultation) => {
            const matchesStatus =
                statusFilter === "ALL" ||
                consultation.status === statusFilter;

            const keyword = searchKeyword.trim().toLowerCase();

            const matchesSearch =
                keyword === "" ||
                consultation.name?.toLowerCase().includes(keyword) ||
                consultation.company?.toLowerCase().includes(keyword) ||
                consultation.phone?.includes(keyword);

            return matchesStatus && matchesSearch;
        }
    );

    const getProductName = (productId) => {
        if (!productId) {
            return "-";
        }

        const product = products.find(
            (product) =>
                String(product.id) === String(productId)
        );

        return product
            ? product.name
            : `상품 ID ${productId}`;
    };

    if (loading) {
        return (
            <main className="admin-consultations-page">
                <p>
                    상담 목록을 불러오는 중입니다.
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-consultations-page">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="admin-consultations-page">

            <section className="admin-consultations-header">

                <p>ADMIN</p>

                <h1>
                    상담 신청 관리
                </h1>

                <span>
                    고객이 신청한 렌탈 상담 내역을
                    확인할 수 있습니다.
                </span>

            </section>

            <section className="admin-consultations-container">

                <div className="admin-summary-cards">

                    <button
                        type="button"
                        className={`admin-summary-card ${
                            statusFilter === "ALL" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("ALL")}
                    >
                        <span>전체 상담</span>
                        <strong>{consultations.length}</strong>
                        <small>건</small>
                    </button>

                    <button
                        type="button"
                        className={`admin-summary-card ${
                            statusFilter === "PENDING" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("PENDING")}
                    >
                        <span>접수 대기</span>
                        <strong>{pendingCount}</strong>
                        <small>건</small>
                    </button>

                    <button
                        type="button"
                        className={`admin-summary-card ${
                            statusFilter === "IN_PROGRESS" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("IN_PROGRESS")}
                    >
                        <span>처리 중</span>
                        <strong>{inProgressCount}</strong>
                        <small>건</small>
                    </button>

                    <button
                        type="button"
                        className={`admin-summary-card ${
                            statusFilter === "COMPLETED" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("COMPLETED")}
                    >
                        <span>상담 완료</span>
                        <strong>{completedCount}</strong>
                        <small>건</small>
                    </button>

                </div>
                <div className="admin-consultations-tools">

                    <div className="admin-status-filters">

                        <button
                            type="button"
                            className={
                                statusFilter === "ALL"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => setStatusFilter("ALL")}
                        >
                            전체
                        </button>

                        <button
                            type="button"
                            className={
                                statusFilter === "PENDING"
                                    ? "active"
                                    : ""
                            }
                            onClick={() => setStatusFilter("PENDING")}
                        >
                            접수 대기
                        </button>

                        <button
                            type="button"
                            className={
                                statusFilter === "IN_PROGRESS"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter("IN_PROGRESS")
                            }
                        >
                            처리 중
                        </button>

                        <button
                            type="button"
                            className={
                                statusFilter === "COMPLETED"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setStatusFilter("COMPLETED")
                            }
                        >
                            상담 완료
                        </button>

                    </div>

                    <div className="admin-consultation-search">

                        <input
                            type="text"
                            placeholder="이름, 회사명, 연락처 검색"
                            value={searchKeyword}
                            onChange={(e) =>
                                setSearchKeyword(e.target.value)
                            }
                        />

                    </div>

                </div>

                {filteredConsultations.length === 0 ? (

                    <div className="admin-empty">
                        조건에 맞는 상담 신청이 없습니다.
                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-consultations-table">

                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>접수일</th>
                                    <th>이름</th>
                                    <th>회사명</th>
                                    <th>연락처</th>
                                    <th>상담 상품</th>
                                    <th>상태</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredConsultations.map(
                                    (consultation) => (

                                        <tr 
                                            key={consultation.id}
                                            className="consultation-row"
                                            onClick={() => setSelectedConsultation(consultation)}
                                        >

                                            <td>
                                                {consultation.id}
                                            </td>

                                            <td>
                                                {new Date(
                                                    consultation.createdAt
                                                ).toLocaleString(
                                                    "ko-KR"
                                                )}
                                            </td>

                                            <td>
                                                {consultation.name}
                                            </td>

                                            <td>
                                                {consultation.company}
                                            </td>

                                            <td>
                                                {consultation.phone}
                                            </td>

                                            <td>
                                                {getProductName(consultation.productId)}
                                            </td>

                                            <td>

                                                <select
                                                    className={`status-select status-${consultation.status.toLowerCase()}`}
                                                    value={consultation.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            consultation.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="PENDING">
                                                        접수 대기
                                                    </option>

                                                    <option value="IN_PROGRESS">
                                                        처리 중
                                                    </option>

                                                    <option value="COMPLETED">
                                                        상담 완료
                                                    </option>

                                                </select>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>
            {selectedConsultation && (
                <div
                    className="consultation-modal-overlay"
                    onClick={() => setSelectedConsultation(null)}
                >
                    <div
                        className="consultation-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="consultation-modal-header">
                            <div>
                                <p>CONSULTATION DETAIL</p>
                                <h2>상담 신청 상세</h2>
                            </div>
                            
                            <button
                                type="button"
                                className="consultation-modal-close"
                                onClick={() =>
                                    setSelectedConsultation(null)
                                }
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="consultation-detail-grid">
                            
                            <div className="consultation-detail-item">
                                <span>접수번호</span>
                                <strong>
                                    #{selectedConsultation.id}
                                </strong>
                            </div>
                            
                            <div className="consultation-detail-item">
                                <span>접수일</span>
                                <strong>
                                    {new Date(
                                        selectedConsultation.createdAt
                                        ).toLocaleString("ko-KR")}
                                </strong>
                            </div>
                            
                            <div className="consultation-detail-item">
                                <span>이름</span>
                                <strong>
                                    {selectedConsultation.name}
                                </strong>
                            </div>
                            
                            <div className="consultation-detail-item">
                                <span>회사명</span>
                                <strong>
                                    {selectedConsultation.company}
                                </strong>
                            </div>
                            
                            <div className="consultation-detail-item">
                                <span>연락처</span>
                                <strong>
                                    {selectedConsultation.phone}
                                </strong>
                            </div>

                            <div className="consultation-detail-item">
                                <span>이메일</span>
                                <strong>
                                    {selectedConsultation.email || "-"}
                                </strong>
                            </div>

                            <div className="consultation-detail-item">
                                <span>상담 상품</span>
                                <strong>
                                    {getProductName(
                                        selectedConsultation.productId
                                    )}
                                </strong>
                            </div>

                            <div className="consultation-detail-item">
                                <span>상태</span>

                                <select
                                    className={`status-select status-${selectedConsultation.status.toLowerCase()}`}
                                    value={selectedConsultation.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            selectedConsultation.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="PENDING">
                                        접수 대기
                                    </option>

                                    <option value="IN_PROGRESS">
                                        처리 중
                                    </option>

                                    <option value="COMPLETED">
                                        상담 완료
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="consultation-detail-message">
                            <span>문의 내용</span>

                            <div>
                                {selectedConsultation.message ||
                                    "작성된 문의 내용이 없습니다."}
                            </div>
                        </div>
                        <div className="consultation-modal-actions">
                            <button
                                type="button"
                                className="consultation-delete-button"
                                onClick={() =>
                                    handleDeleteConsultation(
                                        selectedConsultation.id
                                    )
                                }
                            >
                                상담 삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminConsultations;