import { useEffect, useState } from "react";

function AdminConsultations() {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await fetch(
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(
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

        } catch (error) {
            console.error(error);

            alert(
                "상담 상태를 변경하는 중 오류가 발생했습니다."
            );
        }
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

                <div className="admin-consultations-summary">

                    총 상담 신청

                    <strong>
                        {consultations.length}
                    </strong>

                    건

                </div>

                {consultations.length === 0 ? (

                    <div className="admin-empty">
                        접수된 상담 신청이 없습니다.
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
                                    <th>상품 ID</th>
                                    <th>상태</th>
                                </tr>
                            </thead>

                            <tbody>

                                {consultations.map(
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
                                                {consultation.productId ?? "-"}
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
                                <span>상품 ID</span>
                                <strong>
                                    {selectedConsultation.productId ?? "-"}
                                </strong>
                            </div>

                            <div className="consultation-detail-item">
                                <span>상태</span>

                                <strong>
                                    {selectedConsultation.status === "PENDING"
                                        ? "접수 대기"
                                        : selectedConsultation.status === "IN_PROGRESS"
                                        ? "처리 중"
                                        : "상담 완료"}
                                </strong>
                            </div>

                        </div>

                        <div className="consultation-detail-message">
                            <span>문의 내용</span>

                            <div>
                                {selectedConsultation.message ||
                                    "작성된 문의 내용이 없습니다."}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminConsultations;