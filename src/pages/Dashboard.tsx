import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import BalanceGeneral from '@/pages/BalanceGeneral';
import CatalogoCuentas from '@/pages/CatalogoCuentas';
import ParametrizacionCatalogo from '@/pages/ParametrizacionCatalogo';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<Navigate to="balance-general" replace />} />
        <Route path="balance-general" element={<BalanceGeneral />} />
        <Route path="catalogo-cuentas" element={<CatalogoCuentas />} />
        <Route path="parametrizacion-catalogo" element={<ParametrizacionCatalogo />} />
        <Route path="*" element={<Navigate to="balance-general" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default Dashboard;