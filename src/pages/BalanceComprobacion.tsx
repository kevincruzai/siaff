import React, { useState } from 'react';
import { Home, BarChart3, Download, Eye, ChevronDown, Filter, Search, FileText } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import DateRangePicker from '@/components/DateRangePicker';

interface BalanceData {
  id: string;
  mes: string;
  año: number;
  fechaCarga: string;
  usuario: string;
  estado: 'procesado' | 'pendiente' | 'error';
}

const BalanceComprobacion: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('2019');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startMonth: 'Enero',
    startYear: '2019',
    endMonth: 'Junio',
    endYear: '2019'
  });
  const itemsPerPage = 10;

  // Datos de muestra basados en la imagen
  const balanceData: BalanceData[] = [
    {
      id: '1',
      mes: 'Junio',
      año: 2019,
      fechaCarga: '29/05/2018',
      usuario: 'Ana Mejía',
      estado: 'procesado'
    },
    {
      id: '2', 
      mes: 'Mayo',
      año: 2019,
      fechaCarga: '31/12/2018',
      usuario: 'Jane Son',
      estado: 'procesado'
    },
    {
      id: '3',
      mes: 'Abril',
      año: 2019,
      fechaCarga: '02/01/2019',
      usuario: 'Marion Brendon',
      estado: 'procesado'
    },
    {
      id: '4',
      mes: 'Marzo',
      año: 2019,
      fechaCarga: '16/08/2019',
      usuario: 'Jimmy Park',
      estado: 'procesado'
    },
    {
      id: '5',
      mes: 'Febrero',
      año: 2019,
      fechaCarga: '30/11/2019',
      usuario: 'Juan Perez',
      estado: 'procesado'
    },
    {
      id: '6',
      mes: 'Enero',
      año: 2019,
      fechaCarga: '15/01/2020',
      usuario: 'Luis Martinez',
      estado: 'procesado'
    }
  ];

  const breadcrumbItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard' },
    { icon: BarChart3, label: 'Finanzas Corporativas', href: '/dashboard' },
    { icon: FileText, label: 'Balance de Comprobación' }
  ];

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const años = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  // Filtrar datos
  const filteredData = balanceData.filter(item => {
    const matchesSearch = 
      item.mes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fechaCarga.includes(searchTerm);
    
    const matchesPeriod = selectedPeriod === '' || item.año.toString() === selectedPeriod;
    const matchesMonth = selectedMonth === '' || item.mes === selectedMonth;
    
    return matchesSearch && matchesPeriod && matchesMonth;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = (id: string) => {
    console.log('Descargando balance:', id);
    // Implementar lógica de descarga
  };

  const handleViewDetails = (id: string) => {
    console.log('Ver detalles:', id);
    // Implementar navegación a detalles
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              FINANZAS CORPORATIVAS
            </h1>
            <p className="text-sm text-gray-600 mt-1">Balance de Comprobación</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Date Range Picker */}
          <div className="flex-shrink-0">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full xl:w-auto"
            />
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por mes, usuario o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex gap-3 flex-shrink-0">
            {/* Year filter */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los años</option>
                {años.map(año => (
                  <option key={año} value={año}>{año}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Month filter */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los meses</option>
                {meses.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Filter button */}
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">HISTORIAL DE BALANCE DE COMPROBACIÓN</h2>
          <p className="text-sm text-gray-600 mt-1">
            DE {dateRange.startMonth.toUpperCase()} {dateRange.startYear} HASTA {dateRange.endMonth.toUpperCase()} {dateRange.endYear}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-6 font-medium text-gray-700">MES</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">AÑO</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">FECHA DE CARGA</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">USUARIO</th>
                <th className="text-center py-3 px-6 font-medium text-gray-700">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{item.mes}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{item.año}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{item.fechaCarga}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{item.usuario}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {/* Status indicator */}
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      
                      {/* Download button */}
                      <button
                        onClick={() => handleDownload(item.id)}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      {/* View details button */}
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} registros
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No se encontraron registros</p>
            <p className="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceComprobacion;