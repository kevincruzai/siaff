import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BalanceGeneral from '@/pages/BalanceGeneral';
import CatalogoCuentas from '@/pages/CatalogoCuentas';
import ParametrizacionCatalogo from '@/pages/ParametrizacionCatalogo';
import BalanceComprobacion from '@/pages/BalanceComprobacion';
import IndicadoresFinancieros from '@/pages/IndicadoresFinancieros';
import Accionistas from '@/pages/Accionistas';
import FinancialDashboard from '@/pages/FinancialDashboard';

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="financial-dashboard" replace />} />
      <Route path="financial-dashboard" element={<FinancialDashboard />} />
      <Route path="balance-general" element={<BalanceGeneral />} />
      <Route path="catalogo-cuentas" element={<CatalogoCuentas />} />
      <Route path="parametrizacion-catalogo" element={<ParametrizacionCatalogo />} />
      <Route path="balance-comprobacion" element={<BalanceComprobacion />} />
      <Route path="indicadores-financieros" element={<IndicadoresFinancieros />} />
      <Route path="accionistas" element={<Accionistas />} />
      <Route path="*" element={<Navigate to="financial-dashboard" replace />} />
    </Routes>
  );
};

export default Dashboard;