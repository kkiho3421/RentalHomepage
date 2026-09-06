import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../utils/imageUrl";

function Home() {
    const navigate = useNavigate();

    const [type, setType] = useState("");
    const [color, setColor] = useState("");
    const [printRange, setPrintRange] = useState("");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
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
                console.error(
                    "인기 상품 조회 오류:",
                    error
                );
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (type) {
            params.set("type", type);
        }

        if (color) {
            params.set("color", color);
        }

        if (printRange) {
            params.set("printRange", printRange);
        }

        navigate(`/products?${params.toString()}`);
    };

    return (
        <main>
            {/* 메인 배너 */}
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-subtitle">
                        프린터 · 복합기 렌탈 전문
                    </p>

                    <h1>
                        필요한 만큼만,
                        <br />
                        합리적인 렌탈
                    </h1>

                    <p className="hero-description">
                        사무실에 필요한 프린터와 복합기를
                        <br />
                        간편하게 렌탈해보세요.
                    </p>

                    <button className="hero-button">
                        렌탈 상품 알아보기
                    </button>
                </div>
            </section>

            {/* 렌탈 상품 찾기 */}
            <section className="find-section">
                <div className="section-title">
                    <p>QUICK SEARCH</p>
                    <h2>나에게 맞는 렌탈 상품 찾기</h2>
                </div>

                <div className="find-box">
                    <div className="select-item">
                        <span>제품 종류</span>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">
                                선택해주세요
                            </option>

                            <option value="프린터">
                                프린터
                            </option>

                            <option value="복합기">
                                복합기
                            </option>

                            <option value="복사기">
                                복사기
                            </option>
                        </select>
                    </div>

                    <div className="select-item">
                        <span>출력 방식</span>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        >
                            <option value="">
                                선택해주세요
                            </option>

                            <option value="컬러">
                                컬러
                            </option>

                            <option value="흑백">
                                흑백
                            </option>
                        </select>
                    </div>

                    <div className="select-item">
                        <span>월 예상 출력량</span>
                        <select
                            value={printRange}
                            onChange={(e) => setPrintRange(e.target.value)}
                        >
                            <option value="">
                                선택해주세요
                            </option>

                            <option value="1000">
                                1,000장 이하
                            </option>

                            <option value="3000">
                                1,000 ~ 3,000장
                            </option>

                            <option value="5000">
                                3,000장 이상
                            </option>
                        </select>
                    </div>

                    <button
                        className="search-button"
                        onClick={handleSearch}
                    >
                        상품 찾기
                    </button>
                </div>
            </section>

            {/* 인기 상품 */}
            <section className="products-section">
                <div className="section-title">
                    <p>BEST PRODUCT</p>
                    <h2>인기 렌탈 상품</h2>
                </div>

                <div className="product-grid">

                    {products
                        .filter(
                            (product) =>
                                product.visible &&
                                product.featured
                        )
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map((product) => (

                        <Link
                            to={`/products/${product.id}`}
                            className="product-card"
                            key={product.id}
                        >

                            <div className="product-image">

                                <img
                                    src={getProductImageUrl(product.image)}
                                    alt={product.name}
                                />

                            </div>

                            <div className="product-info">

                                <span>
                                    {product.category}
                                </span>

                                <h3>
                                    {product.name}
                                </h3>

                                <strong>
                                    월 {product.price.toLocaleString()}원~
                                </strong>

                            </div>

                        </Link>

                    ))}

                </div>
            </section>

            {/* 상담 배너 */}
            <section className="consult-section">
                <div>
                    <p>RENTAL CONSULTING</p>
                    <h2>
                        어떤 제품을 선택해야 할지
                        <br />
                        고민되시나요?
                    </h2>
                    <span>
                        전문 상담원이 사용 환경에 맞는 제품을 추천해드립니다.
                    </span>
                </div>

                <button>
                    무료 상담 신청
                </button>
            </section>
        </main>
    );
}

export default Home;