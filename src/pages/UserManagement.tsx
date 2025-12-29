import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, XCircle, Clock, Mail, Building, User, Search, Home, ChevronRight, AlertCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import API_CONFIG from '../config/api';

interface UserData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
    phone?: string;
    country?: string;
    status: string;
  };
  company: {
    id: string;
    name: string;
    displayName: string;
    industry?: string;
    subscription?: string;
  };
  role: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  permissions?: string[];
  joinedAt?: string;
  lastAccessAt?: string;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  pending: number;
  active: number;
  suspended: number;
  rejected: number;
  total: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStats>({
    pending: 0,
    active: 0,
    suspended: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener estadísticas
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('siaff_token');
      const baseURL = API_CONFIG.getBaseURL();
      const response = await fetch(`${baseURL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setStats(data.data.userStats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('siaff_token');
      const baseURL = API_CONFIG.getBaseURL();
      const response = await fetch(`${baseURL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setUsers(data.data.users);
      } else {
        throw new Error(data.message || 'Error al obtener usuarios');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = (user.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Función para aprobar usuario
  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem('siaff_token');
      const baseURL = API_CONFIG.getBaseURL();
      const response = await fetch(`${baseURL}/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar usuario');
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Actualizar el usuario en la lista local
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'active' as const, approvedAt: new Date().toISOString() }
            : user
        ));
        // Actualizar estadísticas
        fetchStats();
      }
    } catch (err) {
      console.error('Error approving user:', err);
      alert('Error al aprobar usuario: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  // Función para rechazar usuario
  const handleReject = async (userId: string, reason: string) => {
    try {
      const token = localStorage.getItem('siaff_token');
      const baseURL = API_CONFIG.getBaseURL();
      const response = await fetch(`${baseURL}/api/admin/users/${userId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar usuario');
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Actualizar el usuario en la lista local
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'rejected' as const, rejectionReason: reason, rejectedAt: new Date().toISOString() }
            : user
        ));
        // Actualizar estadísticas
        fetchStats();
      }
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Error al rechazar usuario: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3" />
            Suspendido
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar datos</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchUsers();
                fetchStats();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const pendingCount = stats.pending;
  const activeCount = stats.active;
  const suspendedCount = stats.suspended;
  const rejectedCount = stats.rejected;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Inicio</span>
            <ChevronRight className="w-4 h-4" />
            <span>Administración</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Gestión de Usuarios</span>
          </nav>
        </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">ADMINISTRACIÓN</h1>
          </div>
          <h2 className="text-lg text-gray-700 ml-11">Gestión de Usuarios</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-11 mt-1">
            <Users className="w-4 h-4" />
            <span>{users.length} usuarios totales</span>
          </div>
        </div>
        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{suspendedCount}</p>
                <p className="text-sm text-gray-600">Suspendidos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                <p className="text-sm text-gray-600">Rechazados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Empresa</th>
                  <th className="text-left p-4 font-semibold text-gray-700">País</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Rol</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Fecha Registro</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.user.name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{user.company?.name || 'Sin empresa'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{user.user.country || '-'}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700">
                      {user.invitedAt ? new Date(user.invitedAt).toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Aprobar
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Razón del rechazo (opcional):') || 'Sin razón especificada';
                                handleReject(user.id, reason);
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Rechazar
                            </button>
                          </>
                        )}
                        {user.status !== 'pending' && (
                          <span className="text-gray-400 text-sm">Sin acciones</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No se encontraron usuarios con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;