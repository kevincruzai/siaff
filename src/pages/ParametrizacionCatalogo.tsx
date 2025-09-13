import React, { useState, useRef, useCallback } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { 
  Home, BarChart3, Settings, 
  ArrowLeftRight, Workflow, 
  Upload, Download, Save, 
  Link, Unlink, RotateCcw,
  ZoomIn, ZoomOut, Brain, 
  Target, CheckCircle, AlertCircle,
  Sparkles, Zap
} from 'lucide-react';

interface CuentaCliente {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  nivel: number;
  padre?: string;
  mapeada?: boolean;
  cuentaSiaff?: string;
  x?: number;
  y?: number;
}

interface CuentaSiaff {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  nivel: number;
  usado?: boolean;
}

interface Conexion {
  id: string;
  clienteId: string;
  siaffId: string;
}

const ParametrizacionCatalogo: React.FC = () => {
  const [modoVista, setModoVista] = useState<'side-by-side' | 'visual'>('side-by-side');
  const [zoom, setZoom] = useState(1);
  const [conexiones, setConexiones] = useState<Conexion[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const [selectedSiaff, setSelectedSiaff] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragOverSiaff, setDragOverSiaff] = useState<string | null>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [searchSiaff, setSearchSiaff] = useState('');
  const [searchCliente, setSearchCliente] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Datos del catálogo del cliente (simulado)
  const [cuentasCliente, setCuentasCliente] = useState<CuentaCliente[]>([
    { id: 'c1', codigo: '11', nombre: 'Activos Corrientes', tipo: 'Activo', nivel: 1, x: 100, y: 100 },
    { id: 'c2', codigo: '1101', nombre: 'Efectivo y Bancos', tipo: 'Activo', nivel: 2, padre: 'c1', x: 100, y: 150 },
    { id: 'c3', codigo: '110101', nombre: 'Caja General', tipo: 'Activo', nivel: 3, padre: 'c2', x: 100, y: 200 },
    { id: 'c4', codigo: '110102', nombre: 'Banco Nacional', tipo: 'Activo', nivel: 3, padre: 'c2', x: 100, y: 250 },
    { id: 'c5', codigo: '1102', nombre: 'Cuentas x Cobrar', tipo: 'Activo', nivel: 2, padre: 'c1', x: 100, y: 300 },
    { id: 'c6', codigo: '21', nombre: 'Pasivos Corrientes', tipo: 'Pasivo', nivel: 1, x: 100, y: 400 },
    { id: 'c7', codigo: '2101', nombre: 'Proveedores', tipo: 'Pasivo', nivel: 2, padre: 'c6', x: 100, y: 450 },
  ]);

  // Catálogo completo de SIAFF - Datos reales del CSV
  const cuentasSiaff: CuentaSiaff[] = [
    { id: 's1', codigo: '1', nombre: 'ACTIVO', tipo: 'Activo', nivel: 1 },
    { id: 's2', codigo: '11', nombre: 'ACTIVO CORRIENTE', tipo: 'Activo', nivel: 2 },
    { id: 's3', codigo: '1101', nombre: 'EFECTIVO Y EQUIVALENTES DE EFECTIVO', tipo: 'Activo', nivel: 3 },
    { id: 's4', codigo: '110101', nombre: 'EFECTIVO EN CAJA', tipo: 'Activo', nivel: 4 },
    { id: 's5', codigo: '11010101', nombre: 'CAJA GENERAL', tipo: 'Activo', nivel: 5 },
    { id: 's6', codigo: '11010102', nombre: 'CAJA CHICA', tipo: 'Activo', nivel: 5 },
    { id: 's7', codigo: '110103', nombre: 'EFECTIVO EN BANCOS', tipo: 'Activo', nivel: 4 },
    { id: 's8', codigo: '11010301', nombre: 'BANCOS MONEDA NACIONAL', tipo: 'Activo', nivel: 5 },
    { id: 's9', codigo: '11010301001', nombre: 'CUENTA CORRIENTE', tipo: 'Activo', nivel: 6 },
    { id: 's10', codigo: '11010301002', nombre: 'CUENTA DE AHORRO', tipo: 'Activo', nivel: 6 },
    { id: 's11', codigo: '11010301003', nombre: 'DEPÓSITOS A PLAZO', tipo: 'Activo', nivel: 6 },
    { id: 's12', codigo: '11010302', nombre: 'BANCOS MONEDA EXTRANJERA', tipo: 'Activo', nivel: 5 },
    { id: 's13', codigo: '11010302001', nombre: 'CUENTA CORRIENTE', tipo: 'Activo', nivel: 6 },
    { id: 's14', codigo: '11010302002', nombre: 'CUENTA DE AHORRO', tipo: 'Activo', nivel: 6 },
    { id: 's15', codigo: '11010302003', nombre: 'DEPÓSITOS A PLAZO', tipo: 'Activo', nivel: 6 },
    { id: 's16', codigo: '1102', nombre: 'CUENTAS POR COBRAR', tipo: 'Activo', nivel: 3 },
    { id: 's17', codigo: '110201', nombre: 'CLIENTES', tipo: 'Activo', nivel: 4 },
    { id: 's18', codigo: '110202', nombre: 'ESTIMACION PARA CUENTAS INCOBRABLES (CR)', tipo: 'Activo', nivel: 4 },
    { id: 's19', codigo: '110203', nombre: 'CUENTAS POR COBRAR A PARTES RELACIONADAS', tipo: 'Activo', nivel: 4 },
    { id: 's20', codigo: '110204', nombre: 'DEUDORES VARIOS', tipo: 'Activo', nivel: 4 },
    { id: 's21', codigo: '110205', nombre: 'PRÉSTAMOS AL PERSONAL', tipo: 'Activo', nivel: 4 },
    { id: 's22', codigo: '110206', nombre: 'PRÉSTAMOS A ACCIONISTA', tipo: 'Activo', nivel: 4 },
    { id: 's23', codigo: '110207', nombre: 'DOCUMENTOS POR COBRAR', tipo: 'Activo', nivel: 4 },
    { id: 's24', codigo: '110208', nombre: 'OTRAS CUENTAS POR COBRAR', tipo: 'Activo', nivel: 4 },
    { id: 's25', codigo: '1103', nombre: 'CRÉDITO FISCAL - IVA', tipo: 'Activo', nivel: 3 },
    { id: 's26', codigo: '110301', nombre: 'CRÉDITO FISCAL POR COMPRAS LOCALES', tipo: 'Activo', nivel: 4 },
    { id: 's27', codigo: '110302', nombre: 'CRÉDITO FISCAL POR IMPORTACIONES', tipo: 'Activo', nivel: 4 },
    { id: 's28', codigo: '110303', nombre: 'CRÉDITO FISCAL POR RETENCIONES', tipo: 'Activo', nivel: 4 },
    { id: 's29', codigo: '110304', nombre: 'CRÉDITO FISCAL IVA DIFERIDO', tipo: 'Activo', nivel: 4 },
    { id: 's30', codigo: '110305', nombre: 'CRÉDITO FISCAL - REMANENTE', tipo: 'Activo', nivel: 4 },
    { id: 's31', codigo: '1104', nombre: 'CUENTAS POR COBRAR ARRENDAMIENTO FINANCIERO', tipo: 'Activo', nivel: 3 },
    { id: 's32', codigo: '110401', nombre: 'ARRENDAMIENTO FINANCIERO POR COBRAR', tipo: 'Activo', nivel: 4 },
    { id: 's33', codigo: '110402', nombre: 'ESTIMACION PARA CUENTAS DE COBRO DUDOSO', tipo: 'Activo', nivel: 4 },
    { id: 's34', codigo: '1105', nombre: 'INVENTARIOS', tipo: 'Activo', nivel: 3 },
    { id: 's35', codigo: '110501', nombre: 'INVENTARIO EN BODEGA AL COSTO', tipo: 'Activo', nivel: 4 },
    { id: 's36', codigo: '11050101', nombre: 'UNIDAD A', tipo: 'Activo', nivel: 5 },
    { id: 's37', codigo: '11050102', nombre: 'UNIDAD B', tipo: 'Activo', nivel: 5 },
    { id: 's38', codigo: '110502', nombre: 'INVENTARIO DE PRODUCTOS TERMINADOS', tipo: 'Activo', nivel: 4 },
    { id: 's39', codigo: '110503', nombre: 'INVENTARIO DE PRODUCTOS EN PROCESO', tipo: 'Activo', nivel: 4 },
    { id: 's40', codigo: '110504', nombre: 'INVENTARIO DE MATERIA PRIMA', tipo: 'Activo', nivel: 4 },
    { id: 's41', codigo: '110505', nombre: 'ESTIMACION PARA OBSOLESCENCIA DE (CR)', tipo: 'Activo', nivel: 4 },
    { id: 's42', codigo: '110506', nombre: 'DETERIORO DE INVENTARIOS (CR)', tipo: 'Activo', nivel: 4 },
    { id: 's43', codigo: '1106', nombre: 'MERCADERIAS EN CAMINO', tipo: 'Activo', nivel: 3 },
    { id: 's44', codigo: '110601', nombre: 'MERCADERIA EN TRANSITO', tipo: 'Activo', nivel: 4 },
    { id: 's45', codigo: '1107', nombre: 'INVERSIONES TEMPORALES', tipo: 'Activo', nivel: 3 },
    { id: 's46', codigo: '110701', nombre: 'INVERSIONES POR LIQUIDAR', tipo: 'Activo', nivel: 4 },
    { id: 's47', codigo: '1108', nombre: 'ACCIONISTAS', tipo: 'Activo', nivel: 3 },
    { id: 's48', codigo: '12', nombre: 'OTROS ACTIVOS NO FINANCIEROS CORRIENTES', tipo: 'Activo', nivel: 2 },
    { id: 's49', codigo: '1201', nombre: 'PAGOS ANTICIPADOS', tipo: 'Activo', nivel: 3 },
    { id: 's50', codigo: '120101', nombre: 'SEGUROS PAGADOS POR ANTICIPO', tipo: 'Activo', nivel: 4 },
    { id: 's51', codigo: '120102', nombre: 'IMPUESTOS ANTICIPADOS', tipo: 'Activo', nivel: 4 },
    { id: 's52', codigo: '12010201', nombre: 'PAGO A CUENTA ISR', tipo: 'Activo', nivel: 5 },
    { id: 's53', codigo: '12010202', nombre: 'REMANENTE DE EJERCICIOS ANTERIORES', tipo: 'Activo', nivel: 5 },
    { id: 's54', codigo: '12010203', nombre: 'OTROS', tipo: 'Activo', nivel: 5 },
    { id: 's55', codigo: '120103', nombre: 'INVERSIONES POR LIQUIDAR', tipo: 'Activo', nivel: 4 },
    { id: 's56', codigo: '120104', nombre: 'OTROS PAGOS POR ANTICIPADO', tipo: 'Activo', nivel: 4 },
    { id: 's57', codigo: '120105', nombre: 'GASTOS POR ANTICIPADO', tipo: 'Activo', nivel: 4 },
    { id: 's58', codigo: '120106', nombre: 'GASTOS POR AMORTIZAR', tipo: 'Activo', nivel: 4 },
    { id: 's59', codigo: '120107', nombre: 'ALQUILERES PAGADOS POR ANTICIPADO', tipo: 'Activo', nivel: 4 },
    { id: 's60', codigo: '120108', nombre: 'PAPELERIA Y UTILES', tipo: 'Activo', nivel: 4 },
    { id: 's61', codigo: '120109', nombre: 'CONTRATOS POR SERVICIOS', tipo: 'Activo', nivel: 4 },
    { id: 's62', codigo: '13', nombre: 'ACTIVO NO CORRIENTE', tipo: 'Activo', nivel: 2 },
    { id: 's63', codigo: '1301', nombre: 'BIENES MUEBLES', tipo: 'Activo', nivel: 3 },
    { id: 's64', codigo: '130101', nombre: 'MOBILIARIO Y EQUIPO', tipo: 'Activo', nivel: 4 },
    { id: 's65', codigo: '130102', nombre: 'HERRAMIENTAS Y EQUIPOS', tipo: 'Activo', nivel: 4 },
    { id: 's66', codigo: '130103', nombre: 'EQUIPO DE TRANSPORTE', tipo: 'Activo', nivel: 4 },
    { id: 's67', codigo: '1302', nombre: 'BIENES INMUEBLES', tipo: 'Activo', nivel: 3 },
    { id: 's68', codigo: '130201', nombre: 'EDIFICACIONES', tipo: 'Activo', nivel: 4 },
    { id: 's69', codigo: '130202', nombre: 'INSTALACIONES', tipo: 'Activo', nivel: 4 },
    { id: 's70', codigo: '130203', nombre: 'TERRENOS', tipo: 'Activo', nivel: 4 },
    { id: 's71', codigo: '1303', nombre: 'DEPRECIACIÓN ACUMULADA (CR)', tipo: 'Activo', nivel: 3 },
    { id: 's72', codigo: '130301', nombre: 'DEPRECIACION ACUMULADA BIENES MUEBLES (CR)', tipo: 'Activo', nivel: 4 },
    { id: 's73', codigo: '130301001', nombre: 'DEPRECIACION ACUMULADA MOBILIARIO Y EQ (CR)', tipo: 'Activo', nivel: 5 },
    { id: 's74', codigo: '130301002', nombre: 'DEPRECIACION ACUMULADA HERRAMIENTAS (CR)', tipo: 'Activo', nivel: 5 },
    { id: 's75', codigo: '130301003', nombre: 'DEPRECIACION ACUMULADA EQUIPO DE TRANSPORTE (CR)', tipo: 'Activo', nivel: 5 },
    { id: 's76', codigo: '130302', nombre: 'DEPRECIACION ACUMULADA BIENES INMUEBLES (CR)', tipo: 'Activo', nivel: 4 },
    { id: 's77', codigo: '130302001', nombre: 'DEPRECIACION ACUMULADA EDIFICACIONES (CR)', tipo: 'Activo', nivel: 5 },
    { id: 's78', codigo: '130302002', nombre: 'DEPRECIACION ACUMULADA INSTALACIONES (CR)', tipo: 'Activo', nivel: 5 },
    { id: 's79', codigo: '2', nombre: 'PASIVO', tipo: 'Pasivo', nivel: 1 },
    { id: 's80', codigo: '21', nombre: 'PASIVO CORRIENTE', tipo: 'Pasivo', nivel: 2 },
    { id: 's81', codigo: '2101', nombre: 'PRESTAMOS Y SOBREGIROS A CORTO PLAZO', tipo: 'Pasivo', nivel: 3 },
    { id: 's82', codigo: '210101', nombre: 'SOBREGIROS BANCARIOS', tipo: 'Pasivo', nivel: 4 },
    { id: 's83', codigo: '210102', nombre: 'PRESTAMOS BANCARIOS LINEA ROTATIVA', tipo: 'Pasivo', nivel: 4 },
    { id: 's84', codigo: '210103', nombre: 'PORCION CIRCULANTE - PRESTAMOS A LARGO PLAZO', tipo: 'Pasivo', nivel: 4 },
    { id: 's85', codigo: '210104', nombre: 'OTRAS OBLIGACIONES FINANCIERAS A CORTO PLAZO', tipo: 'Pasivo', nivel: 4 },
    { id: 's86', codigo: '2102', nombre: 'CUENTAS POR PAGAR', tipo: 'Pasivo', nivel: 3 },
    { id: 's87', codigo: '210201', nombre: 'PROVEEDORES', tipo: 'Pasivo', nivel: 4 },
    { id: 's88', codigo: '21020101', nombre: 'PROVEEDORES LOCALES', tipo: 'Pasivo', nivel: 5 },
    { id: 's89', codigo: '21020102', nombre: 'PROVEEDORES DEL EXTERIOR', tipo: 'Pasivo', nivel: 5 },
    { id: 's90', codigo: '210202', nombre: 'DOCUMENTOS POR PAGAR', tipo: 'Pasivo', nivel: 4 },
    { id: 's91', codigo: '210203', nombre: 'ACREEDORES VARIOS', tipo: 'Pasivo', nivel: 4 },
    { id: 's92', codigo: '210204', nombre: 'OTRAS CUENTAS POR PAGAR', tipo: 'Pasivo', nivel: 4 },
    { id: 's93', codigo: '2103', nombre: 'CUENTAS POR PAGAR A PARTES RELACIONADAS', tipo: 'Pasivo', nivel: 3 },
    { id: 's94', codigo: '210304001', nombre: 'RELACIONADA A', tipo: 'Pasivo', nivel: 4 },
    { id: 's95', codigo: '210304002', nombre: 'RELACIONADA B', tipo: 'Pasivo', nivel: 4 },
    { id: 's96', codigo: '2105', nombre: 'IMPUESTOS POR PAGAR', tipo: 'Pasivo', nivel: 3 },
    { id: 's97', codigo: '210501', nombre: 'PAGO A CUENTA', tipo: 'Pasivo', nivel: 4 },
    { id: 's98', codigo: '210502', nombre: 'IVA', tipo: 'Pasivo', nivel: 4 },
    { id: 's99', codigo: '210503', nombre: 'IMPUESTO IVA NO DOMICILIADO', tipo: 'Pasivo', nivel: 4 },
    { id: 's100', codigo: '210504', nombre: 'IMPUESTO SOBRE LA RENTA', tipo: 'Pasivo', nivel: 4 },
    { id: 's101', codigo: '3', nombre: 'PATRIMONIO', tipo: 'Patrimonio', nivel: 1 },
    { id: 's102', codigo: '31', nombre: 'CAPITAL Y RESERVAS', tipo: 'Patrimonio', nivel: 2 },
    { id: 's103', codigo: '3101', nombre: 'CAPITAL SOCIAL', tipo: 'Patrimonio', nivel: 3 },
    { id: 's104', codigo: '310101', nombre: 'CAPITAL MINIMO', tipo: 'Patrimonio', nivel: 4 },
    { id: 's105', codigo: '310102', nombre: 'CAPITAL VARIABLE', tipo: 'Patrimonio', nivel: 4 },
    { id: 's106', codigo: '3102', nombre: 'RESERVAS DE CAPITAL', tipo: 'Patrimonio', nivel: 3 },
    { id: 's107', codigo: '310201', nombre: 'RESERVA LEGAL', tipo: 'Patrimonio', nivel: 4 },
    { id: 's108', codigo: '310202', nombre: 'RESERVA POR REVALUACIONES', tipo: 'Patrimonio', nivel: 4 },
    { id: 's109', codigo: '31020201', nombre: 'RESERVA POR REVALUACIONES DE ACTIVOS FIJOS', tipo: 'Patrimonio', nivel: 5 },
    { id: 's110', codigo: '32', nombre: 'RESULTADOS ACUMULADOS', tipo: 'Patrimonio', nivel: 2 },
    { id: 's111', codigo: '3201', nombre: 'UTILIDADES ACUMULADAS', tipo: 'Patrimonio', nivel: 3 },
    { id: 's112', codigo: '320101', nombre: 'UTILIDADES DE EJERCICIOS ANTERIORES', tipo: 'Patrimonio', nivel: 4 },
    { id: 's113', codigo: '320102', nombre: 'UTILIDAD DEL PRESENTE EJERCICIO', tipo: 'Patrimonio', nivel: 4 },
    { id: 's114', codigo: '3202', nombre: 'PERDIDAS ACUMULADAS', tipo: 'Patrimonio', nivel: 3 },
    { id: 's115', codigo: '320201', nombre: 'DÉFICIT DE EJERCICIOS ANTERIORES', tipo: 'Patrimonio', nivel: 4 },
    { id: 's116', codigo: '320202', nombre: 'DÉFICIT DEL PRESENTE EJERCICIO', tipo: 'Patrimonio', nivel: 4 },
    { id: 's117', codigo: '4', nombre: 'CUENTAS DE RESULTADOS DEUDORAS', tipo: 'Resultados', nivel: 1 },
    { id: 's118', codigo: '41', nombre: 'COSTOS DE PRODUCCION', tipo: 'Costos', nivel: 2 },
    { id: 's119', codigo: '4101', nombre: 'COSTOS DE PRODUCCION', tipo: 'Costos', nivel: 3 },
    { id: 's120', codigo: '410101', nombre: 'MANO DE OBRA DIRECTA', tipo: 'Costos', nivel: 4 },
    { id: 's121', codigo: '410101001', nombre: 'SUELDOS', tipo: 'Costos', nivel: 5 },
    { id: 's122', codigo: '42', nombre: 'COSTOS DE VENTAS', tipo: 'Costos', nivel: 2 },
    { id: 's123', codigo: '4201', nombre: 'COMPRAS', tipo: 'Costos', nivel: 3 },
    { id: 's124', codigo: '420101', nombre: 'COMPRAS AL CONTADO', tipo: 'Costos', nivel: 4 },
    { id: 's125', codigo: '42010101', nombre: 'COMPRAS LOCALES', tipo: 'Costos', nivel: 5 },
    { id: 's126', codigo: '43', nombre: 'GASTOS OPERATIVOS', tipo: 'Gastos', nivel: 2 },
    { id: 's127', codigo: '4301', nombre: 'GASTOS DE ADMINISTRACION', tipo: 'Gastos', nivel: 3 },
    { id: 's128', codigo: '430101', nombre: 'SUELDOS Y PRESTACIONES', tipo: 'Gastos', nivel: 4 },
    { id: 's129', codigo: '43010101', nombre: 'SUELDOS', tipo: 'Gastos', nivel: 5 },
    { id: 's130', codigo: '4302', nombre: 'GASTOS DE VENTAS', tipo: 'Gastos', nivel: 3 },
    { id: 's131', codigo: '430201', nombre: 'SUELDOS Y PRESTACIONES', tipo: 'Gastos', nivel: 4 },
    { id: 's132', codigo: '43020101', nombre: 'SUELDOS', tipo: 'Gastos', nivel: 5 },
    { id: 's133', codigo: '4304', nombre: 'GASTOS FINANCIEROS', tipo: 'Gastos', nivel: 3 },
    { id: 's134', codigo: '430401', nombre: 'INTERESES PRESTAMOS DECRECIENTES', tipo: 'Gastos', nivel: 4 },
    { id: 's135', codigo: '5', nombre: 'CUENTAS DE RESULTADOS ACREEDORAS', tipo: 'Ingresos', nivel: 1 },
    { id: 's136', codigo: '51', nombre: 'VENTAS', tipo: 'Ingresos', nivel: 2 },
    { id: 's137', codigo: '5101', nombre: 'VENTAS AL CONTADO', tipo: 'Ingresos', nivel: 3 },
    { id: 's138', codigo: '510101', nombre: 'VENTAS POR PRODUCTOS', tipo: 'Ingresos', nivel: 4 },
    { id: 's139', codigo: '51010101', nombre: 'VENTAS LOCALES', tipo: 'Ingresos', nivel: 5 },
    { id: 's140', codigo: '510102', nombre: 'VENTAS POR SERVICIO', tipo: 'Ingresos', nivel: 4 },
    { id: 's141', codigo: '51010201', nombre: 'VENTAS LOCALES', tipo: 'Ingresos', nivel: 5 },
    { id: 's142', codigo: '5102', nombre: 'VENTAS AL CREDITO', tipo: 'Ingresos', nivel: 3 },
    { id: 's143', codigo: '510201', nombre: 'VENTAS POR PRODUCTOS', tipo: 'Ingresos', nivel: 4 },
    { id: 's144', codigo: '51020101', nombre: 'VENTAS LOCALES', tipo: 'Ingresos', nivel: 5 },
    { id: 's145', codigo: '510202', nombre: 'VENTAS POR SERVICIO', tipo: 'Ingresos', nivel: 4 },
    { id: 's146', codigo: '51020201', nombre: 'VENTAS LOCALES', tipo: 'Ingresos', nivel: 5 },
    { id: 's147', codigo: '52', nombre: 'OTROS INGRESOS', tipo: 'Ingresos', nivel: 2 },
    { id: 's148', codigo: '5201', nombre: 'OTROS INGRESOS', tipo: 'Ingresos', nivel: 3 },
    { id: 's149', codigo: '6', nombre: 'CUENTAS DE CIERRE', tipo: 'Cierre', nivel: 1 },
    { id: 's150', codigo: '61', nombre: 'CUENTAS LIQUIDADORAS DE RESULTADOS', tipo: 'Cierre', nivel: 2 },
    { id: 's151', codigo: '6101', nombre: 'PERDIDAS Y GANANCIAS', tipo: 'Cierre', nivel: 3 }
  ];

  // Función para filtrar cuentas SIAFF
  const cuentasSiaffFiltradas = cuentasSiaff.filter(cuenta =>
    cuenta.codigo.toLowerCase().includes(searchSiaff.toLowerCase()) ||
    cuenta.nombre.toLowerCase().includes(searchSiaff.toLowerCase()) ||
    cuenta.tipo.toLowerCase().includes(searchSiaff.toLowerCase())
  );

  // Función para filtrar cuentas cliente
  const cuentasClienteFiltradas = cuentasCliente.filter(cuenta =>
    cuenta.codigo.toLowerCase().includes(searchCliente.toLowerCase()) ||
    cuenta.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    cuenta.tipo.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const breadcrumbItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard' },
    { icon: BarChart3, label: 'Finanzas Corporativas', href: '/dashboard' },
    { icon: Settings, label: 'Parametrización Catálogo' }
  ];

  // Función de IA para mapeo automático
  const parametrizarConIA = async () => {
    setIsAIProcessing(true);
    
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nuevasConexiones: Conexion[] = [];
    
    // Lógica inteligente de mapeo basada en similitud de nombres y códigos
    cuentasCliente.forEach(cuentaCliente => {
      if (conexiones.some(c => c.clienteId === cuentaCliente.id)) return; // Ya mapeada
      
      // Buscar coincidencia por código exacto
      let cuentaSiaff = cuentasSiaff.find(s => 
        s.codigo === cuentaCliente.codigo && 
        s.tipo === cuentaCliente.tipo &&
        !conexiones.some(c => c.siaffId === s.id) &&
        !nuevasConexiones.some(c => c.siaffId === s.id)
      );
      
      // Si no hay coincidencia exacta, buscar por similitud de nombre
      if (!cuentaSiaff) {
        cuentaSiaff = cuentasSiaff.find(s => {
          const similarity = calcularSimilitud(cuentaCliente.nombre, s.nombre);
          return similarity > 0.6 && 
                 s.tipo === cuentaCliente.tipo &&
                 !conexiones.some(c => c.siaffId === s.id) &&
                 !nuevasConexiones.some(c => c.siaffId === s.id);
        });
      }
      
      if (cuentaSiaff) {
        nuevasConexiones.push({
          id: `ai-${cuentaCliente.id}-${cuentaSiaff.id}`,
          clienteId: cuentaCliente.id,
          siaffId: cuentaSiaff.id
        });
      }
    });
    
    setConexiones(prev => [...prev, ...nuevasConexiones]);
    setIsAIProcessing(false);
  };

  // Función para calcular similitud entre textos
  const calcularSimilitud = (texto1: string, texto2: string): number => {
    const palabras1 = texto1.toLowerCase().split(' ');
    const palabras2 = texto2.toLowerCase().split(' ');
    
    let coincidencias = 0;
    palabras1.forEach(palabra1 => {
      if (palabras2.some(palabra2 => 
        palabra2.includes(palabra1) || palabra1.includes(palabra2)
      )) {
        coincidencias++;
      }
    });
    
    return coincidencias / Math.max(palabras1.length, palabras2.length);
  };

  const pageActions = (
    <>
      <button className="btn-secondary">
        <Upload className="w-4 h-4" />
        Cargar Catálogo
      </button>
      <button className="btn-secondary">
        <Download className="w-4 h-4" />
        Exportar
      </button>
      <button 
        onClick={parametrizarConIA}
        disabled={isAIProcessing}
        className="btn-secondary bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
      >
        {isAIProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Procesando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            IA Parametrizar
          </>
        )}
      </button>
      <button className="btn-primary">
        <Save className="w-4 h-4" />
        Guardar Parametrización
      </button>
    </>
  );

  const handleDragStart = useCallback((e: React.MouseEvent, cuentaId: string) => {
    if (modoVista !== 'visual') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragging(cuentaId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [modoVista]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left - dragOffset.x) / zoom;
    const newY = (e.clientY - rect.top - dragOffset.y) / zoom;
    
    setCuentasCliente(prev => prev.map(cuenta => 
      cuenta.id === dragging 
        ? { ...cuenta, x: newX, y: newY }
        : cuenta
    ));
  }, [dragging, dragOffset, zoom]);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const crearConexion = () => {
    if (!selectedCliente || !selectedSiaff) return;
    
    const nuevaConexion: Conexion = {
      id: `${selectedCliente}-${selectedSiaff}`,
      clienteId: selectedCliente,
      siaffId: selectedSiaff
    };
    
    setConexiones(prev => [...prev, nuevaConexion]);
    setSelectedCliente(null);
    setSelectedSiaff(null);
  };

  const eliminarConexion = (conexionId: string) => {
    setConexiones(prev => prev.filter(c => c.id !== conexionId));
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Activo': return 'bg-green-500';
      case 'Pasivo': return 'bg-red-500';
      case 'Patrimonio': return 'bg-blue-500';
      case 'Ingreso': return 'bg-purple-500';
      case 'Gasto': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Drag & Drop para cuentas individuales
  const handleDragStartCuenta = (e: React.DragEvent, cuentaId: string) => {
    e.dataTransfer.setData('cuentaCliente', cuentaId);
    setDragging(cuentaId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, siaffId: string) => {
    e.preventDefault();
    setDragOverSiaff(siaffId);
  };

  const handleDragLeave = () => {
    setDragOverSiaff(null);
  };

  const handleDropOnSiaff = (e: React.DragEvent, siaffId: string) => {
    e.preventDefault();
    const cuentaClienteId = e.dataTransfer.getData('cuentaCliente');
    
    if (cuentaClienteId && !conexiones.some(c => c.clienteId === cuentaClienteId)) {
      const nuevaConexion: Conexion = {
        id: `drop-${cuentaClienteId}-${siaffId}`,
        clienteId: cuentaClienteId,
        siaffId: siaffId
      };
      
      setConexiones(prev => [...prev, nuevaConexion]);
    }
    
    setDragging(null);
    setDragOverSiaff(null);
  };

  // Estadísticas
  const totalCuentas = cuentasCliente.length;
  const cuentasMapeadas = conexiones.length;
  const cuentasPendientes = totalCuentas - cuentasMapeadas;
  const porcentajeCompletado = Math.round((cuentasMapeadas / totalCuentas) * 100);

  const renderSideBySideMode = () => (
    <div className="space-y-6">
      {/* Panel de estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCuentas}</div>
            <div className="text-sm text-gray-600">Total Cuentas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{cuentasMapeadas}</div>
            <div className="text-sm text-gray-600">Mapeadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{cuentasPendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{porcentajeCompletado}%</div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso de Parametrización</span>
            <span>{porcentajeCompletado}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${porcentajeCompletado}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Paneles de catálogos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Catálogo del Cliente */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Catálogo del Cliente
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Arrastrar para mapear
              </span>
            </h3>
            {/* Buscador Cliente */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código, nombre o tipo..."
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-2 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          <div className="p-4 max-h-[48rem] overflow-y-auto">
            {cuentasClienteFiltradas.map(cuenta => {
              const conexion = conexiones.find(c => c.clienteId === cuenta.id);
              return (
                <div 
                  key={cuenta.id}
                  draggable={!conexion}
                  onDragStart={(e) => handleDragStartCuenta(e, cuenta.id)}
                  onClick={() => setSelectedCliente(cuenta.id)}
                  className={`p-3 mb-2 rounded-lg border transition-all ${
                    dragging === cuenta.id
                      ? 'scale-105 shadow-lg border-blue-500 bg-blue-100'
                      : selectedCliente === cuenta.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : conexion
                      ? 'border-green-500 bg-green-50 cursor-default'
                      : 'border-gray-200 hover:border-gray-300 cursor-grab active:cursor-grabbing'
                  } ${!conexion ? 'hover:shadow-md' : ''}`}
                  style={{ marginLeft: `${(cuenta.nivel - 1) * 16}px` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm font-semibold">{cuenta.codigo}</div>
                      <div className="text-sm text-gray-700">{cuenta.nombre}</div>
                      {conexion ? (
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Mapeado a SIAFF
                        </div>
                      ) : (
                        <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pendiente de mapear
                        </div>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getTipoColor(cuenta.tipo)}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catálogo SIAFF */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              Catálogo SIAFF (Estándar)
              <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                Zona de destino
              </span>
            </h3>
            {/* Buscador SIAFF */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar en catálogo SIAFF..."
                value={searchSiaff}
                onChange={(e) => setSearchSiaff(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <div className="absolute left-2 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          <div className="p-4 max-h-[48rem] overflow-y-auto">
            {cuentasSiaffFiltradas.map(cuenta => {
              const usado = conexiones.some(c => c.siaffId === cuenta.id);
              return (
                <div 
                  key={cuenta.id}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, cuenta.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropOnSiaff(e, cuenta.id)}
                  onClick={() => setSelectedSiaff(cuenta.id)}
                  className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all ${
                    dragOverSiaff === cuenta.id
                      ? 'border-blue-500 bg-blue-100 scale-105'
                      : selectedSiaff === cuenta.id 
                      ? 'border-gray-600 bg-gray-50' 
                      : usado
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ marginLeft: `${(cuenta.nivel - 1) * 16}px` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">{cuenta.codigo}</div>
                      <div className="text-sm text-gray-700">{cuenta.nombre}</div>
                      {usado && (
                        <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          En uso
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {usado && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const conexion = conexiones.find(c => c.siaffId === cuenta.id);
                            if (conexion) {
                              eliminarConexion(conexion.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Desvincular cuenta"
                        >
                          <Unlink className="w-3 h-3" />
                        </button>
                      )}
                      <div className={`w-3 h-3 rounded-full ${getTipoColor(cuenta.tipo)}`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisualMode = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[48rem]">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Modo Visual Programming</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Buscadores para modo visual */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en catálogo cliente..."
              value={searchCliente}
              onChange={(e) => setSearchCliente(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-2 top-2.5 text-gray-400">🔍</div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en catálogo SIAFF..."
              value={searchSiaff}
              onChange={(e) => setSearchSiaff(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
            <div className="absolute left-2 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>
      </div>
      
      <div className="relative h-full overflow-auto bg-gray-50">
        <div 
          ref={canvasRef}
          className="relative bg-gray-50 min-h-full"
          style={{ 
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            minWidth: '100%',
            minHeight: '100%'
          }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: '0 0',
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              minWidth: '800px',
              minHeight: '600px'
            }}
          >
            {/* Nodos del Cliente */}
            {cuentasClienteFiltradas.map(cuenta => (
              <div
                key={cuenta.id}
                className={`absolute bg-blue-100 border-2 border-blue-300 rounded-lg p-3 cursor-move shadow-lg min-w-48 ${
                  selectedCliente === cuenta.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ 
                  left: `${cuenta.x}px`, 
                  top: `${cuenta.y}px`,
                  transform: dragging === cuenta.id ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseDown={(e) => {
                  handleDragStart(e, cuenta.id);
                  setSelectedCliente(cuenta.id);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${getTipoColor(cuenta.tipo)}`}></div>
                  <div className="text-xs font-mono font-bold">{cuenta.codigo}</div>
                </div>
                <div className="text-sm font-medium text-gray-900">{cuenta.nombre}</div>
                <div className="text-xs text-gray-600">{cuenta.tipo}</div>
              </div>
            ))}

            {/* Panel SIAFF fijo */}
            <div className="absolute right-4 top-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="bg-gray-100 p-3 border-b">
                <h4 className="font-semibold text-sm">Catálogo SIAFF</h4>
              </div>
              <div className="p-3 max-h-96 overflow-y-auto">
                {cuentasSiaffFiltradas.map(cuenta => {
                  const usado = conexiones.some(c => c.siaffId === cuenta.id);
                  return (
                    <div
                      key={cuenta.id}
                      onClick={() => setSelectedSiaff(cuenta.id)}
                      className={`p-2 mb-1 rounded text-xs cursor-pointer transition-all ${
                        selectedSiaff === cuenta.id 
                          ? 'bg-gray-200 border border-gray-400' 
                          : usado
                          ? 'bg-green-100 border border-green-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-mono font-semibold">{cuenta.codigo}</div>
                          <div className="text-gray-700 truncate">{cuenta.nombre}</div>
                        </div>
                        {usado && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const conexion = conexiones.find(c => c.siaffId === cuenta.id);
                              if (conexion) {
                                eliminarConexion(conexion.id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors ml-2"
                            title="Desvincular cuenta"
                          >
                            <Unlink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conexiones visuales */}
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              {conexiones.map(conexion => {
                const cuentaCliente = cuentasCliente.find(c => c.id === conexion.clienteId);
                if (!cuentaCliente) return null;
                
                return (
                  <line
                    key={conexion.id}
                    x1={cuentaCliente.x! + 192} // ancho del nodo cliente
                    y1={cuentaCliente.y! + 30} // altura media del nodo
                    x2={window.innerWidth - 300} // panel SIAFF
                    y2={100} // aproximado
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 shadow-sm">
      <div className="px-8 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <PageHeader 
          title="PARAMETRIZACIÓN DE CATÁLOGO"
          subtitle="Sincronización entre Catálogo Cliente y SIAFF"
          actions={pageActions}
        />
      </div>

      <div className="px-8 pb-8">
        {/* Controles de modo */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Modo de Vista:</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setModoVista('side-by-side')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    modoVista === 'side-by-side'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Side-by-Side
                </button>
                <button
                  onClick={() => setModoVista('visual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    modoVista === 'visual'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Workflow className="w-4 h-4" />
                  Visual Programming
                </button>
              </div>
            </div>
            
            {/* Controles de conexión */}
            <div className="flex items-center gap-2">
              <button
                onClick={crearConexion}
                disabled={!selectedCliente || !selectedSiaff}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link className="w-4 h-4" />
                Conectar
              </button>
              <button
                onClick={() => setConexiones([])}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Vista principal */}
        {modoVista === 'side-by-side' ? renderSideBySideMode() : renderVisualMode()}

        {/* Panel de conexiones */}
        {conexiones.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 p-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Link className="w-5 h-5 text-green-600" />
                Conexiones Establecidas
                <span className="ml-auto text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {conexiones.length} parametrizada{conexiones.length !== 1 ? 's' : ''}
                </span>
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta Cliente
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Conexión
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta SIAFF
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conexiones.map(conexion => {
                    const cuentaCliente = cuentasCliente.find(c => c.id === conexion.clienteId);
                    const cuentaSiaff = cuentasSiaff.find(c => c.id === conexion.siaffId);
                    
                    return (
                      <tr key={conexion.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getTipoColor(cuentaCliente?.tipo || '')}`}></div>
                            <div>
                              <div className="text-sm font-medium text-blue-700">
                                {cuentaCliente?.codigo}
                              </div>
                              <div className="text-sm text-gray-600 truncate max-w-xs">
                                {cuentaCliente?.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                {cuentaCliente?.tipo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ArrowLeftRight className="w-4 h-4 text-green-500 mx-auto" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <div>
                              <div className="text-sm font-medium text-gray-700">
                                {cuentaSiaff?.codigo}
                              </div>
                              <div className="text-sm text-gray-600 truncate max-w-xs">
                                {cuentaSiaff?.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                {cuentaSiaff?.tipo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => eliminarConexion(conexion.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Desvincular cuentas"
                          >
                            <Unlink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParametrizacionCatalogo;