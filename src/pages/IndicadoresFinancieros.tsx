import React, { useState } from 'react';
import { TrendingUp, Home, ChevronRight, Calendar, Filter } from 'lucide-react';

const IndicadoresFinancieros: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('Enero 2019');
  const [fechaFin, setFechaFin] = useState('Junio 2019');
  const [year, setYear] = useState('2019');
  const [month, setMonth] = useState('Todos los meses');

  // Datos de indicadores financieros basados en la imagen
  const indicadores = [
    // Prueba Ácida
    {
      categoria: 'Prueba Ácida',
      subcategoria: '',
      indicador: 'Prueba Ácida',
      octubre: '2.9761',
      noviembre: '2.9761',
      diciembre: '2.9761',
      enero: '2.9761',
      febrero: '2.9761',
      marzo: '2.9761',
      color: 'bg-blue-50'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Prueba Ácida sin Relacionadas',
      octubre: '2.1186',
      noviembre: '2.1186',
      diciembre: '2.1186',
      enero: '2.1186',
      febrero: '2.1186',
      marzo: '2.1186',
      color: 'bg-white'
    },
    // Liquidez
    {
      categoria: 'Liquidez',
      subcategoria: '',
      indicador: 'Solvencia Financiera',
      octubre: '2.2525',
      noviembre: '2.2525',
      diciembre: '2.2525',
      enero: '2.2525',
      febrero: '2.2525',
      marzo: '2.2525',
      color: 'bg-green-50'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Solvencia Financiera sin Relacionadas',
      octubre: '26273.0600',
      noviembre: '26273.0600',
      diciembre: '26273.0600',
      enero: '26273.0600',
      febrero: '26273.0600',
      marzo: '26273.0600',
      color: 'bg-white'
    },
    // EBITDA
    {
      categoria: 'EBITDA',
      subcategoria: '',
      indicador: 'EBITDA',
      octubre: '0.4420',
      noviembre: '0.4420',
      diciembre: '0.4420',
      enero: '0.4420',
      febrero: '0.4420',
      marzo: '0.4420',
      color: 'bg-yellow-50'
    },
    // Rotación de Inventario
    {
      categoria: 'Rotación de Inventario',
      subcategoria: '',
      indicador: 'Rotación de Inventario',
      octubre: '189.0864',
      noviembre: '189.0864',
      diciembre: '189.0864',
      enero: '189.0864',
      febrero: '189.0864',
      marzo: '189.0864',
      color: 'bg-purple-50'
    },
    // Periodo de Cobro
    {
      categoria: 'Periodo de Cobro',
      subcategoria: '',
      indicador: 'Periodo de Cobro',
      octubre: '145.2571',
      noviembre: '145.2571',
      diciembre: '145.2571',
      enero: '145.2571',
      febrero: '145.2571',
      marzo: '145.2571',
      color: 'bg-orange-50'
    },
    // Periodo de Pago
    {
      categoria: 'Periodo de Pago',
      subcategoria: '',
      indicador: 'Periodo de Pago',
      octubre: '0.1639',
      noviembre: '0.1639',
      diciembre: '0.1639',
      enero: '0.1639',
      febrero: '0.1639',
      marzo: '0.1639',
      color: 'bg-red-50'
    },
    // Actividad
    {
      categoria: 'Actividad',
      subcategoria: '',
      indicador: 'Rotación de Cobro',
      octubre: '0.2194',
      noviembre: '0.2194',
      diciembre: '0.2194',
      enero: '0.2194',
      febrero: '0.2194',
      marzo: '0.2194',
      color: 'bg-indigo-50'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Rotación de Pago',
      octubre: '69.9714',
      noviembre: '69.9714',
      diciembre: '69.9714',
      enero: '69.9714',
      febrero: '69.9714',
      marzo: '69.9714',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Tasa de Inventario',
      octubre: '1.9831',
      noviembre: '1.9831',
      diciembre: '1.9831',
      enero: '1.9831',
      febrero: '1.9831',
      marzo: '1.9831',
      color: 'bg-white'
    },
    // Endeudamiento
    {
      categoria: 'Endeudamiento',
      subcategoria: '',
      indicador: 'Factor Deuda sin Relacionadas',
      octubre: '0.5600',
      noviembre: '0.5600',
      diciembre: '0.5600',
      enero: '0.5600',
      febrero: '0.5600',
      marzo: '0.5600',
      color: 'bg-teal-50'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Deuda Financiera',
      octubre: '2.0183',
      noviembre: '2.0183',
      diciembre: '2.0183',
      enero: '2.0183',
      febrero: '2.0183',
      marzo: '2.0183',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Endeudamiento sin Relacionadas',
      octubre: '0.5205',
      noviembre: '0.5205',
      diciembre: '0.5205',
      enero: '0.5205',
      febrero: '0.5205',
      marzo: '0.5205',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Cobertura',
      octubre: '0.5230',
      noviembre: '0.5230',
      diciembre: '0.5230',
      enero: '0.5230',
      febrero: '0.5230',
      marzo: '0.5230',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Factor Deuda',
      octubre: '1.9996',
      noviembre: '1.9996',
      diciembre: '1.9996',
      enero: '1.9996',
      febrero: '1.9996',
      marzo: '1.9996',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Retorno de la Inversión',
      octubre: '56.9162',
      noviembre: '56.9162',
      diciembre: '56.9162',
      enero: '56.9162',
      febrero: '56.9162',
      marzo: '56.9162',
      color: 'bg-white'
    },
    // Rentabilidad
    {
      categoria: 'Rentabilidad',
      subcategoria: '',
      indicador: 'Rentabilidad de Activos',
      octubre: '0.0110',
      noviembre: '0.0110',
      diciembre: '0.0110',
      enero: '0.0110',
      febrero: '0.0110',
      marzo: '0.0110',
      color: 'bg-green-100'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Patrimonio Neto Tangible',
      octubre: '7565200.0000',
      noviembre: '7565200.0000',
      diciembre: '7565200.0000',
      enero: '7565200.0000',
      febrero: '7565200.0000',
      marzo: '7565200.0000',
      color: 'bg-white'
    },
    {
      categoria: '',
      subcategoria: '',
      indicador: 'Margen de Contribución',
      octubre: '0.7750',
      noviembre: '0.7750',
      diciembre: '0.7750',
      enero: '0.7750',
      febrero: '0.7750',
      marzo: '0.7750',
      color: 'bg-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>Inicio</span>
          <ChevronRight className="w-4 h-4" />
          <span>Finanzas Corporativas</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Indicadores Financieros</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">FINANZAS CORPORATIVAS</h1>
          </div>
          <h2 className="text-lg text-gray-700 ml-11">Indicadores Financieros</h2>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="Enero 2019">Enero 2019</option>
                <option value="Febrero 2019">Febrero 2019</option>
                <option value="Marzo 2019">Marzo 2019</option>
              </select>
              <span className="text-gray-500">-</span>
              <select 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="Junio 2019">Junio 2019</option>
                <option value="Julio 2019">Julio 2019</option>
                <option value="Agosto 2019">Agosto 2019</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por mes, usuario o fecha..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Year Selector */}
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2020">2020</option>
            </select>

            {/* Month Selector */}
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[140px]"
            >
              <option value="Todos los meses">Todos los meses</option>
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
            </select>

            {/* Filters Button */}
            <button className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Resumen de Indicadores */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de Indicadores</h3>
            <div className="text-center text-sm text-gray-600 mt-2">
              DE OCTUBRE 2018 A MARZO 2019
            </div>
          </div>

          {/* Tabla de Indicadores */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800 border-r border-gray-300 min-w-[150px]">CATEGORÍA</th>
                  <th className="text-left p-3 font-semibold text-gray-800 border-r border-gray-300 min-w-[200px]">INDICADOR</th>
                  <th className="text-center p-3 font-semibold text-gray-800 border-r border-gray-300 bg-blue-50 min-w-[100px]">
                    <div className="font-bold">2018</div>
                    <div className="text-xs">OCTUBRE</div>
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-800 border-r border-gray-300 bg-blue-50 min-w-[100px]">
                    <div className="text-xs">NOVIEMBRE</div>
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-800 border-r border-gray-300 bg-blue-50 min-w-[100px]">
                    <div className="text-xs">DICIEMBRE</div>
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-800 border-r border-gray-300 bg-blue-100 min-w-[100px]">
                    <div className="font-bold">2019</div>
                    <div className="text-xs">ENERO</div>
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-800 border-r border-gray-300 bg-blue-100 min-w-[100px]">
                    <div className="text-xs">FEBRERO</div>
                  </th>
                  <th className="text-center p-3 font-semibold text-gray-800 bg-blue-100 min-w-[100px]">
                    <div className="text-xs">MARZO</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {indicadores.map((indicador, index) => (
                  <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${indicador.color}`}>
                    <td className="p-3 font-semibold text-gray-900 border-r border-gray-200 align-top">
                      {indicador.categoria}
                    </td>
                    <td className="p-3 text-gray-800 border-r border-gray-200">
                      {indicador.indicador}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm border-r border-gray-200">
                      {indicador.octubre}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm border-r border-gray-200">
                      {indicador.noviembre}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm border-r border-gray-200">
                      {indicador.diciembre}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm border-r border-gray-200">
                      {indicador.enero}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm border-r border-gray-200">
                      {indicador.febrero}
                    </td>
                    <td className="p-3 text-center text-gray-700 font-mono text-sm">
                      {indicador.marzo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-400 mt-6">
          SIAFF © 2019
        </div>
      </div>
    </div>
  );
};

export default IndicadoresFinancieros;