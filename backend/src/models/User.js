const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Información personal
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Email inválido'
    }
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: [3, 'El username debe tener al menos 3 caracteres'],
    maxlength: [30, 'El username no puede exceder 30 caracteres']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  
  // Información de contacto
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(phone) {
        return !phone || /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(phone);
      },
      message: 'Número de teléfono inválido'
    }
  },
  country: {
    type: String,
    trim: true
  },
  
  // Configuración de cuenta
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es'
    },
    timezone: {
      type: String,
      default: 'America/El_Salvador'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },
  
  // Estado y seguridad de la cuenta
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'deactivated'],
    default: 'active' // Por defecto activo para simplificar
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Sistema de roles global (solo para super admins del sistema)
  globalRole: {
    type: String,
    enum: ['super_admin', 'support', 'user'],
    default: 'user'
  },
  
  // Seguridad y autenticación
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  lastActivity: Date,
  
  // Metadatos
  registrationIP: String,
  registrationUserAgent: String
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ globalRole: 1 });

// Virtual para verificar si está bloqueado
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual para nombre completo
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Métodos de instancia
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.incLoginAttempts = function() {
  // Si ya tenemos un lock anterior que expiró, reiniciar
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Si alcanzamos el máximo de intentos y no está bloqueado, bloquear
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Métodos estáticos
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active', isActive: true });
};

// Middleware pre-save para hash de contraseña
userSchema.pre('save', async function(next) {
  // Solo hash la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  // Hash la contraseña con costo de 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Middleware para actualizar última actividad
userSchema.methods.updateLastActivity = function() {
  this.lastActivity = new Date();
  return this.save({ validateBeforeSave: false });
};

// Middleware para actualizar último login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.lastActivity = new Date();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);