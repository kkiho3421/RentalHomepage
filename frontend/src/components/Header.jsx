import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="header">

            <div className="header-inner">

                <Link to="/" className="logo">
                    EVERPS
                </Link>

                <nav className="nav">

                    <Link to="/">
                        홈
                    </Link>

                    <Link to="/products">
                        렌탈상품
                    </Link>

                    <Link to="/products">
                        렌탈상품 찾기
                    </Link>

                    <Link to="/cases">
                        설치사례
                    </Link>

                    <Link to="/customer">
                        고객센터
                    </Link>

                </nav>

                <Link
                    to="/consultation"
                    className="consult-button"
                >
                    무료 상담
                </Link>

            </div>

        </header>
    );
}

export default Header;