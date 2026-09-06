import { Outlet } from "react-router-dom";

import AdminHeader from "../components/AdminHeader";

import "../styles/admin.css";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminHeader />

            <div className="admin-layout-content">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;