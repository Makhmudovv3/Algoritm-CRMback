const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');

class AuthService {
  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ? user.role.name : null
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    return { accessToken, refreshToken };
  }

  async login(phone, password, reqIp = null) {
    console.log(`Login attempt: phone=${phone}`);
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      console.log('User not found by phone');
      throw new Error('Invalid phone or password');
    }
    if (!user.isActive) {
      console.log('User is inactive');
      throw new Error('Invalid phone or password');
    }
    
    console.log(`User found. Hashed password in DB: ${user.password}`);
    const isPasswordValid = await user.validatePassword(password);
    console.log(`Password valid? ${isPasswordValid}`);
    if (!isPasswordValid) {
      throw new Error('Invalid phone or password');
    }

    const tokens = this.generateTokens(user);
    
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role ? user.role.name : null,
      mustChangePassword: user.mustChangePassword
    };

    // Log the login using the AuditLog
    const { AuditLog } = require('../models');
    await AuditLog.create({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress: reqIp
    });

    return { user: userData, ...tokens };
  }

  async register(userData) {
    let rawRoleName = userData.roleName || 'STUDENT';
    const ROLE_MAPPINGS = {
      'Manager': 'BRANCH_MANAGER',
      'CALL MARKAZ': 'CALL_CENTER',
      'Admin': 'SUPER_ADMIN',
      'Director': 'DIRECTOR',
      'Teacher': 'TEACHER',
      'Student': 'STUDENT',
      'Parent': 'PARENT',
      'Cashier': 'CASHIER',
      'Accountant': 'ACCOUNTANT'
    };
    let roleName = ROLE_MAPPINGS[rawRoleName] || rawRoleName.toUpperCase();
    
    let role = await roleRepository.findByName(roleName);
    
    if (!role) {
      role = await roleRepository.create({ name: roleName, description: `Default ${roleName} role` });
    }

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = await userRepository.create({
      ...userData,
      roleId: role.id
    });

    const userWithRole = await userRepository.findById(newUser.id);
    const tokens = this.generateTokens(userWithRole);
    
    const responseUser = {
      id: userWithRole.id,
      firstName: userWithRole.firstName,
      lastName: userWithRole.lastName,
      email: userWithRole.email,
      phone: userWithRole.phone,
      role: role.name
    };

    return { user: responseUser, ...tokens };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userRepository.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid user or inactive account');
      }

      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();
