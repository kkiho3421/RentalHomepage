import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductImageUrl } from "../utils/imageUrl";
import { API_URL } from "../config/api";

function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/api/products/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "상품 정보를 불러오지 못했습니다."
                    );
                }

                const data = await response.json();

                if (!data.visible) {
                    setProduct(null);
                    setError("현재 노출되지 않는 상품입니다.");
                    return;
                }
                
                setProduct(data);

            } catch (error) {
                console.error(error);

                setError(
                    "상품 정보를 불러오는 중 오류가 발생했습니다."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <main className="product-detail-page">
                <p>상품 정보를 불러오는 중입니다.</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="product-detail-page">
                <p>{error}</p>

                <Link to="/products">
                    상품 목록으로 돌아가기
                </Link>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail-page">
                <p>상품을 찾을 수 없습니다.</p>

                <Link to="/products">
                    상품 목록으로 돌아가기
                </Link>
            </main>
        );
    }

    return (

        <main className="product-detail">

            <div className="detail-container">

                <div className="detail-image">

                    <img
                        src={getProductImageUrl(product.image)}
                        alt={product.name}
                    />

                </div>

                <div className="detail-info">

                    <span className="detail-category">
                        {product.category}
                    </span>

                    <h1>
                        {product.name}
                    </h1>

                    <p className="detail-description">
                        {product.description}
                    </p>

                    <div className="detail-price">

                        <span>월 렌탈료</span>

                        <strong>
                            {product.price.toLocaleString()}원~
                        </strong>

                    </div>

                    <div className="detail-spec">

                        <div>
                            <span>월 출력량</span>
                            <strong>
                                {product.monthlyPrint}
                            </strong>
                        </div>

                        <div>
                            <span>출력 방식</span>
                            <strong>
                                {product.color}
                            </strong>
                        </div>

                        <div>
                            <span>용지 크기</span>
                            <strong>
                                {product.paper}
                            </strong>
                        </div>

                    </div>

                    <Link
                        to="/consultation"
                        state={{ product }}
                        className="consult-detail-button"
                    >
                        무료 상담 신청
                    </Link>

                </div>

            </div>

            <section className="detail-description-section">

                <h2>
                    제품 안내
                </h2>

                <p>
                    제품의 상세 정보와 렌탈 조건을
                    상담을 통해 안내해드립니다.
                </p>

            </section>

        </main>

    );
}

export default ProductDetail;