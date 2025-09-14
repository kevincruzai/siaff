const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Información básica de la empresa
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es requerido'],
    trim: true,
    maxlength: [100, 'El nombre de la empresa no puede exceder 100 caracteres']
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre para mostrar no puede exceder 150 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  // Información de contacto
  email: {
    type: String,
    required: [true, 'El email de la empresa es requerido'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [100, 'La URL del sitio web no puede exceder 100 caracteres']
  },
  
  // Dirección
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'La ciudad no puede exceder 100 caracteres']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, 'El estado/provincia no puede exceder 100 caracteres']
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'El código postal no puede exceder 20 caracteres']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'El país no puede exceder 100 caracteres']
    }
  },
  
  // Información legal y fiscal
  taxId: {
    type: String,
    trim: true,
    maxlength: [50, 'El NIT/RIF no puede exceder 50 caracteres']
  },
  registrationNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'El número de registro no puede exceder 50 caracteres']
  },
  industry: {
    type: String,
    enum: ['Servicios', 'Comercio', 'Industria', 'Tecnología', 'Finanzas', 'Construcción', 'Salud', 'Educación', 'Agricultura', 'Otro'],
    default: 'Otro'
  },
  
  // Configuración de suscripción
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Startup', 'Professional', 'Enterprise'],
      default: 'Free'
    },
    status: {
      type: String,
      enum: ['trial', 'active', 'suspended', 'expired'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // 30 días de trial por defecto
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    },
    maxUsers: {
      type: Number,
      default: 3 // Plan Free permite hasta 3 usuarios
    },
    maxStorageGB: {
      type: Number,
      default: 1 // Plan Free permite 1GB
    }
  },
  
  // Configuración de la empresa
  settings: {
    baseCurrency: {
      type: String,
      default: 'USD'
    },
    fiscalYearStart: {
      type: Number,
      min: 1,
      max: 12,
      default: 1 // Enero
    },
    timezone: {
      type: String,
      default: 'America/El_Salvador'
    },
    dateFormat: {
      type: String,
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
      default: 'DD/MM/YYYY'
    },
    numberFormat: {
      decimalSeparator: {
        type: String,
        enum: ['.', ','],
        default: '.'
      },
      thousandsSeparator: {
        type: String,
        enum: [',', '.', ' '],
        default: ','
      }
    }
  },
  
  // Estado y metadatos
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  logo: {
    type: String,
    default: null
  },
  
  // Usuario que creó la empresa
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Metadatos de seguimiento
  onboarding: {
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedSteps: [{
      type: String,
      enum: ['company_info', 'catalog_setup', 'users_setup', 'preferences']
    }],
    completedAt: Date
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
companySchema.index({ name: 1 });
companySchema.index({ email: 1 });
companySchema.index({ taxId: 1 });
companySchema.index({ status: 1 });
companySchema.index({ 'subscription.plan': 1 });
companySchema.index({ createdBy: 1 });

// Virtuals
companySchema.virtual('isSubscriptionActive').get(function() {
  return this.subscription.status === 'active' && 
         this.subscription.endDate > new Date();
});

companySchema.virtual('daysUntilExpiration').get(function() {
  if (this.subscription.endDate) {
    const diffTime = this.subscription.endDate - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

companySchema.virtual('usedStorage').get(function() {
  // TODO: Calcular el almacenamiento usado real
  return 0;
});

// Métodos de instancia
companySchema.methods.upgradePlan = function(newPlan) {
  const planLimits = {
    'Free': { maxUsers: 3, maxStorageGB: 1 },
    'Startup': { maxUsers: 10, maxStorageGB: 5 },
    'Professional': { maxUsers: 50, maxStorageGB: 50 },
    'Enterprise': { maxUsers: 200, maxStorageGB: 200 }
  };
  
  if (planLimits[newPlan]) {
    this.subscription.plan = newPlan;
    this.subscription.maxUsers = planLimits[newPlan].maxUsers;
    this.subscription.maxStorageGB = planLimits[newPlan].maxStorageGB;
    this.subscription.status = 'active';
    this.subscription.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 año
  }
  
  return this.save();
};

companySchema.methods.suspend = function() {
  this.status = 'suspended';
  this.subscription.status = 'suspended';
  return this.save();
};

companySchema.methods.activate = function() {
  this.status = 'active';
  if (this.subscription.endDate > new Date()) {
    this.subscription.status = 'active';
  }
  return this.save();
};

companySchema.methods.completeOnboardingStep = function(step) {
  if (!this.onboarding.completedSteps.includes(step)) {
    this.onboarding.completedSteps.push(step);
  }
  
  const requiredSteps = ['company_info', 'catalog_setup', 'users_setup', 'preferences'];
  if (requiredSteps.every(s => this.onboarding.completedSteps.includes(s))) {
    this.onboarding.isCompleted = true;
    this.onboarding.completedAt = new Date();
  }
  
  return this.save();
};

// Métodos estáticos
companySchema.statics.findActiveCompanies = function() {
  return this.find({ status: 'active', isActive: true });
};

companySchema.statics.findByPlan = function(plan) {
  return this.find({ 'subscription.plan': plan, status: 'active' });
};

companySchema.statics.getCompanyStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$subscription.plan',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    Free: 0,
    Startup: 0,
    Professional: 0,
    Enterprise: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Middleware pre-save
companySchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = this.name;
  }
  next();
});

module.exports = mongoose.models.Company || mongoose.model('Company', companySchema);