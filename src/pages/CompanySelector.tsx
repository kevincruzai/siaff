import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, ChevronRight, Users, Calendar, Crown, Shield, Star, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Company {
  id: string;
  name: string;
  displayName: string;
  role: string;
  permissions: string[];
  status: string;
  lastAccess?: string;
  plan: string;
  industry: string;
}

interface CompanyFormData {
  name: string;
  email: string;
  industry: string;
  country: string;
  phone: string;
  description: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectCompany, createCompany } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selecting, setSelecting] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    industry: 'Otro',
    country: 'El Salvador',
    phone: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});

  useEffect(() => {
    if (user?.companies) {
      // Las empresas ya vienen en el formato correcto desde el backend
      const mappedCompanies = user.companies.map(company => ({
        id: company.id,
        name: company.name,
        displayName: company.displayName || company.name,
        role: company.role,
        permissions: company.permissions || [],
        status: company.status || 'active',
        lastAccess: company.lastAccess,
        plan: company.plan || 'Free',
        industry: 'Servicios', // Por ahora hardcoded, luego podemos mejorarlo
      }));
      
      setCompanies(mappedCompanies);
      setLoading(false);
    }
  }, [user]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'manager':
        return <Star className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free':
        return 'bg-gray-100 text-gray-800';
      case 'Startup':
        return 'bg-blue-100 text-blue-800';
      case 'Professional':
        return 'bg-purple-100 text-purple-800';
      case 'Enterprise':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectCompany = async (companyId: string) => {
    try {
      setSelecting(companyId);
      await selectCompany(companyId);
      
      // Redireccionar al dashboard después de seleccionar la empresa exitosamente
      navigate('/dashboard/financial-dashboard');
    } catch (error) {
      console.error('Error selecting company:', error);
      alert('Error al seleccionar empresa: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setSelecting(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setCreating(true);
      await createCompany(formData);
      
      // Redireccionar al dashboard después de crear la empresa exitosamente
      navigate('/dashboard/financial-dashboard');
      
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        industry: 'Otro',
        country: 'El Salvador',
        phone: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error al crear empresa');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Seleccionar Empresa</h1>
            </div>
            <p className="text-gray-600">
              Selecciona la empresa con la que deseas trabajar o crea una nueva
            </p>
          </div>

          {!showCreateForm ? (
            <>
              {/* Lista de empresas */}
              {companies.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Tus Empresas</h2>
                    <p className="text-sm text-gray-600">Selecciona una empresa para continuar</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleSelectCompany(company.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                              {company.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {company.displayName || company.name}
                                </h3>
                                {getRoleIcon(company.role)}
                                <span className="text-sm text-gray-600 capitalize">{company.role}</span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Package className="w-4 h-4" />
                                  {company.industry}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(company.plan)}`}>
                                  Plan {company.plan}
                                </span>
                                {company.lastAccess && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Último acceso: {new Date(company.lastAccess).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {selecting === company.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crear nueva empresa */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Crear Nueva Empresa</h3>
                    <p className="text-gray-600 mb-6">
                      ¿No encuentras tu empresa? Créala y empieza a gestionar tus finanzas
                    </p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      Crear Nueva Empresa
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Formulario de crear empresa */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Crear Nueva Empresa</h2>
                <p className="text-sm text-gray-600">Completa la información de tu empresa</p>
              </div>
              <form onSubmit={handleCreateCompany} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Mi Empresa S.A."
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Corporativo *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contacto@miempresa.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industria
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Servicios">Servicios</option>
                      <option value="Comercio">Comercio</option>
                      <option value="Industria">Industria</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Salud">Salud</option>
                      <option value="Educación">Educación</option>
                      <option value="Agricultura">Agricultura</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="El Salvador">El Salvador</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Panamá">Panamá</option>
                      <option value="México">México</option>
                      <option value="Estados Unidos de América">Estados Unidos de América</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Perú">Perú</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Chile">Chile</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Brasil">Brasil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+503 2XXX-XXXX"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe brevemente tu empresa..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={creating}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando...
                      </>
                    ) : (
                      'Crear Empresa'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:underline">Contacta soporte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;