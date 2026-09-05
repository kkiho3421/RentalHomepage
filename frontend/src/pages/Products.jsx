import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams,
} from "react-router-dom";

import products from "../data/products";

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    // URL에 저장된 검색 조건
    const initialType = searchParams.get("type") || "";
    const initialColor = searchParams.get("color") || "";
    const initialPrintRange =
        searchParams.get("printRange") || "";

    const [selectedTypes, setSelectedTypes] = useState(
        initialType ? [initialType] : []
    );

    const [selectedColors, setSelectedColors] =
        useState(
            initialColor ? [initialColor] : []
        );

    const [selectedPrintRange, setSelectedPrintRange] =
        useState(initialPrintRange);

    const [sort, setSort] = useState("recommended");

    /*
     * URL이 변경되었을 때
     * 화면의 필터도 맞춰준다.
     */
    useEffect(() => {
        const type =
            searchParams.get("type") || "";

        const color =
            searchParams.get("color") || "";

        const printRange =
            searchParams.get("printRange") || "";

        setSelectedTypes(
            type ? [type] : []
        );

        setSelectedColors(
            color ? [color] : []
        );

        setSelectedPrintRange(printRange);
    }, [searchParams]);

    /*
     * 제품 종류 체크박스
     */
    const handleTypeChange = (type) => {
        let newTypes;

        if (selectedTypes.includes(type)) {
            newTypes = selectedTypes.filter(
                (item) => item !== type
            );
        } else {
            newTypes = [
                ...selectedTypes,
                type,
            ];
        }

        setSelectedTypes(newTypes);

        updateSearchParams(
            newTypes,
            selectedColors,
            selectedPrintRange
        );
    };

    /*
     * 컬러 / 흑백 체크박스
     */
    const handleColorChange = (color) => {
        let newColors;

        if (selectedColors.includes(color)) {
            newColors = selectedColors.filter(
                (item) => item !== color
            );
        } else {
            newColors = [
                ...selectedColors,
                color,
            ];
        }

        setSelectedColors(newColors);

        updateSearchParams(
            selectedTypes,
            newColors,
            selectedPrintRange
        );
    };

    /*
     * 출력량 변경
     */
    const handlePrintRangeChange = (value) => {
        setSelectedPrintRange(value);

        updateSearchParams(
            selectedTypes,
            selectedColors,
            value
        );
    };

    /*
     * URL 검색 조건 변경
     */
    const updateSearchParams = (
        types,
        colors,
        printRange
    ) => {
        const params = {};

        if (types.length > 0) {
            params.type = types.join(",");
        }

        if (colors.length > 0) {
            params.color = colors.join(",");
        }

        if (printRange) {
            params.printRange = printRange;
        }

        setSearchParams(params);
    };

    /*
     * 상품 필터링
     */
    const filteredProducts = products.filter(
        (product) => {

            // 제품 종류
            const typeMatch =
                selectedTypes.length === 0 ||
                selectedTypes.includes(product.type);

            // 출력 방식
            const colorMatch =
                selectedColors.length === 0 ||
                selectedColors.includes(product.color);

            // 출력량
            let printMatch = true;

            if (selectedPrintRange === "1000") {
                printMatch =
                    Number(product.printRange) <= 1000;
            }

            if (selectedPrintRange === "3000") {
                printMatch =
                    Number(product.printRange) <= 3000;
            }

            if (selectedPrintRange === "5000") {
                printMatch =
                    Number(product.printRange) >= 3000;
            }

            return (
                typeMatch &&
                colorMatch &&
                printMatch
            );
        }
    );

    /*
     * 정렬
     */
    const sortedProducts = [
        ...filteredProducts,
    ].sort((a, b) => {

        if (sort === "low") {
            return a.price - b.price;
        }

        if (sort === "high") {
            return b.price - a.price;
        }

        // 추천순
        return a.id - b.id;
    });

    /*
     * 필터 초기화
     */
    const handleReset = () => {
        setSelectedTypes([]);
        setSelectedColors([]);
        setSelectedPrintRange("");
        setSort("recommended");

        setSearchParams({});
    };

    return (
        <main className="products-page">

            {/* 페이지 헤더 */}
            <section className="page-header">

                <p>RENTAL PRODUCTS</p>

                <h1>렌탈 상품</h1>

                <span>
                    사용 환경에 맞는 프린터와 복합기를
                    찾아보세요.
                </span>

            </section>

            {/* 상품 영역 */}
            <section className="products-container">

                {/* =========================
            필터
        ========================= */}

                <aside className="filter">

                    <div className="filter-header">

                        <h3>
                            상품 검색
                        </h3>

                        <button
                            onClick={handleReset}
                            className="reset-button"
                        >
                            초기화
                        </button>

                    </div>

                    {/* 제품 종류 */}
                    <div className="filter-group">

                        <strong>
                            제품 종류
                        </strong>

                        <label>

                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(
                                    "프린터"
                                )}
                                onChange={() =>
                                    handleTypeChange("프린터")
                                }
                            />

                            프린터

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(
                                    "복합기"
                                )}
                                onChange={() =>
                                    handleTypeChange("복합기")
                                }
                            />

                            복합기

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(
                                    "복사기"
                                )}
                                onChange={() =>
                                    handleTypeChange("복사기")
                                }
                            />

                            복사기

                        </label>

                    </div>

                    {/* 출력 방식 */}
                    <div className="filter-group">

                        <strong>
                            출력 방식
                        </strong>

                        <label>

                            <input
                                type="checkbox"
                                checked={selectedColors.includes(
                                    "컬러"
                                )}
                                onChange={() =>
                                    handleColorChange("컬러")
                                }
                            />

                            컬러

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                checked={selectedColors.includes(
                                    "흑백"
                                )}
                                onChange={() =>
                                    handleColorChange("흑백")
                                }
                            />

                            흑백

                        </label>

                    </div>

                    {/* 출력량 */}
                    <div className="filter-group">

                        <strong>
                            월 예상 출력량
                        </strong>

                        <label>

                            <input
                                type="radio"
                                name="printRange"
                                checked={
                                    selectedPrintRange === "1000"
                                }
                                onChange={() =>
                                    handlePrintRangeChange("1000")
                                }
                            />

                            1,000장 이하

                        </label>

                        <label>

                            <input
                                type="radio"
                                name="printRange"
                                checked={
                                    selectedPrintRange === "3000"
                                }
                                onChange={() =>
                                    handlePrintRangeChange("3000")
                                }
                            />

                            1,000 ~ 3,000장

                        </label>

                        <label>

                            <input
                                type="radio"
                                name="printRange"
                                checked={
                                    selectedPrintRange === "5000"
                                }
                                onChange={() =>
                                    handlePrintRangeChange("5000")
                                }
                            />

                            3,000장 이상

                        </label>

                    </div>

                </aside>

                {/* =========================
            상품
        ========================= */}

                <div className="products-content">

                    {/* 상품 상단 */}
                    <div className="products-top">

                        <span>
                            검색 결과{" "}
                            <strong>
                                {sortedProducts.length}
                            </strong>
                            개
                        </span>

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                        >

                            <option value="recommended">
                                추천순
                            </option>

                            <option value="low">
                                낮은 가격순
                            </option>

                            <option value="high">
                                높은 가격순
                            </option>

                        </select>

                    </div>

                    {/* 상품이 없는 경우 */}
                    {sortedProducts.length === 0 ? (

                        <div className="no-products">

                            <h3>
                                조건에 맞는 상품이 없습니다.
                            </h3>

                            <p>
                                검색 조건을 변경해보세요.
                            </p>

                            <button
                                onClick={handleReset}
                                className="reset-products-button"
                            >
                                검색 조건 초기화
                            </button>

                        </div>

                    ) : (

                        <div className="products-list">

                            {sortedProducts.map(
                                (product) => (

                                    <Link
                                        to={`/products/${product.id}`}
                                        className="product-card"
                                        key={product.id}
                                    >

                                        <div className="product-image">

                                            <img
                                                src={product.image}
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

                                            <p>
                                                {product.description}
                                            </p>

                                            <strong>
                                                월{" "}
                                                {product.price.toLocaleString()}
                                                원~
                                            </strong>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
}

export default Products;