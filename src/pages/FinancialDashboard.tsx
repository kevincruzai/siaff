import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

// Configuración del tema dark para Highcharts
Highcharts.setOptions({
  credits: {
    enabled: false
  },
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  },
  title: {
    style: {
      color: '#1F2937',
      fontSize: '16px',
      fontWeight: '600'
    }
  },
  legend: {
    itemStyle: {
      color: '#6B7280'
    }
  }
});

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

const FinancialDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [isLoading, setIsLoading] = useState(false);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  
  // Estados para controlar la rotación de cada gráfico 3D
  const [salesRotation, setSalesRotation] = useState({ alpha: 15, beta: 15 });
  const [assetsRotation, setAssetsRotation] = useState({ alpha: 45, beta: 0 });
  const [profitabilityRotation, setProfitabilityRotation] = useState({ alpha: 20, beta: 30 });
  const [cashFlowRotation, setCashFlowRotation] = useState({ alpha: 15, beta: 15 });

  // Cargar módulo 3D dinámicamente
  useEffect(() => {
    const load3D = async () => {
      try {
        const highcharts3d = await import('highcharts/highcharts-3d');
        if (highcharts3d.default) {
          (highcharts3d.default as any)(Highcharts);
          setIs3DLoaded(true);
        }
      } catch (error) {
        console.log('Error loading 3D module:', error);
        setIs3DLoaded(true); // Continuar sin 3D
      }
    };
    load3D();
  }, []);

  const breadcrumbItems = [
    { icon: BarChart3, label: 'Dashboard Financiero' }
  ];

  // Métricas principales
  const metrics: DashboardMetric[] = [
    {
      title: 'Flujo de Efectivo',
      value: '$2,450,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Ingresos Totales',
      value: '$8,750,000',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Gastos Operativos',
      value: '$6,300,000',
      change: '-3.1%',
      changeType: 'positive',
      icon: TrendingDown
    },
    {
      title: 'EBITDA',
      value: '$2,450,000',
      change: '+15.7%',
      changeType: 'positive',
      icon: BarChart3
    }
  ];

  // Configuración del gráfico de Flujo de Efectivo
  const cashFlowOptions = {
    chart: {
      type: 'line',
      height: 300
    },
    title: {
      text: 'Flujo de Efectivo Mensual'
    },
    xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      gridLineWidth: 1
    },
    yAxis: {
      title: {
        text: 'Monto (USD)'
      },
      labels: {
        formatter: function(this: any) {
          return '$' + (this.value / 1000000).toFixed(1) + 'M';
        }
      }
    },
    series: [
      {
        name: 'Entradas',
        data: [2100000, 2300000, 2150000, 2400000, 2600000, 2800000, 2900000, 2750000, 2650000, 2850000, 3100000, 3200000],
        color: '#10B981'
      },
      {
        name: 'Salidas',
        data: [1800000, 1900000, 1750000, 2000000, 2100000, 2200000, 2300000, 2150000, 2050000, 2250000, 2400000, 2500000],
        color: '#EF4444'
      },
      {
        name: 'Flujo Neto',
        data: [300000, 400000, 400000, 400000, 500000, 600000, 600000, 600000, 600000, 600000, 700000, 700000],
        color: '#3B82F6'
      }
    ],
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': $' + (this.y / 1000000).toFixed(1) + 'M';
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom'
    }
  };

  // Configuración del gráfico de Presupuesto vs Real
  const budgetVsActualOptions = {
    chart: {
      type: 'column',
      height: 300
    },
    title: {
      text: 'Presupuesto vs Real por Departamento'
    },
    xAxis: {
      categories: ['Ventas', 'Marketing', 'Operaciones', 'IT', 'RRHH', 'Finanzas']
    },
    yAxis: {
      title: {
        text: 'Monto (USD)'
      },
      labels: {
        formatter: function(this: any) {
          return '$' + (this.value / 1000).toFixed(0) + 'K';
        }
      }
    },
    series: [
      {
        name: 'Presupuestado',
        data: [850000, 420000, 650000, 380000, 290000, 180000],
        color: '#6B7280'
      },
      {
        name: 'Real',
        data: [920000, 380000, 590000, 410000, 275000, 165000],
        color: '#3B82F6'
      }
    ],
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': $' + (this.y / 1000).toFixed(0) + 'K';
      }
    }
  };

  // Configuración del gráfico de distribución por categoría
  const expenseDistributionOptions = {
    chart: {
      type: 'pie',
      height: 300
    },
    title: {
      text: 'Distribución de Gastos'
    },
    series: [{
      name: 'Gastos',
      data: [
        { name: 'Salarios', y: 35, color: '#3B82F6' },
        { name: 'Operaciones', y: 25, color: '#10B981' },
        { name: 'Marketing', y: 15, color: '#F59E0B' },
        { name: 'IT', y: 12, color: '#8B5CF6' },
        { name: 'Administración', y: 8, color: '#EF4444' },
        { name: 'Otros', y: 5, color: '#6B7280' }
      ]
    }],
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.point.name + '</b>: ' + this.y + '%';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        },
        showInLegend: false
      }
    }
  };

  // Configuración del gráfico de tendencias financieras
  const financialTrendsOptions = {
    chart: {
      type: 'area',
      height: 300
    },
    title: {
      text: 'Indicadores Financieros Clave'
    },
    xAxis: {
      categories: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']
    },
    yAxis: {
      title: {
        text: 'Ratio'
      }
    },
    series: [
      {
        name: 'ROI (%)',
        data: [12.5, 14.2, 13.8, 15.5, 16.2, 17.8, 18.5, 19.2],
        color: '#10B981'
      },
      {
        name: 'Margen Bruto (%)',
        data: [28.5, 29.2, 30.1, 31.5, 32.2, 33.1, 33.8, 34.5],
        color: '#3B82F6'
      },
      {
        name: 'Liquidez',
        data: [1.8, 1.9, 2.1, 2.3, 2.4, 2.6, 2.7, 2.8],
        color: '#F59E0B'
      }
    ],
    tooltip: {
      shared: true,
      crosshairs: true
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#ffffff',
        lineWidth: 1
      }
    }
  };

  // Configuración del gráfico 3D de Ventas por Región
  const sales3DOptions = {
    chart: {
      type: 'column',
      height: 400,
      options3d: {
        enabled: true,
        alpha: salesRotation.alpha,
        beta: salesRotation.beta,
        depth: 50,
        viewDistance: 25
      }
    },
    title: {
      text: 'Ventas por Región (3D)'
    },
    xAxis: {
      categories: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro']
    },
    yAxis: {
      title: {
        text: 'Ventas (USD)'
      },
      labels: {
        formatter: function(this: any) {
          return '$' + (this.value / 1000000).toFixed(1) + 'M';
        }
      }
    },
    zAxis: {
      min: 0,
      max: 3
    },
    series: [
      {
        name: 'Q1 2024',
        data: [1200000, 980000, 1500000, 860000, 1100000],
        color: '#3B82F6'
      },
      {
        name: 'Q2 2024',
        data: [1350000, 1100000, 1650000, 920000, 1250000],
        color: '#10B981'
      },
      {
        name: 'Q3 2024',
        data: [1450000, 1200000, 1750000, 1000000, 1350000],
        color: '#F59E0B'
      },
      {
        name: 'Q4 2024',
        data: [1600000, 1350000, 1900000, 1150000, 1500000],
        color: '#EF4444'
      }
    ],
    plotOptions: {
      column: {
        depth: 25
      }
    },
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': $' + (this.y / 1000000).toFixed(1) + 'M';
      }
    }
  };

  // Configuración del gráfico 3D de Activos vs Pasivos
  const assets3DOptions = {
    chart: {
      type: 'pie',
      height: 400,
      options3d: {
        enabled: true,
        alpha: assetsRotation.alpha,
        beta: assetsRotation.beta
      }
    },
    title: {
      text: 'Composición de Balance (3D)'
    },
    series: [{
      type: 'pie',
      name: 'Balance',
      data: [
        { name: 'Activos Corrientes', y: 35, color: '#3B82F6' },
        { name: 'Activos Fijos', y: 25, color: '#10B981' },
        { name: 'Inversiones', y: 15, color: '#F59E0B' },
        { name: 'Pasivos Corrientes', y: 20, color: '#EF4444' },
        { name: 'Pasivos Largo Plazo', y: 15, color: '#8B5CF6' },
        { name: 'Patrimonio', y: 40, color: '#06B6D4' }
      ]
    }],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%'
        }
      }
    },
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.point.name + '</b>: ' + this.y + '%';
      }
    }
  };

  // Configuración del gráfico 3D de Rentabilidad por Producto
  const profitability3DOptions = {
    chart: {
      type: 'column',
      height: 400,
      options3d: {
        enabled: true,
        alpha: profitabilityRotation.alpha,
        beta: profitabilityRotation.beta,
        depth: 50,
        viewDistance: 25
      }
    },
    title: {
      text: 'Rentabilidad por Línea de Producto (3D)'
    },
    xAxis: {
      categories: ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E']
    },
    yAxis: {
      title: {
        text: 'Rentabilidad (%)'
      }
    },
    series: [
      {
        name: 'Margen Bruto',
        data: [45, 38, 52, 41, 47],
        color: '#10B981'
      },
      {
        name: 'Margen Operativo',
        data: [25, 18, 32, 21, 27],
        color: '#3B82F6'
      },
      {
        name: 'Margen Neto',
        data: [15, 8, 22, 11, 17],
        color: '#F59E0B'
      }
    ],
    plotOptions: {
      column: {
        depth: 25
      }
    },
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': ' + this.y + '%';
      }
    }
  };

  // Configuración del gráfico 3D de Flujo de Caja Proyectado
  const cashFlow3DOptions = {
    chart: {
      type: 'column',
      height: 400,
      options3d: {
        enabled: true,
        alpha: cashFlowRotation.alpha,
        beta: cashFlowRotation.beta,
        depth: 50
      }
    },
    title: {
      text: 'Proyección de Flujo de Caja 3D'
    },
    xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    },
    yAxis: {
      title: {
        text: 'Flujo (USD)'
      },
      labels: {
        formatter: function(this: any) {
          return '$' + (this.value / 1000000).toFixed(1) + 'M';
        }
      }
    },
    series: [
      {
        name: 'Optimista',
        data: [2800000, 3200000, 3500000, 3800000, 4100000, 4400000, 4700000, 5000000, 5300000, 5600000, 5900000, 6200000],
        color: '#10B981'
      },
      {
        name: 'Realista',
        data: [2200000, 2500000, 2700000, 2900000, 3100000, 3300000, 3500000, 3700000, 3900000, 4100000, 4300000, 4500000],
        color: '#3B82F6'
      },
      {
        name: 'Pesimista',
        data: [1600000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000],
        color: '#F59E0B'
      }
    ],
    plotOptions: {
      column: {
        depth: 25,
        stacking: undefined
      }
    },
    tooltip: {
      formatter: function(this: any) {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': $' + (this.y / 1000000).toFixed(1) + 'M';
      }
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Dashboard Financiero
            </h1>
            <p className="text-gray-600 mt-1">Análisis integral del rendimiento financiero empresarial</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <metric.icon className="w-6 h-6 text-gray-600" />
              </div>
              {metric.changeType === 'positive' ? (
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Flujo de Efectivo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={cashFlowOptions}
          />
        </div>

        {/* Presupuesto vs Real */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={budgetVsActualOptions}
          />
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Gastos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={expenseDistributionOptions}
          />
        </div>

        {/* Tendencias Financieras */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <HighchartsReact
            highcharts={Highcharts}
            options={financialTrendsOptions}
          />
        </div>
      </div>

      {/* Título de Sección 3D */}
      <div className="mt-12 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Análisis Avanzado 3D
          </span>
        </h2>
        <p className="text-gray-600 mt-1">Visualización interactiva tridimensional de datos financieros</p>
      </div>

      {/* Primera fila de gráficos 3D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ventas por Región 3D */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-500">ANÁLISIS REGIONAL</span>
            </div>
            {/* Controles de Rotación */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Rotación:</span>
              <div className="flex gap-1">
                <label className="flex items-center gap-1">
                  <span>α:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={salesRotation.alpha} 
                    onChange={(e) => setSalesRotation(prev => ({...prev, alpha: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{salesRotation.alpha}</span>
                </label>
                <label className="flex items-center gap-1">
                  <span>β:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={salesRotation.beta} 
                    onChange={(e) => setSalesRotation(prev => ({...prev, beta: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{salesRotation.beta}</span>
                </label>
              </div>
            </div>
          </div>
          {is3DLoaded ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={sales3DOptions}
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-gray-500">Cargando gráfico 3D...</div>
            </div>
          )}
        </div>

        {/* Balance 3D */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-500">COMPOSICIÓN FINANCIERA</span>
            </div>
            {/* Controles de Rotación */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Rotación:</span>
              <div className="flex gap-1">
                <label className="flex items-center gap-1">
                  <span>α:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={assetsRotation.alpha} 
                    onChange={(e) => setAssetsRotation(prev => ({...prev, alpha: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{assetsRotation.alpha}</span>
                </label>
                <label className="flex items-center gap-1">
                  <span>β:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={assetsRotation.beta} 
                    onChange={(e) => setAssetsRotation(prev => ({...prev, beta: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{assetsRotation.beta}</span>
                </label>
              </div>
            </div>
          </div>
          {is3DLoaded ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={assets3DOptions}
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-gray-500">Cargando gráfico 3D...</div>
            </div>
          )}
        </div>
      </div>

      {/* Segunda fila de gráficos 3D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rentabilidad por Producto 3D */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-500">ANÁLISIS DE PRODUCTOS</span>
            </div>
            {/* Controles de Rotación */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Rotación:</span>
              <div className="flex gap-1">
                <label className="flex items-center gap-1">
                  <span>α:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={profitabilityRotation.alpha} 
                    onChange={(e) => setProfitabilityRotation(prev => ({...prev, alpha: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{profitabilityRotation.alpha}</span>
                </label>
                <label className="flex items-center gap-1">
                  <span>β:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={profitabilityRotation.beta} 
                    onChange={(e) => setProfitabilityRotation(prev => ({...prev, beta: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{profitabilityRotation.beta}</span>
                </label>
              </div>
            </div>
          </div>
          {is3DLoaded ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={profitability3DOptions}
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-gray-500">Cargando gráfico 3D...</div>
            </div>
          )}
        </div>

        {/* Proyección de Flujo de Caja 3D */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-500">PROYECCIONES</span>
            </div>
            {/* Controles de Rotación */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Rotación:</span>
              <div className="flex gap-1">
                <label className="flex items-center gap-1">
                  <span>α:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={cashFlowRotation.alpha} 
                    onChange={(e) => setCashFlowRotation(prev => ({...prev, alpha: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{cashFlowRotation.alpha}</span>
                </label>
                <label className="flex items-center gap-1">
                  <span>β:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    value={cashFlowRotation.beta} 
                    onChange={(e) => setCashFlowRotation(prev => ({...prev, beta: parseInt(e.target.value)}))}
                    className="w-12 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-6 text-center">{cashFlowRotation.beta}</span>
                </label>
              </div>
            </div>
          </div>
          {is3DLoaded ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={cashFlow3DOptions}
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-gray-500">Cargando gráfico 3D...</div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Actualizando datos financieros...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;