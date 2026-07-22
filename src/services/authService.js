const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const { AuthSession, AuditLog } = require('../models');

class AuthService {
  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ? user.role.name : null,
      tokenVersion: user.tokenVersion || 0
    };
    
    // Access Token: 15 daqiqa
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    
    // Refresh Token: 30 kun, faqat tasodifiy string (yoki jwt). JWT qulayroq.
    const refreshToken = jwt.sign({ id: user.id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '30d' });
    
    return { accessToken, refreshToken };
  }

  async verifyTurnstileCaptcha(token) {
    if (!token) return false;
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Test secret
    try {
      const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        secret: secretKey,
        response: token
      });
      return response.data.success;
    } catch (error) {
      console.error('Turnstile verifikatsiyasi xatosi:', error.message);
      return false;
    }
  }

  async login(phone, password, reqIp = null, userAgent = null, captchaToken = null) {
    console.log(`Login attempt: phone=${phone}`);
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('Invalid phone or password');
    }
    if (!user.isActive || user.isBlocked) {
      throw new Error('User account is inactive or blocked');
    }

    // Lock tekshiruvi
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error('Account locked. Please try again after 15 minutes.');
    }

    // CAPTCHA majburiy tekshiruvi (5 tadan ko'p xato bo'lsa)
    if (user.failedLoginAttempts >= 5) {
      if (!captchaToken) {
        const err = new Error('Captcha Required');
        err.isCaptchaRequired = true;
        throw err;
      }
      const isCaptchaValid = await this.verifyTurnstileCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error('Invalid CAPTCHA');
      }
    }
    
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      const newAttempts = (user.failedLoginAttempts || 0) + 1;
      const updates = { failedLoginAttempts: newAttempts };
      
      if (newAttempts >= 10) {
        // 15 minutga bloklash
        updates.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      
      await user.update(updates, { hooks: false });

      await AuditLog.create({
        userId: user.id, action: 'FAILED_LOGIN', entity: 'User', entityId: user.id, ipAddress: reqIp
      });

      if (newAttempts >= 5) {
        const err = new Error('Invalid phone or password. Captcha Required');
        err.isCaptchaRequired = true;
        throw err;
      }
      throw new Error('Invalid phone or password');
    }

    // Muvaffaqiyatli login - stateni tozalash
    await user.update({ failedLoginAttempts: 0, lockUntil: null }, { hooks: false });

    const tokens = this.generateTokens(user);
    
    // AuthSession yaratish
    const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    await AuthSession.create({
      userId: user.id,
      refreshTokenHash,
      ipAddress: reqIp,
      browser: userAgent?.browser || 'Unknown',
      device: userAgent?.device || 'Unknown',
      operatingSystem: userAgent?.os || 'Unknown',
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true
    });

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role ? user.role.name : null,
      mustChangePassword: user.mustChangePassword
    };

    await AuditLog.create({
      userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, ipAddress: reqIp
    });

    return { user: userData, ...tokens };
  }

  async register(userData) {
    // Register mantig'i saqlab qolinadi (Soddalashtirilgan).
    // Odatda productionda faqat adminlar user yaratadi.
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
    if (existingUser) throw new Error('Email already registered');

    const newUser = await userRepository.create({ ...userData, roleId: role.id });
    const userWithRole = await userRepository.findById(newUser.id);
    
    const tokens = this.generateTokens(userWithRole);
    
    // AuthSession yaratish
    const refreshTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    await AuthSession.create({
      userId: userWithRole.id,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    const responseUser = {
      id: userWithRole.id, firstName: userWithRole.firstName, lastName: userWithRole.lastName,
      email: userWithRole.email, phone: userWithRole.phone, role: role.name
    };

    return { user: responseUser, ...tokens };
  }

  async refresh(refreshToken, reqIp, userAgent) {
    if (!refreshToken) throw new Error('Refresh token is required');

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    } catch (error) {
      throw new Error('Invalid refresh token signature');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive || user.isBlocked) {
      throw new Error('Invalid user or inactive account');
    }
    if (decoded.tokenVersion !== user.tokenVersion) {
      throw new Error('Token version mismatch');
    }

    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await AuthSession.findOne({ where: { refreshTokenHash: hash } });

    // Agar sessiya topilmasa yoki yaroqsiz bo'lsa (o'g'irlangan token)
    if (!session || !session.isActive) {
      // Barcha sessiyalarni o'chirish (Security Incident)
      await AuthSession.update({ isActive: false }, { where: { userId: user.id } });
      await AuditLog.create({
        userId: user.id, action: 'SESSION_REVOKED_ALL_THEFT', entity: 'AuthSession', ipAddress: reqIp
      });
      throw new Error('Token compromised. All sessions revoked. Please login again.');
    }

    if (session.expiresAt < new Date()) {
      session.isActive = false;
      await session.save();
      throw new Error('Refresh token expired');
    }

    // Eski sessiyani yopamiz (Rotation)
    session.isActive = false;
    await session.save();

    // Yangi tokenlar
    const tokens = this.generateTokens(user);
    const newHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    
    await AuthSession.create({
      userId: user.id,
      refreshTokenHash: newHash,
      ipAddress: reqIp,
      browser: userAgent?.browser || session.browser,
      device: userAgent?.device || session.device,
      operatingSystem: userAgent?.os || session.operatingSystem,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    return tokens;
  }
}

module.exports = new AuthService();
