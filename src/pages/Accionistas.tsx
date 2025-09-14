import React, { useState } from 'react';
import { Users, Plus, Settings, Check } from 'lucide-react';

const Accionistas: React.FC = () => {
  // Estado para controlar los toggles de cada accionista
  const [toggleStates, setToggleStates] = useState<{[key: string]: boolean}>({
    michael: true,
    simone: true,
    tony: false,
    tarja: true,
    tuomo: true,
    yngwie: false
  });

  // Datos de accionistas basados en la imagen
  const accionistas = [
    {
      id: 'michael',
      nombre: 'Michael',
      apellido: 'Kiske',
      numAcciones: '1,000',
      valorNominal: '$10.00',
      total: '$100,000.00',
      activo: true
    },
    {
      id: 'simone',
      nombre: 'Simone',
      apellido: 'Simons',
      numAcciones: '35,500',
      valorNominal: '$20.00',
      total: '$205.00',
      activo: true
    },
    {
      id: 'tony',
      nombre: 'Tony',
      apellido: 'Iommi',
      numAcciones: '200',
      valorNominal: '$500.00',
      total: '$500.00',
      activo: false
    },
    {
      id: 'tarja',
      nombre: 'Tarja',
      apellido: 'Turunen',
      numAcciones: '3250',
      valorNominal: '$25.00',
      total: '$1,000.00',
      activo: true
    },
    {
      id: 'tuomo',
      nombre: 'Tuomo',
      apellido: 'Koljonen',
      numAcciones: '3214',
      valorNominal: '$6.50',
      total: '$500.00',
      activo: true
    },
    {
      id: 'yngwie',
      nombre: 'Yngwie',
      apellido: 'Malmsteen',
      numAcciones: '455',
      valorNominal: '$8.00',
      total: '$4,000.00',
      activo: false
    }
  ];

  const handleToggle = (id: string) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar con métricas */}
      <div className="bg-blue-900 text-white px-6 py-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>$1.75</span>
              <span className="text-green-400">▲0.30%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>$350.00</span>
              <span className="text-green-400">▲4.35%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>1.121</span>
              <span className="text-green-400">▼0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header de la sección */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 uppercase">FINANZAS CORPORATIVAS</h1>
              <p className="text-sm text-gray-600">Accionistas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">Nuevo Accionista</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Información de la empresa */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-gray-900">TREECLOUD TECHNOLOGIES</h2>
          </div>
          <p className="text-sm text-gray-600 ml-9">El Salvador</p>
        </div>

        {/* Tabla de Accionistas */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">NOMBRE</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-sm">APELLIDO</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">N° ACCIONES</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">VALOR NOMINAL</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">TOTAL</th>
                  <th className="text-center p-4 font-semibold text-gray-700 text-sm">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {accionistas.map((accionista, index) => (
                  <tr key={accionista.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 text-gray-900">{accionista.nombre}</td>
                    <td className="p-4 text-blue-600 hover:underline cursor-pointer">{accionista.apellido}</td>
                    <td className="p-4 text-center text-gray-700">{accionista.numAcciones}</td>
                    <td className="p-4 text-center text-gray-700">{accionista.valorNominal}</td>
                    <td className="p-4 text-center font-semibold text-gray-900">{accionista.total}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Botón de verificación */}
                        <button className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                          <Check className="w-4 h-4 text-white" />
                        </button>
                        
                        {/* Toggle switch */}
                        <button
                          onClick={() => handleToggle(accionista.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            toggleStates[accionista.id] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              toggleStates[accionista.id] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>

                        {/* Botón de configuración */}
                        <button className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
                          <Settings className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón Regresar */}
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accionistas;