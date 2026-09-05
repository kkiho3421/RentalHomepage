import { useEffect, useState } from "react";
import { getProductImageUrl } from "../utils/imageUrl";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState("");

    const [newProduct, setNewProduct] = useState({
        category: "",
        type: "",
        color: "",
        paper: "",
        monthlyPrint: "",
        printRange: "",
        name: "",
        description: "",
        price: "",
        image: "",
    });

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
                console.error(error);

                setError(
                    "상품 목록을 불러오는 중 오류가 발생했습니다."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [editingProduct?.id]);

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;

        setNewProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = newProduct.image;

            if (selectedImageFile) {
                imageUrl = await uploadProductImage();
            }
            
            const response = await fetch(
                "http://localhost:8080/api/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...newProduct,
                        image: imageUrl,
                        price: Number(newProduct.price),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "상품 등록에 실패했습니다."
                );
            }

            const savedProduct =
                await response.json();

            setProducts((prev) => [
                ...prev,
                savedProduct,
            ]);

            setNewProduct({
                category: "",
                type: "",
                color: "",
                paper: "",
                monthlyPrint: "",
                printRange: "",
                name: "",
                description: "",
                price: "",
                image: "",
            });

            setSelectedImageFile(null);
            setImagePreview("");

            setShowAddForm(false);

        } catch (error) {
            console.error(error);

            alert(
                "상품 등록 중 오류가 발생했습니다."
            );
        }
    };

    const handleEditProductChange = (e) => {
        const { name, value } = e.target;

        setEditingProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = editingProduct.image;

            if (editImageFile) {
                const formData = new FormData();

                formData.append(
                    "image",
                    editImageFile
                );

                const imageResponse = await fetch(
                    "http://localhost:8080/api/uploads/product-image",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!imageResponse.ok) {
                    throw new Error(
                        "이미지 업로드에 실패했습니다."
                    );
                }

                const imageData =
                    await imageResponse.json();

                imageUrl = imageData.imageUrl;
            }

            const response = await fetch(
                `http://localhost:8080/api/products/${editingProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...editingProduct,
                        image: imageUrl,
                        price: Number(editingProduct.price),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "상품 수정에 실패했습니다."
                );
            }

            const updatedProduct =
                await response.json();

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === updatedProduct.id
                        ? updatedProduct
                        : product
                )
            );

            setEditingProduct(null);
            setEditImageFile(null);
            setEditImagePreview("");

        } catch (error) {
            console.error(error);

            alert(
                "상품 수정 중 오류가 발생했습니다."
            );
        }
    };

    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(
            `"${product.name}" 상품을 정말 삭제하시겠습니까?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/products/${product.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "상품 삭제에 실패했습니다."
                );
            }

            setProducts((prev) =>
                prev.filter(
                    (item) => item.id !== product.id
                )
            );

        } catch (error) {
            console.error(error);

            alert(
                "상품 삭제 중 오류가 발생했습니다."
            );
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택할 수 있습니다.");
            return;
        }

        setSelectedImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };


    const uploadProductImage = async () => {
        if (!selectedImageFile) {
            return null;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();

            formData.append(
                "image",
                selectedImageFile
            );

            const response = await fetch(
                "http://localhost:8080/api/uploads/product-image",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(
                    "이미지 업로드에 실패했습니다."
                );
            }

            const data = await response.json();

            return data.imageUrl;

        } finally {
            setUploadingImage(false);
        }
    };
    
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택할 수 있습니다.");
            return;
        }

        setEditImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setEditImagePreview(previewUrl);
    };

    if (loading) {
        return (
            <main className="admin-products-page">
                <p>상품 목록을 불러오는 중입니다.</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-products-page">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="admin-products-page">

            <section className="admin-products-header">
                <p>ADMIN</p>

                <h1>상품 관리</h1>

                <span>
                    렌탈 상품을 등록하고 관리할 수 있습니다.
                </span>
            </section>

            <section className="admin-products-container">

                <div className="admin-products-top">
                    <div>
                        등록 상품

                        <strong>
                            {products.length}
                        </strong>

                        개
                    </div>

                    <button
                        type="button"
                        className="admin-product-add-button"
                        onClick={() => {
                            setEditingProduct(null);
                            setShowAddForm(true);
                        }}
                    >
                        + 상품 등록
                    </button>
                </div>

                {showAddForm && (
                    <form
                        className="admin-product-form"
                        onSubmit={handleAddProduct}
                    >
                        <h2>상품 등록</h2>

                        <div className="admin-product-form-grid">

                            <div>
                                <label>상품명</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleNewProductChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>카테고리</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={newProduct.category}
                                    onChange={handleNewProductChange}
                                />
                            </div>

                            <div>
                                <label>제품 종류</label>
                                <select
                                    name="type"
                                    value={newProduct.type}
                                    onChange={handleNewProductChange}
                                    required
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

                            <div>
                                <label>출력 방식</label>
                                <select
                                    name="color"
                                    value={newProduct.color}
                                    onChange={handleNewProductChange}
                                    required
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

                            <div>
                                <label>용지 크기</label>
                                <input
                                    type="text"
                                    name="paper"
                                    value={newProduct.paper}
                                    onChange={handleNewProductChange}
                                    placeholder="예: A3"
                                />
                            </div>

                            <div>
                                <label>월 출력량</label>
                                <input
                                    type="text"
                                    name="monthlyPrint"
                                    value={newProduct.monthlyPrint}
                                    onChange={handleNewProductChange}
                                    placeholder="예: 3,000장"
                                />
                            </div>

                            <div>
                                <label>출력량 구간</label>
                                <select
                                    name="printRange"
                                    value={newProduct.printRange}
                                    onChange={handleNewProductChange}
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

                            <div>
                                <label>월 렌탈료</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleNewProductChange}
                                    required
                                />
                            </div>

                            <div className="admin-product-form-full">
                                <label>상품 이미지</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />

                                {imagePreview && (
                                    <div className="admin-product-preview">
                                        <img
                                            src={imagePreview}
                                            alt="상품 이미지 미리보기"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="admin-product-form-full">
                                <label>상품 설명</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleNewProductChange}
                                    rows="5"
                                />
                            </div>

                        </div>

                        <div className="admin-product-form-buttons">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddForm(false)
                                }
                            >
                                취소
                            </button>

                            <button
                                type="submit"
                                disabled={uploadingImage}
                            >
                                {uploadingImage
                                    ? "이미지 업로드 중..."
                                    : "등록"}
                            </button>
                        </div>
                    </form>
                )}

                {editingProduct && (
                    <form
                        className="admin-product-form"
                        onSubmit={handleUpdateProduct}
                    >
                        <h2>상품 수정</h2>

                        <div className="admin-product-form-grid">

                            <div>
                                <label>상품명</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingProduct.name}
                                    onChange={handleEditProductChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>카테고리</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={editingProduct.category}
                                    onChange={handleEditProductChange}
                                />
                            </div>

                            <div>
                                <label>제품 종류</label>
                                <select
                                    name="type"
                                    value={editingProduct.type}
                                    onChange={handleEditProductChange}
                                    required
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="프린터">프린터</option>
                                    <option value="복합기">복합기</option>
                                    <option value="복사기">복사기</option>
                                </select>
                            </div>

                            <div>
                                <label>출력 방식</label>
                                <select
                                    name="color"
                                    value={editingProduct.color}
                                    onChange={handleEditProductChange}
                                    required
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="컬러">컬러</option>
                                    <option value="흑백">흑백</option>
                                </select>
                            </div>

                            <div>
                                <label>용지 크기</label>
                                <input
                                    type="text"
                                    name="paper"
                                    value={editingProduct.paper ?? ""}
                                    onChange={handleEditProductChange}
                                />
                            </div>

                            <div>
                                <label>월 출력량</label>
                                <input
                                    type="text"
                                    name="monthlyPrint"
                                    value={editingProduct.monthlyPrint ?? ""}
                                    onChange={handleEditProductChange}
                                />
                            </div>

                            <div>
                                <label>출력량 구간</label>

                                <select
                                    name="printRange"
                                    value={editingProduct.printRange ?? ""}
                                    onChange={handleEditProductChange}
                                >
                                    <option value="">선택해주세요</option>

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

                            <div>
                                <label>월 렌탈료</label>

                                <input
                                    type="number"
                                    name="price"
                                    value={editingProduct.price}
                                    onChange={handleEditProductChange}
                                    required
                                />
                            </div>

                            <div className="admin-product-form-full">
                                <label>상품 이미지</label>

                                <div className="admin-product-preview">
                                    <img
                                        src={
                                            editImagePreview
                                                ? editImagePreview
                                                : getProductImageUrl(
                                                    editingProduct.image
                                                )
                                        }
                                        alt="상품 이미지 미리보기"
                                    />
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                            </div>

                            <div className="admin-product-form-full">
                                <label>상품 설명</label>

                                <textarea
                                    name="description"
                                    value={editingProduct.description ?? ""}
                                    onChange={handleEditProductChange}
                                    rows="5"
                                />
                            </div>

                        </div>

                        <div className="admin-product-form-buttons">

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingProduct(null);
                                    setEditImageFile(null);
                                    setEditImagePreview("");
                                }}
                            >
                                취소
                            </button>

                            <button type="submit">
                                수정 완료
                            </button>

                        </div>
                    </form>
                )}

                {products.length === 0 ? (

                    <div className="admin-empty">
                        등록된 상품이 없습니다.
                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-products-table">

                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>이미지</th>
                                    <th>상품명</th>
                                    <th>종류</th>
                                    <th>출력 방식</th>
                                    <th>월 렌탈료</th>
                                    <th>관리</th>
                                </tr>
                            </thead>

                            <tbody>

                                {products.map((product) => (

                                    <tr key={product.id}>

                                        <td>
                                            {product.id}
                                        </td>

                                        <td>
                                            <img
                                                src={getProductImageUrl(product.image)}
                                                alt={product.name}
                                                className="admin-product-image"
                                            />
                                        </td>

                                        <td>
                                            {product.name}
                                        </td>

                                        <td>
                                            {product.type}
                                        </td>

                                        <td>
                                            {product.color}
                                        </td>

                                        <td>
                                            {product.price.toLocaleString()}원
                                        </td>

                                        <td>
                                            <div className="admin-product-actions">

                                                <button
                                                    type="button"
                                                    className="admin-product-edit-button"
                                                    onClick={() => {
                                                        setShowAddForm(false);

                                                        setEditImageFile(null);
                                                        setEditImagePreview("");

                                                        setEditingProduct(product);
                                                    }}
                                                >
                                                    수정
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-product-delete-button"
                                                    onClick={() =>
                                                        handleDeleteProduct(product)
                                                    }
                                                >
                                                    삭제
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}

export default AdminProducts;