"use client";
import React, { useState } from 'react';
import EditorLayout from "@/modules/editor/editor";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CreateArticlePage() {

    return (
        <ProtectedRoute role={0} redirectPath="/400">
            <EditorLayout />
        </ProtectedRoute>
    );
}
