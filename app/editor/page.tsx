"use client";
import React from 'react';
import EditorLayout from "@/modules/editor/editor";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSearchParams } from 'next/navigation';

export default function CreateArticlePage() {
    const searchParams = useSearchParams();
    const articleId = searchParams.get('id');

    return (
        <ProtectedRoute role={0} redirectPath="/400">
            <EditorLayout articleId={articleId} />
        </ProtectedRoute>
    );
}
