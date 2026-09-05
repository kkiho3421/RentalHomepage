import { Link, useParams, } from "react-router-dom";

import products from "../data/products";

function ProductDetail() {

    const { id } = useParams();

    const product = products.find(
        (item) => item.id === Number(id)
    );

    if (!product) {
        return (
            <main className="not-found">
                <h1>상품을 찾을 수 없습니다.</h1>

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
                        src={product.image}
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