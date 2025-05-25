'use client';

import AdminLayout from '@/components/templates/admin-Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminCenterPage() {
    return (
        <ProtectedRoute role={1} redirectPath="/403">
            <AdminLayout />
        </ProtectedRoute>
    );
}
