const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Company = require('../models/Company');
const UserCompany = require('../models/UserCompany');
const { authenticate, requireAdmin, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Middleware para todas las rutas admin
router.use(authenticate);

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

// GET /api/admin/dashboard - Dashboard principal del admin
router.get('/dashboard', requirePermission(['user_management', 'view_reports']), async (req, res) => {
  try {
    const { companyId, role: userRole } = req.user;
    
    // Construir filtros basados en el contexto
    let userFilter = {};
    let companyFilter = {};
    
    if (userRole === 'super_admin') {
      // Super admin puede ver todo
    } else if (companyId) {
      // Admin de empresa solo ve su empresa
      userFilter = { 'userCompanies.company': companyId };
      companyFilter = { _id: companyId };
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado'
      });
    }

    // Obtener estadísticas de usuarios
    const userStats = await UserCompany.aggregate([
      ...(Object.keys(userFilter).length > 0 ? [{ $match: userFilter }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Obtener estadísticas de empresas (solo super admin)
    let companyStats = [];
    if (userRole === 'super_admin') {
      companyStats = await Company.aggregate([
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 }
          }
        }
      ]);
    }

    // Obtener usuarios recientes
    const recentUsers = await UserCompany.find(userFilter)
      .populate('user', 'name email phone country')
      .populate('company', 'name displayName industry')
      .sort({ joinedAt: -1 })
      .limit(10)
      .lean();

    // Procesar estadísticas de usuarios
    const userStatusCounts = {
      active: 0,
      pending: 0,
      suspended: 0
    };

    userStats.forEach(stat => {
      userStatusCounts[stat._id] = stat.count;
    });

    // Procesar estadísticas de empresas
    const planCounts = {
      'Free': 0,
      'Startup': 0,
      'Professional': 0,
      'Enterprise': 0
    };

    companyStats.forEach(stat => {
      if (stat._id) planCounts[stat._id] = stat.count;
    });

    res.status(200).json({
      status: 'success',
      data: {
        userStats: {
          ...userStatusCounts,
          total: Object.values(userStatusCounts).reduce((sum, count) => sum + count, 0)
        },
        ...(userRole === 'super_admin' && {
          companyStats: {
            ...planCounts,
            total: Object.values(planCounts).reduce((sum, count) => sum + count, 0)
          }
        }),
        recentUsers: recentUsers.map(uc => ({
          id: uc.user._id,
          name: uc.user.name,
          email: uc.user.email,
          phone: uc.user.phone,
          country: uc.user.country,
          company: {
            id: uc.company._id,
            name: uc.company.name,
            displayName: uc.company.displayName,
            industry: uc.company.industry
          },
          role: uc.role,
          status: uc.status,
          joinedAt: uc.joinedAt,
          lastAccessAt: uc.lastAccessAt
        }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/admin/users - Obtener usuarios con paginación y filtros
router.get('/users', [
  requirePermission(['user_management']),
  query('status')
    .optional()
    .isIn(['pending', 'active', 'suspended'])
    .withMessage('Estado inválido'),
  
  query('role')
    .optional()
    .isIn(['owner', 'admin', 'manager', 'accountant', 'user', 'viewer'])
    .withMessage('Rol inválido'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe estar entre 1 y 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La búsqueda no puede exceder 100 caracteres')
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const {
      status,
      role,
      page = 1,
      limit = 20,
      search,
      sortBy = 'joinedAt',
      sortOrder = 'desc'
    } = req.query;

    const { companyId, role: userRole } = req.user;

    // Construir filtros
    let matchFilters = {};
    
    // Filtrar por empresa si no es super admin
    if (userRole !== 'super_admin' && companyId) {
      matchFilters.company = companyId;
    }
    
    if (status) matchFilters.status = status;
    if (role) matchFilters.role = role;

    // Configurar pipeline de agregación
    const pipeline = [
      { $match: matchFilters },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $unwind: '$companyInfo' }
    ];

    // Agregar filtro de búsqueda
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.name': { $regex: search, $options: 'i' } },
            { 'userInfo.email': { $regex: search, $options: 'i' } },
            { 'userInfo.username': { $regex: search, $options: 'i' } },
            { 'companyInfo.name': { $regex: search, $options: 'i' } },
            { 'companyInfo.displayName': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Configurar ordenamiento
    const sortOptions = {};
    if (sortBy === 'name') {
      sortOptions['userInfo.name'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'email') {
      sortOptions['userInfo.email'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'company') {
      sortOptions['companyInfo.name'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    pipeline.push({ $sort: sortOptions });

    // Calcular total antes de paginación
    const totalPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await UserCompany.aggregate(totalPipeline);
    const totalUsers = totalResult[0]?.total || 0;

    // Agregar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Ejecutar consulta
    const users = await UserCompany.aggregate(pipeline);

    // Calcular información de paginación
    const totalPages = Math.ceil(totalUsers / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      status: 'success',
      data: {
        users: users.map(uc => ({
          id: uc._id,
          user: {
            id: uc.userInfo._id,
            name: uc.userInfo.name,
            email: uc.userInfo.email,
            username: uc.userInfo.username,
            phone: uc.userInfo.phone,
            country: uc.userInfo.country,
            status: uc.userInfo.status
          },
          company: {
            id: uc.companyInfo._id,
            name: uc.companyInfo.name,
            displayName: uc.companyInfo.displayName,
            industry: uc.companyInfo.industry,
            subscription: uc.companyInfo.subscription
          },
          role: uc.role,
          status: uc.status,
          permissions: uc.permissions,
          joinedAt: uc.joinedAt,
          lastAccessAt: uc.lastAccessAt,
          invitedBy: uc.invitedBy
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/admin/companies - Obtener empresas (solo super admin)
router.get('/companies', [
  requireAdmin,
  query('status')
    .optional()
    .isIn(['active', 'suspended', 'cancelled'])
    .withMessage('Estado inválido'),
  
  query('plan')
    .optional()
    .isIn(['Free', 'Startup', 'Professional', 'Enterprise'])
    .withMessage('Plan inválido'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe estar entre 1 y 100')
], async (req, res) => {
  try {
    // Solo super admin puede ver todas las empresas
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado'
      });
    }

    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const {
      status,
      plan,
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (status) filters['subscription.status'] = status;
    if (plan) filters['subscription.plan'] = plan;
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar paginación y ordenamiento
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consultas
    const [companies, totalCompanies] = await Promise.all([
      Company.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .lean(),
      Company.countDocuments(filters)
    ]);

    // Obtener información adicional de cada empresa
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const userCount = await UserCompany.countDocuments({ 
          company: company._id,
          status: 'active'
        });
        
        return {
          id: company._id,
          name: company.name,
          displayName: company.displayName,
          email: company.email,
          phone: company.phone,
          industry: company.industry,
          address: company.address,
          taxId: company.taxId,
          subscription: company.subscription,
          settings: company.settings,
          createdBy: company.createdBy,
          userCount,
          createdAt: company.createdAt,
          updatedAt: company.updatedAt
        };
      })
    );

    // Calcular información de paginación
    const totalPages = Math.ceil(totalCompanies / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      status: 'success',
      data: {
        companies: companiesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCompanies,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
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

// PATCH /api/admin/users/:userId/status - Cambiar estado de usuario en empresa
router.patch('/users/:userId/status', [
  requirePermission(['user_management']),
  body('status')
    .isIn(['active', 'suspended'])
    .withMessage('Estado inválido'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La razón no puede exceder 200 caracteres')
], async (req, res) => {
  try {
    // Validar errores
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { userId } = req.params;
    const { status, reason } = req.body;
    const { companyId, role: userRole } = req.user;

    // Construir filtros
    const filters = { user: userId };
    if (userRole !== 'super_admin' && companyId) {
      filters.company = companyId;
    }

    const userCompany = await UserCompany.findOne(filters)
      .populate('user', 'name email')
      .populate('company', 'name displayName');

    if (!userCompany) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado en la empresa'
      });
    }

    // Verificar permisos de jerarquía
    const roleHierarchy = {
      'owner': 6,
      'admin': 5,
      'manager': 4,
      'accountant': 3,
      'user': 2,
      'viewer': 1
    };

    const currentUserLevel = roleHierarchy[req.user.role] || 0;
    const targetUserLevel = roleHierarchy[userCompany.role] || 0;

    if (targetUserLevel >= currentUserLevel && req.user.id !== userCompany.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'No puedes modificar usuarios con tu mismo nivel o superior'
      });
    }

    // Actualizar estado
    userCompany.status = status;
    if (reason) {
      userCompany.metadata = userCompany.metadata || {};
      userCompany.metadata.statusChangeReason = reason;
      userCompany.metadata.statusChangedBy = req.user.id;
      userCompany.metadata.statusChangedAt = new Date();
    }

    await userCompany.save();

    res.status(200).json({
      status: 'success',
      message: `Usuario ${status === 'active' ? 'activado' : 'suspendido'} exitosamente`,
      data: {
        userCompany: {
          id: userCompany._id,
          user: userCompany.user,
          company: userCompany.company,
          role: userCompany.role,
          status: userCompany.status
        }
      }
    });

  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/admin/stats - Estadísticas del sistema
router.get('/stats', requirePermission(['view_reports']), async (req, res) => {
  try {
    const { companyId, role: userRole } = req.user;

    // Construir filtros basados en el rol
    let userCompanyFilter = {};
    let companyFilter = {};
    
    if (userRole !== 'super_admin' && companyId) {
      userCompanyFilter.company = companyId;
      companyFilter._id = companyId;
    }

    // Estadísticas de usuarios por empresa
    const userStats = await UserCompany.aggregate([
      { $match: userCompanyFilter },
      {
        $group: {
          _id: {
            status: '$status',
            role: '$role'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Estadísticas de empresas (solo super admin)
    let companyStats = [];
    if (userRole === 'super_admin') {
      companyStats = await Company.aggregate([
        {
          $group: {
            _id: {
              plan: '$subscription.plan',
              status: '$subscription.status'
            },
            count: { $sum: 1 }
          }
        }
      ]);
    }

    // Procesar estadísticas
    const processedUserStats = {
      byStatus: { active: 0, pending: 0, suspended: 0 },
      byRole: { owner: 0, admin: 0, manager: 0, accountant: 0, user: 0, viewer: 0 },
      total: 0
    };

    userStats.forEach(stat => {
      processedUserStats.byStatus[stat._id.status] = 
        (processedUserStats.byStatus[stat._id.status] || 0) + stat.count;
      processedUserStats.byRole[stat._id.role] = 
        (processedUserStats.byRole[stat._id.role] || 0) + stat.count;
      processedUserStats.total += stat.count;
    });

    const processedCompanyStats = {
      byPlan: { Free: 0, Startup: 0, Professional: 0, Enterprise: 0 },
      byStatus: { active: 0, suspended: 0, cancelled: 0 },
      total: 0
    };

    companyStats.forEach(stat => {
      if (stat._id.plan) {
        processedCompanyStats.byPlan[stat._id.plan] = 
          (processedCompanyStats.byPlan[stat._id.plan] || 0) + stat.count;
      }
      if (stat._id.status) {
        processedCompanyStats.byStatus[stat._id.status] = 
          (processedCompanyStats.byStatus[stat._id.status] || 0) + stat.count;
      }
      processedCompanyStats.total += stat.count;
    });

    res.status(200).json({
      status: 'success',
      data: {
        userStats: processedUserStats,
        ...(userRole === 'super_admin' && {
          companyStats: processedCompanyStats
        }),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;