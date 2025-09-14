import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRange {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const años = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  const formatRange = () => {
    return `${value.startMonth} ${value.startYear} - ${value.endMonth} ${value.endYear}`;
  };

  const handleStartMonthChange = (month: string) => {
    onChange({
      ...value,
      startMonth: month
    });
  };

  const handleStartYearChange = (year: string) => {
    onChange({
      ...value,
      startYear: year
    });
  };

  const handleEndMonthChange = (month: string) => {
    onChange({
      ...value,
      endMonth: month
    });
  };

  const handleEndYearChange = (year: string) => {
    onChange({
      ...value,
      endYear: year
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {formatRange()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 min-w-80">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">Seleccionar Período</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Date Range Selectors */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fecha Inicio */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    DESDE
                  </label>
                  <div className="space-y-2">
                    <select
                      value={value.startMonth}
                      onChange={(e) => handleStartMonthChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {meses.map(mes => (
                        <option key={mes} value={mes}>{mes}</option>
                      ))}
                    </select>
                    <select
                      value={value.startYear}
                      onChange={(e) => handleStartYearChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {años.map(año => (
                        <option key={año} value={año}>{año}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    HASTA
                  </label>
                  <div className="space-y-2">
                    <select
                      value={value.endMonth}
                      onChange={(e) => handleEndMonthChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {meses.map(mes => (
                        <option key={mes} value={mes}>{mes}</option>
                      ))}
                    </select>
                    <select
                      value={value.endYear}
                      onChange={(e) => handleEndYearChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {años.map(año => (
                        <option key={año} value={año}>{año}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  PERÍODOS COMUNES
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onChange({
                        startMonth: 'Enero',
                        startYear: '2019',
                        endMonth: 'Junio',
                        endYear: '2019'
                      });
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Primer Semestre 2019
                  </button>
                  <button
                    onClick={() => {
                      onChange({
                        startMonth: 'Julio',
                        startYear: '2019',
                        endMonth: 'Diciembre',
                        endYear: '2019'
                      });
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Segundo Semestre 2019
                  </button>
                  <button
                    onClick={() => {
                      onChange({
                        startMonth: 'Enero',
                        startYear: '2019',
                        endMonth: 'Diciembre',
                        endYear: '2019'
                      });
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Todo 2019
                  </button>
                  <button
                    onClick={() => {
                      const currentYear = new Date().getFullYear().toString();
                      onChange({
                        startMonth: 'Enero',
                        startYear: currentYear,
                        endMonth: 'Diciembre',
                        endYear: currentYear
                      });
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Año Actual
                  </button>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Aplicar Período
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;