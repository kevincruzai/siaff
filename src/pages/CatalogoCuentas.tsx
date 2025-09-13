import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/components/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { Home, BarChart3, BookOpen, Plus, Search, Filter, Download, Edit, Trash2, Eye, Settings } from 'lucide-react';

interface CuentaContable {
  codigo: string;
  nombre: string;
  tipo: 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingreso' | 'Gasto';
  nivel: number;
  padre?: string;
  estado: 'Activa' | 'Inactiva';
  descripcion?: string;
}

const CatalogoCuentas: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Todos');

  // Datos de ejemplo del catálogo de cuentas
  const cuentas: CuentaContable[] = [
    // ACTIVOS
    { codigo: '1', nombre: 'ACTIVOS', tipo: 'Activo', nivel: 1, estado: 'Activa' },
    { codigo: '11', nombre: 'ACTIVOS CORRIENTES', tipo: 'Activo', nivel: 2, padre: '1', estado: 'Activa' },
    { codigo: '1101', nombre: 'Efectivo y Equivalentes de Efectivo', tipo: 'Activo', nivel: 3, padre: '11', estado: 'Activa' },
    { codigo: '110101', nombre: 'Caja General', tipo: 'Activo', nivel: 4, padre: '1101', estado: 'Activa' },
    { codigo: '110102', nombre: 'Caja Chica', tipo: 'Activo', nivel: 4, padre: '1101', estado: 'Activa' },
    { codigo: '110103', nombre: 'Bancos', tipo: 'Activo', nivel: 4, padre: '1101', estado: 'Activa' },
    { codigo: '1102', nombre: 'Cuentas por Cobrar', tipo: 'Activo', nivel: 3, padre: '11', estado: 'Activa' },
    { codigo: '110201', nombre: 'Clientes Nacionales', tipo: 'Activo', nivel: 4, padre: '1102', estado: 'Activa' },
    { codigo: '110202', nombre: 'Clientes Extranjeros', tipo: 'Activo', nivel: 4, padre: '1102', estado: 'Activa' },
    
    // PASIVOS
    { codigo: '2', nombre: 'PASIVOS', tipo: 'Pasivo', nivel: 1, estado: 'Activa' },
    { codigo: '21', nombre: 'PASIVOS CORRIENTES', tipo: 'Pasivo', nivel: 2, padre: '2', estado: 'Activa' },
    { codigo: '2101', nombre: 'Cuentas por Pagar', tipo: 'Pasivo', nivel: 3, padre: '21', estado: 'Activa' },
    { codigo: '210101', nombre: 'Proveedores Locales', tipo: 'Pasivo', nivel: 4, padre: '2101', estado: 'Activa' },
    { codigo: '210102', nombre: 'Proveedores del Exterior', tipo: 'Pasivo', nivel: 4, padre: '2101', estado: 'Activa' },
    
    // PATRIMONIO
    { codigo: '3', nombre: 'PATRIMONIO', tipo: 'Patrimonio', nivel: 1, estado: 'Activa' },
    { codigo: '31', nombre: 'CAPITAL', tipo: 'Patrimonio', nivel: 2, padre: '3', estado: 'Activa' },
    { codigo: '3101', nombre: 'Capital Social', tipo: 'Patrimonio', nivel: 3, padre: '31', estado: 'Activa' },
    
    // INGRESOS
    { codigo: '4', nombre: 'INGRESOS', tipo: 'Ingreso', nivel: 1, estado: 'Activa' },
    { codigo: '41', nombre: 'INGRESOS OPERACIONALES', tipo: 'Ingreso', nivel: 2, padre: '4', estado: 'Activa' },
    { codigo: '4101', nombre: 'Ventas', tipo: 'Ingreso', nivel: 3, padre: '41', estado: 'Activa' },
    
    // GASTOS
    { codigo: '5', nombre: 'GASTOS', tipo: 'Gasto', nivel: 1, estado: 'Activa' },
    { codigo: '51', nombre: 'GASTOS OPERACIONALES', tipo: 'Gasto', nivel: 2, padre: '5', estado: 'Activa' },
    { codigo: '5101', nombre: 'Gastos de Administración', tipo: 'Gasto', nivel: 3, padre: '51', estado: 'Activa' },
  ];

  const breadcrumbItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard' },
    { icon: BarChart3, label: 'Finanzas Corporativas', href: '/dashboard' },
    { icon: BookOpen, label: 'Catálogo de Cuentas' }
  ];

  const pageActions = (
    <>
      <button className="btn-secondary">
        <Filter className="w-4 h-4" />
        Filtrar
      </button>
      <button className="btn-secondary">
        <Download className="w-4 h-4" />
        Exportar
      </button>
      <button 
        onClick={() => navigate('/dashboard/parametrizacion-catalogo')}
        className="btn-secondary"
      >
        <Settings className="w-4 h-4" />
        Parametrizar
      </button>
      <button className="btn-primary">
        <Plus className="w-4 h-4" />
        Nueva Cuenta
      </button>
    </>
  );

  const filteredCuentas = cuentas.filter(cuenta => {
    const matchesSearch = cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'Todos' || cuenta.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIndentation = (nivel: number) => {
    return `${(nivel - 1) * 24}px`;
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Pasivo': return 'bg-red-100 text-red-800';
      case 'Patrimonio': return 'bg-blue-100 text-blue-800';
      case 'Ingreso': return 'bg-purple-100 text-purple-800';
      case 'Gasto': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 shadow-sm">
      <div className="px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <PageHeader 
          title="CATÁLOGO DE CUENTAS"
          subtitle="TreeCloud Technologies - El Salvador"
          actions={pageActions}
        />
      </div>

      <div className="px-8 pb-8">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por código o nombre de cuenta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none"
              >
                <option value="Todos">Todos los tipos</option>
                <option value="Activo">Activos</option>
                <option value="Pasivo">Pasivos</option>
                <option value="Patrimonio">Patrimonio</option>
                <option value="Ingreso">Ingresos</option>
                <option value="Gasto">Gastos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla del catálogo */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre de la Cuenta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCuentas.map((cuenta) => (
                  <tr key={cuenta.codigo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                      {cuenta.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div 
                        style={{ paddingLeft: getIndentation(cuenta.nivel) }}
                        className="flex items-center"
                      >
                        <span className={`font-${cuenta.nivel <= 2 ? 'bold' : 'medium'} ${
                          cuenta.nivel === 1 ? 'text-lg text-gray-900' : 
                          cuenta.nivel === 2 ? 'text-base text-gray-800' : 
                          'text-sm text-gray-700'
                        }`}>
                          {cuenta.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(cuenta.tipo)}`}>
                        {cuenta.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cuenta.estado === 'Activa' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cuenta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        {cuenta.nivel > 1 && (
                          <button className="text-red-600 hover:text-red-800 p-1 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto'].map((tipo) => {
            const count = cuentas.filter(c => c.tipo === tipo).length;
            return (
              <div key={tipo} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{tipo}s</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getTipoColor(tipo).replace('bg-', '').replace('100', '500').split(' ')[0]}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CatalogoCuentas;