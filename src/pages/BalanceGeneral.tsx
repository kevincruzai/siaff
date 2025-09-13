import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { Home, BarChart3, FileText, Calendar, Upload } from 'lucide-react';

interface BalanceItem {
  name: string;
  value: string;
  indicator?: 'green' | 'red' | 'blue';
}

interface BalanceSection {
  title: string;
  total: string;
  items: BalanceItem[];
  subsections?: BalanceSection[];
}

const BalanceGeneral: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Inicio', icon: Home },
    { label: 'Finanzas Corporativas', icon: BarChart3 },
    { label: 'Consolidado / Reporte del mes unidad', active: true, icon: FileText }
  ];

  const activosCorrientes: BalanceSection = {
    title: 'ACTIVOS CORRIENTES',
    total: '$24,549,694.62',
    items: [
      { name: 'Caja y bancos', value: '$32,767,139.48' },
      { name: 'Depósitos a plazo', value: '$320,000.00' },
      { name: 'Cuentas por cobrar', value: '$439,847.97', indicator: 'green' },
      { name: 'Clientes', value: '$300,206.99' },
      { name: 'Documentos por cobrar', value: '$139,790.38' },
      { name: 'Cuentas por cobrar partes relacionadas', value: '$159,000.00' },
      { name: 'Deudores varios', value: '$192,358.00' },
      { name: 'Inventarios', value: '$163,788.50' },
      { name: 'Mercaderías en camino', value: '$163,788.50' },
      { name: 'Crédito fiscal IVA', value: '$56,738.17' }
    ]
  };

  const activosNoCorrientes: BalanceSection = {
    title: 'ACTIVOS NO CORRIENTES',
    total: '$5,824,734.67',
    items: [
      { name: 'Bienes muebles netos', value: '$89,824.97', indicator: 'green' },
      { name: 'Bienes muebles', value: '$531,639.32' },
      { name: 'Menos depreciación', value: '$-441,814.35' }
    ]
  };

  const pageActions = (
    <>
      <button className="bg-gray-100 text-primary-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors">
        Unidad A
      </button>
      <button className="btn-secondary">
        <Calendar className="w-4 h-4" />
        Meses
      </button>
      <button className="btn-secondary">
        <Upload className="w-4 h-4" />
        Exportar
      </button>
      <button className="bg-gray-900 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
        ☰
      </button>
    </>
  );

  const BalanceSectionComponent: React.FC<{ section: BalanceSection; isSubsection?: boolean }> = ({ section, isSubsection = false }) => (
    <div className={`bg-white rounded-2xl border border-gray-200 relative overflow-hidden ${isSubsection ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-l-gray-800 my-6 mx-4' : 'shadow-lg'}`}>
      {!isSubsection && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      )}
      
      <div className="p-6">
        <div className={`font-bold mb-6 ${isSubsection ? 'text-base text-primary-600 uppercase tracking-wide' : 'text-lg text-gray-900'} pb-4 border-b-2 border-gray-100`}>
          {section.title}
        </div>
        
        <div className="text-right text-2xl font-bold text-gray-900 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-l-primary-500">
          {section.total}
        </div>

        {section.items.map((item, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:mx-[-24px] hover:px-6 transition-all duration-200 hover:translate-x-1 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {item.indicator && (
                <div className={`w-2.5 h-2.5 rounded-full ${
                  item.indicator === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/30' :
                  item.indicator === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/30' :
                  'bg-blue-500 shadow-lg shadow-blue-500/30'
                }`}></div>
              )}
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <span className="text-gray-900 font-bold">{item.value}</span>
          </div>
        ))}

        {section.subsections && section.subsections.map((subsection, index) => (
          <BalanceSectionComponent key={index} section={subsection} isSubsection={true} />
        ))}
      </div>

      {!isSubsection && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 font-bold text-lg">
          <div className="flex justify-between items-center">
            <span>TOTAL {section.title}</span>
            <span>{section.total}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 shadow-sm">
      <div className="px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <PageHeader 
          title="FINANZAS CORPORATIVAS"
          subtitle="TreeCloud Technologies - El Salvador"
          actions={pageActions}
        />
      </div>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BalanceSectionComponent section={activosCorrientes} />
          <BalanceSectionComponent section={activosNoCorrientes} />
        </div>
      </div>
    </div>
  );
};

export default BalanceGeneral;