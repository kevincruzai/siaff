const mongoose = require('mongoose');

const userCompanySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'manager', 'accountant', 'user', 'viewer'],
    default: 'user',
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      // Permisos financieros
      'view_finances', 'edit_finances', 'delete_finances',
      'view_reports', 'generate_reports', 'export_reports',
      
      // Permisos de catálogo de cuentas
      'view_catalog', 'edit_catalog', 'manage_catalog',
      
      // Permisos de usuarios
      'view_users', 'invite_users', 'manage_users', 'delete_users',
      
      // Permisos de empresa
      'view_company', 'edit_company', 'manage_company',
      'view_settings', 'edit_settings',
      
      // Permisos de administración
      'admin_panel', 'system_admin'
    ]
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date
  },
  lastAccessAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices compuestos para optimizar búsquedas
userCompanySchema.index({ user: 1, company: 1 }, { unique: true });
userCompanySchema.index({ user: 1, status: 1 });
userCompanySchema.index({ company: 1, role: 1 });
userCompanySchema.index({ company: 1, status: 1 });

// Métodos de instancia
userCompanySchema.methods.activate = function() {
  this.status = 'active';
  this.joinedAt = new Date();
  return this.save();
};

userCompanySchema.methods.suspend = function() {
  this.status = 'suspended';
  this.isActive = false;
  return this.save();
};

userCompanySchema.methods.reject = function() {
  this.status = 'rejected';
  this.isActive = false;
  return this.save();
};

// Métodos estáticos
userCompanySchema.statics.getUserCompanies = function(userId, status = 'active') {
  return this.find({ user: userId, status })
    .populate('company', 'name displayName email industry plan status')
    .sort({ lastAccessAt: -1, createdAt: -1 });
};

userCompanySchema.statics.getCompanyUsers = function(companyId, status = 'active') {
  return this.find({ company: companyId, status })
    .populate('user', 'name email username avatar')
    .sort({ role: 1, joinedAt: 1 });
};

userCompanySchema.statics.hasPermission = async function(userId, companyId, permission) {
  const userCompany = await this.findOne({ 
    user: userId, 
    company: companyId, 
    status: 'active' 
  });
  
  if (!userCompany) return false;
  
  // Owner tiene todos los permisos
  if (userCompany.role === 'owner') return true;
  
  // Verificar permiso específico
  return userCompany.permissions.includes(permission);
};

// Pre-save middleware para definir permisos por rol
userCompanySchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'owner':
        this.permissions = [
          'view_finances', 'edit_finances', 'delete_finances',
          'view_reports', 'generate_reports', 'export_reports',
          'view_catalog', 'edit_catalog', 'manage_catalog',
          'view_users', 'invite_users', 'manage_users', 'delete_users',
          'view_company', 'edit_company', 'manage_company',
          'view_settings', 'edit_settings'
        ];
        break;
      case 'admin':
        this.permissions = [
          'view_finances', 'edit_finances',
          'view_reports', 'generate_reports', 'export_reports',
          'view_catalog', 'edit_catalog',
          'view_users', 'invite_users', 'manage_users',
          'view_company', 'view_settings', 'edit_settings'
        ];
        break;
      case 'manager':
        this.permissions = [
          'view_finances', 'edit_finances',
          'view_reports', 'generate_reports',
          'view_catalog', 'edit_catalog',
          'view_users',
          'view_company'
        ];
        break;
      case 'accountant':
        this.permissions = [
          'view_finances', 'edit_finances',
          'view_reports', 'generate_reports',
          'view_catalog', 'edit_catalog'
        ];
        break;
      case 'user':
        this.permissions = [
          'view_finances',
          'view_reports',
          'view_catalog'
        ];
        break;
      case 'viewer':
        this.permissions = [
          'view_finances',
          'view_reports',
          'view_catalog'
        ];
        break;
    }
  }
  next();
});

// Virtual para determinar si es administrador
userCompanySchema.virtual('isAdmin').get(function() {
  return ['owner', 'admin'].includes(this.role);
});

module.exports = mongoose.models.UserCompany || mongoose.model('UserCompany', userCompanySchema);