import React, { useState } from 'react';
import { Users as UsersIcon, Search, Home, ChevronRight, User, Building, Mail, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';

interface UserData {
  id: string;
  name: string;
  email: string;
  company: string;
  department?: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  lastLogin: string;
  joinDate: string;
}

const Users: React.FC = () => {
  const [users] = useState<UserData[]>([
    {
      id: '1',
      name: 'Carlos Alberto Gómez',
      email: 'carlos.gomez@holding.com',
      company: 'Holding DEF',
      department: 'Auditoría',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      joinDate: '2024-01-13'
    },
    {
      id: '2',
      name: 'Admin SIAFF',
      email: 'admin@siaff.net',
      company: 'TreeCloud Technologies',
      department: 'Administración',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 10:45',
      joinDate: '2024-01-01'
    },
    {
      id: '3',
      name: 'Usuario Demo',
      email: 'user@siaff.net',
      company: 'TreeCloud Technologies',
      department: 'Finanzas',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-15 08:15',
      joinDate: '2024-01-05'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesRole = filter === 'all' || user.role === filter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Shield className="w-3 h-3" />
            Administrador
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <User className="w-3 h-3" />
            Usuario
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Suspendido
          </span>
        );
      default:
        return null;
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

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
            <span className="text-gray-900 font-medium">Usuarios</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">ADMINISTRACIÓN</h1>
            </div>
            <h2 className="text-lg text-gray-700 ml-11">Usuarios</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 ml-11 mt-1">
              <UsersIcon className="w-4 h-4" />
              <span>{users.length} usuarios registrados</span>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                  <p className="text-sm text-gray-600">Activos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
                  <p className="text-sm text-gray-600">Administradores</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>
                  <p className="text-sm text-gray-600">Suspendidos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-600">Total</p>
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
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Usuarios</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="suspended">Suspendidos</option>
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
                    <th className="text-left p-4 font-semibold text-gray-700">Departamento</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Rol</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Último Acceso</th>
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
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{user.company}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{user.department || '-'}</td>
                      <td className="p-4 text-center">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{new Date(user.lastLogin).toLocaleTimeString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No se encontraron usuarios con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;