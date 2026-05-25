import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { TemplatesListPage } from './admin/TemplatesListPage';
import { TemplateFormPage } from './admin/TemplateFormPage';

export const AdminPage: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.plano !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Acesso Restrito</h2>
          <p className="text-zinc-500 text-xs">
            Area exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="templates" element={<TemplatesListPage />} />
      <Route path="templates/new" element={<TemplateFormPage />} />
      <Route path="templates/:id/edit" element={<TemplateFormPage />} />
      <Route path="" element={<Navigate to="templates" replace />} />
      <Route path="*" element={<Navigate to="templates" replace />} />
    </Routes>
  );
};
