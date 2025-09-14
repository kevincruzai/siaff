const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const UserCompany = require('../models/UserCompany');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Utility function para manejar errores de validación
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  return null;
};

// Función para generar JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth/register - Registro de nuevo usuario
router.post('/register', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El username debe tener entre 3 y 30 caracteres'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Número de teléfono inválido'),
  body('country')
    .optional()
    .trim()
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { name, email, password, username, phone, country } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe un usuario con este email'
      });
    }

    // Verificar si el username ya existe (si se proporcionó)
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          status: 'error',
          message: 'Este username ya está en uso'
        });
      }
    }

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password,
      username,
      phone,
      country,
      registrationIP: req.ip,
      registrationUserAgent: req.get('User-Agent')
    });

    await newUser.save();

    // Generar token
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          status: newUser.status,
          hasCompanies: false,
          companies: []
        }
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        status: 'error',
        message: `Este ${field} ya está en uso`
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/login - Login de usuario
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { email, password } = req.body;

    // Buscar usuario por email (incluir password)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      await user?.incLoginAttempts();
      return res.status(401).json({
        status: 'error',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar si la cuenta está bloqueada
    if (user.isLocked) {
      return res.status(423).json({
        status: 'error',
        message: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos'
      });
    }

    // Verificar si la cuenta está activa
    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Tu cuenta no está activa. Contacta al administrador.'
      });
    }

    // Reset intentos de login fallidos
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Actualizar último login
    await user.updateLastLogin();

    // Obtener empresas del usuario
    const userCompanies = await UserCompany.getUserCompanies(user._id);

    // Generar token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          preferences: user.preferences,
          globalRole: user.globalRole,
          status: user.status,
          lastLogin: user.lastLogin,
          hasCompanies: userCompanies.length > 0,
          companies: userCompanies.map(uc => ({
            id: uc.company._id,
            name: uc.company.name,
            displayName: uc.company.displayName,
            role: uc.role,
            permissions: uc.permissions,
            status: uc.status,
            lastAccess: uc.lastAccessAt,
            plan: uc.company.plan
          }))
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/select-company - Seleccionar empresa para trabajar
router.post('/select-company', [
  authenticate,
  body('companyId')
    .notEmpty()
    .withMessage('El ID de la empresa es obligatorio')
    .isMongoId()
    .withMessage('ID de empresa inválido')
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { companyId } = req.body;

    // Verificar que el usuario tenga acceso a esta empresa
    const userCompany = await UserCompany.findOne({
      user: req.user._id,
      company: companyId,
      status: 'active'
    }).populate('company');

    if (!userCompany) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes acceso a esta empresa'
      });
    }

    // Actualizar último acceso
    userCompany.lastAccessAt = new Date();
    await userCompany.save();

    // Generar nuevo token con la empresa seleccionada
    const token = jwt.sign(
      { 
        id: req.user._id,
        companyId: companyId,
        role: userCompany.role,
        permissions: userCompany.permissions
      }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Empresa seleccionada exitosamente',
      data: {
        token,
        selectedCompany: {
          id: userCompany.company._id,
          name: userCompany.company.name,
          displayName: userCompany.company.displayName,
          role: userCompany.role,
          permissions: userCompany.permissions,
          settings: userCompany.company.settings,
          subscription: userCompany.company.subscription
        }
      }
    });

  } catch (error) {
    console.error('Error seleccionando empresa:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/create-company - Crear nueva empresa
router.post('/create-company', [
  authenticate,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email de empresa inválido'),
  body('industry')
    .optional()
    .isIn(['Servicios', 'Comercio', 'Industria', 'Tecnología', 'Finanzas', 'Construcción', 'Salud', 'Educación', 'Agricultura', 'Otro'])
    .withMessage('Industria inválida'),
  body('country')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .trim()
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { name, email, industry, country, phone, description } = req.body;

    // Verificar si ya existe una empresa con este email
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe una empresa registrada con este email'
      });
    }

    // Crear nueva empresa
    const newCompany = new Company({
      name,
      email,
      industry: industry || 'Otro',
      description,
      phone,
      address: {
        country: country
      },
      createdBy: req.user._id
    });

    await newCompany.save();

    // Crear relación UserCompany como propietario
    const userCompany = new UserCompany({
      user: req.user._id,
      company: newCompany._id,
      role: 'owner',
      status: 'active',
      joinedAt: new Date(),
      lastAccessAt: new Date()
    });

    await userCompany.save();

    // Generar token con la nueva empresa seleccionada
    const token = jwt.sign(
      { 
        id: req.user._id,
        companyId: newCompany._id,
        role: 'owner',
        permissions: userCompany.permissions
      }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'Empresa creada exitosamente',
      data: {
        token,
        company: {
          id: newCompany._id,
          name: newCompany.name,
          displayName: newCompany.displayName,
          email: newCompany.email,
          industry: newCompany.industry,
          role: userCompany.role,
          permissions: userCompany.permissions,
          settings: newCompany.settings,
          subscription: newCompany.subscription
        }
      }
    });

  } catch (error) {
    console.error('Error creando empresa:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/auth/my-companies - Obtener empresas del usuario
router.get('/my-companies', authenticate, async (req, res) => {
  try {
    const userCompanies = await UserCompany.getUserCompanies(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        companies: userCompanies.map(uc => ({
          id: uc.company._id,
          name: uc.company.name,
          displayName: uc.company.displayName,
          role: uc.role,
          permissions: uc.permissions,
          status: uc.status,
          lastAccess: uc.lastAccessAt,
          plan: uc.company.plan,
          industry: uc.company.industry
        })),
        count: userCompanies.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/logout - Logout del usuario
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Actualizar última actividad
    await req.user.updateLastActivity();

    res.status(200).json({
      status: 'success',
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;