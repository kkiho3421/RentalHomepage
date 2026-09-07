import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProductImageUrl } from "../utils/imageUrl";
import { API_URL } from "../config/api";

function Consultation() {
    const location = useLocation();

    const product = location.state?.product;

    const [form, setForm] = useState({
        name: "",
        phone: "",
        company: "",
        email: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
        alert("이름을 입력해주세요.");
        return;
    }

    if (!form.phone.trim()) {
        alert("연락처를 입력해주세요.");
        return;
    }

    if (!form.company.trim()) {
        alert("회사명을 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/consultations`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    company: form.company,
                    email: form.email,
                    message: form.message,
                    productId: product?.id ?? null,
                }),
            }
        );

        if (!response.ok) {
            throw new Error("상담 신청 저장에 실패했습니다.");
        }

        const data = await response.json();

        console.log("저장된 상담 정보:", data);

        setSubmitted(true);

    } catch (error) {
        console.error("상담 신청 오류:", error);

        alert(
            "상담 신청 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요."
        );
    }
};

    if (submitted) {
        return (
            <main className="consultation-page">

                <section className="consultation-complete">

                    <div className="complete-icon">
                        ✓
                    </div>

                    <p>
                        CONSULTATION COMPLETE
                    </p>

                    <h1>
                        상담 신청이 완료되었습니다.
                    </h1>

                    <span>
                        입력해주신 연락처로 전문 상담원이
                        빠르게 연락드리겠습니다.
                    </span>

                    {product && (
                        <div className="complete-product">
                            <span>
                                상담 신청 상품
                            </span>

                            <strong>
                                {product.name}
                            </strong>
                        </div>
                    )}

                    <Link
                        to="/products"
                        className="back-products-button"
                    >
                        상품 목록으로 돌아가기
                    </Link>

                </section>

            </main>
        );
    }

    return (
        <main className="consultation-page">

            <section className="consultation-header">

                <p>
                    RENTAL CONSULTATION
                </p>

                <h1>
                    무료 상담 신청
                </h1>

                <span>
                    제품 선택부터 렌탈 조건까지
                    전문 상담원이 안내해드립니다.
                </span>

            </section>

            <section className="consultation-container">

                {/* 상품 정보 */}
                {product && (
                    <div className="consultation-product">

                        <div className="consultation-product-image">

                            <img
                                src={getProductImageUrl(product.image)}
                                alt={product.name}
                            />

                        </div>

                        <div className="consultation-product-info">

                            <span>
                                {product.category}
                            </span>

                            <h2>
                                {product.name}
                            </h2>

                            <strong>
                                월{" "}
                                {product.price.toLocaleString()}
                                원~
                            </strong>

                        </div>

                    </div>
                )}

                {/* 상담 폼 */}
                <form
                    className="consultation-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        상담 신청 정보
                    </h2>

                    <p className="form-description">
                        아래 정보를 입력해주시면
                        상담원이 연락드리겠습니다.
                    </p>

                    {/* 이름 */}
                    <div className="form-group">

                        <label htmlFor="name">
                            이름 <span>*</span>
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="이름을 입력해주세요."
                        />

                    </div>

                    {/* 연락처 */}
                    <div className="form-group">

                        <label htmlFor="phone">
                            연락처 <span>*</span>
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="010-0000-0000"
                        />

                    </div>

                    {/* 회사명 */}
                    <div className="form-group">

                        <label htmlFor="company">
                            회사명 <span>*</span>
                        </label>

                        <input
                            id="company"
                            name="company"
                            type="text"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="회사명을 입력해주세요."
                        />

                    </div>

                    {/* 이메일 */}
                    <div className="form-group">

                        <label htmlFor="email">
                            이메일
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />

                    </div>

                    {/* 문의 내용 */}
                    <div className="form-group">

                        <label htmlFor="message">
                            문의 내용
                        </label>

                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="궁금한 내용을 입력해주세요."
                            rows="6"
                        />

                    </div>

                    {/* 개인정보 동의 */}
                    <div className="privacy-box">

                        <label>

                            <input
                                type="checkbox"
                                required
                            />

                            개인정보 수집 및 이용에 동의합니다.

                        </label>

                    </div>

                    <button
                        type="submit"
                        className="consultation-submit"
                    >
                        무료 상담 신청
                    </button>

                </form>

            </section>

        </main>
    );
}

export default Consultation;