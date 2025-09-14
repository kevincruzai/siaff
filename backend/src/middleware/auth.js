const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserCompany = require('../models/UserCompany');

// Middleware para verificar token JWT
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token de acceso requerido'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuario actual
      const currentUser = await User.findById(decoded.id).select('+password');
      
      if (!currentUser) {
        return res.status(401).json({
          status: 'error',
          message: 'El usuario del token ya no existe'
        });
      }

      // Verificar si el usuario está activo
      if (currentUser.status !== 'active') {
        return res.status(401).json({
          status: 'error',
          message: 'Tu cuenta no está activa. Contacta al administrador.'
        });
      }

      // Verificar si la cuenta está bloqueada
      if (currentUser.isLocked) {
        return res.status(423).json({
          status: 'error',
          message: 'Cuenta temporalmente bloqueada por múltiples intentos fallidos'
        });
      }

      // Agregar usuario a request
      req.user = currentUser;
      
      // Si el token incluye información de empresa, agregarla también
      if (decoded.companyId) {
        req.companyId = decoded.companyId;
        req.userRole = decoded.role;
        req.userPermissions = decoded.permissions || [];
        
        // Verificar que el usuario todavía tenga acceso a esta empresa
        const userCompany = await UserCompany.findOne({
          user: decoded.id,
          company: decoded.companyId,
          status: 'active'
        }).populate('company');

        if (!userCompany) {
          return res.status(403).json({
            status: 'error',
            message: 'Ya no tienes acceso a esta empresa'
          });
        }

        req.userCompany = userCompany;
      }

      next();

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token inválido'
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expirado'
        });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos (considerando contexto de empresa)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    // Verificar rol global (para super admins)
    if (roles.includes(req.user.globalRole)) {
      return next();
    }

    // Verificar rol en el contexto de empresa actual
    if (req.userRole && roles.includes(req.userRole)) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: 'No tienes permisos para acceder a este recurso'
    });
  };
};

// Middleware para verificar permisos específicos en una empresa
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    // Super admins tienen todos los permisos
    if (req.user.globalRole === 'super_admin') {
      return next();
    }

    // Verificar que hay contexto de empresa
    if (!req.companyId) {
      return res.status(400).json({
        status: 'error',
        message: 'Contexto de empresa requerido'
      });
    }

    // Verificar permiso específico
    const hasPermission = await UserCompany.hasPermission(req.user._id, req.companyId, permission);
    
    if (!hasPermission) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

// Middleware para rutas que requieren contexto de empresa
const requireCompanyContext = (req, res, next) => {
  if (!req.companyId) {
    return res.status(400).json({
      status: 'error',
      message: 'Debes seleccionar una empresa para acceder a este recurso'
    });
  }
  next();
};

// Middleware específico para administradores (considerando sistema multitenant)
const requireAdmin = authorize('super_admin', 'owner', 'admin');

// Middleware para verificar que el usuario sea propietario del recurso o admin
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Usuario no autenticado'
    });
  }

  const resourceUserId = req.params.userId || req.params.id;
  
  // Super admin puede acceder a todo
  if (req.user.globalRole === 'super_admin') {
    return next();
  }

  // Owner/admin de empresa puede gestionar usuarios de su empresa
  if (req.userRole && ['owner', 'admin'].includes(req.userRole)) {
    return next();
  }

  // Usuario puede acceder a sus propios recursos
  if (req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    status: 'error',
    message: 'No tienes permisos para acceder a este recurso'
  });
};

module.exports = {
  authenticate,
  authorize,
  requirePermission,
  requireCompanyContext,
  requireAdmin,
  requireOwnershipOrAdmin
};