const mongoose = require('mongoose');

const accountCatalogSchema = new mongoose.Schema({
  // Referencia a la empresa (tenant)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'La empresa es requerida']
  },
  
  // Información básica de la cuenta
  code: {
    type: String,
    required: [true, 'El código de cuenta es requerido'],
    trim: true,
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la cuenta es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  // Clasificación contable
  category: {
    type: String,
    enum: ['asset', 'liability', 'equity', 'income', 'expense'],
    required: [true, 'La categoría es requerida']
  },
  subCategory: {
    type: String,
    enum: [
      // Activos
      'current_asset', 'non_current_asset', 'fixed_asset', 'intangible_asset',
      // Pasivos
      'current_liability', 'non_current_liability', 'long_term_liability',
      // Patrimonio
      'share_capital', 'retained_earnings', 'reserves',
      // Ingresos
      'operating_income', 'financial_income', 'other_income',
      // Gastos
      'operating_expense', 'administrative_expense', 'financial_expense', 'other_expense'
    ]
  },
  
  // Estructura jerárquica
  parentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountCatalog'
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
    default: 1
  },
  isParent: {
    type: Boolean,
    default: false
  },
  
  // Configuración de la cuenta
  allowTransactions: {
    type: Boolean,
    default: true
  },
  requireDocument: {
    type: Boolean,
    default: false
  },
  requireCostCenter: {
    type: Boolean,
    default: false
  },
  normalBalance: {
    type: String,
    enum: ['debit', 'credit'],
    required: true
  },
  
  // Estado y control
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  isSystem: {
    type: Boolean,
    default: false // Indica si es una cuenta del sistema que no se puede eliminar
  },
  isDefault: {
    type: Boolean,
    default: false // Indica si viene del catálogo base
  },
  
  // Información adicional
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Los tags no pueden exceder 30 caracteres']
  }],
  
  // Configuración para reportes
  includeInReports: {
    balanceSheet: {
      type: Boolean,
      default: true
    },
    incomeStatement: {
      type: Boolean,
      default: true
    },
    cashFlow: {
      type: Boolean,
      default: true
    }
  },
  
  // Balances (se actualizan con las transacciones)
  currentBalance: {
    debit: {
      type: Number,
      default: 0
    },
    credit: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  
  // Metadatos
  metadata: {
    transactionCount: {
      type: Number,
      default: 0
    },
    lastTransactionDate: {
      type: Date
    },
    createdFromTemplate: {
      type: String // ID del template base si fue creado desde uno
    }
  },
  
  // Campos extensibles
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  
  // Auditoría
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para multitenancy
accountCatalogSchema.index({ company: 1, code: 1 }, { unique: true });
accountCatalogSchema.index({ company: 1, category: 1 });
accountCatalogSchema.index({ company: 1, status: 1 });
accountCatalogSchema.index({ company: 1, parentAccount: 1 });
accountCatalogSchema.index({ company: 1, level: 1 });
accountCatalogSchema.index({ parentAccount: 1 });
accountCatalogSchema.index({ status: 1 });

// Virtual para obtener el código completo con jerarquía
accountCatalogSchema.virtual('fullCode').get(function() {
  // Este se puede implementar recursivamente para mostrar códigos jerárquicos
  return this.code;
});

// Virtual para obtener el balance neto
accountCatalogSchema.virtual('netBalance').get(function() {
  if (this.normalBalance === 'debit') {
    return this.currentBalance.debit - this.currentBalance.credit;
  } else {
    return this.currentBalance.credit - this.currentBalance.debit;
  }
});

// Middleware para actualizar isParent cuando se crean cuentas hijas
accountCatalogSchema.post('save', async function() {
  if (this.parentAccount) {
    await this.constructor.findByIdAndUpdate(
      this.parentAccount,
      { isParent: true }
    );
  }
});

// Método para actualizar balances
accountCatalogSchema.methods.updateBalance = function(debitAmount = 0, creditAmount = 0) {
  this.currentBalance.debit += debitAmount;
  this.currentBalance.credit += creditAmount;
  this.currentBalance.balance = this.netBalance;
  this.metadata.transactionCount += 1;
  this.metadata.lastTransactionDate = new Date();
  
  return this.save();
};

// Método para obtener cuentas hijas
accountCatalogSchema.methods.getChildren = function() {
  return this.constructor.find({
    company: this.company,
    parentAccount: this._id,
    status: 'active'
  }).sort({ code: 1 });
};

// Método estático para obtener catálogo por empresa
accountCatalogSchema.statics.getByCompany = function(companyId, options = {}) {
  const query = {
    company: companyId,
    status: options.status || 'active'
  };
  
  if (options.category) query.category = options.category;
  if (options.level) query.level = options.level;
  if (options.parentAccount !== undefined) query.parentAccount = options.parentAccount;
  
  return this.find(query)
    .populate('parentAccount', 'code name')
    .sort({ code: 1 });
};

// Método estático para crear cuenta desde template
accountCatalogSchema.statics.createFromTemplate = async function(companyId, templateData, userId) {
  const accountData = {
    ...templateData,
    company: companyId,
    createdBy: userId,
    isDefault: true,
    metadata: {
      ...templateData.metadata,
      createdFromTemplate: templateData._id || templateData.code
    }
  };
  
  delete accountData._id; // Remover ID del template
  
  return this.create(accountData);
};

// Método estático para obtener estructura jerárquica
accountCatalogSchema.statics.getHierarchy = async function(companyId, parentId = null) {
  const accounts = await this.find({
    company: companyId,
    parentAccount: parentId,
    status: 'active'
  }).sort({ code: 1 });
  
  // Recursivamente obtener hijos
  for (let account of accounts) {
    if (account.isParent) {
      account.children = await this.getHierarchy(companyId, account._id);
    }
  }
  
  return accounts;
};

module.exports = mongoose.model('AccountCatalog', accountCatalogSchema);