'use strict';
const { v4: uuidv4 } = require('uuid');

const settings = [
  // Company
  { category: 'company', key: 'companyName', value: 'Algoritm Ta\'lim Markazi', defaultValue: 'Algoritm Ta\'lim Markazi', description: 'Markazning rasmiy nomi', type: 'text' },
  { category: 'company', key: 'companyPhone', value: '+998 90 123 45 67', defaultValue: '', description: 'Asosiy aloqa raqami', type: 'text' },
  { category: 'company', key: 'companyEmail', value: 'info@algoritm.uz', defaultValue: '', description: 'Asosiy elektron pochta manzili', type: 'email' },
  { category: 'company', key: 'companyAddress', value: 'Toshkent sh., Chilonzor tumani', defaultValue: '', description: 'Yuridik manzil', type: 'text' },
  { category: 'company', key: 'companyWebsite', value: 'https://algoritm.uz', defaultValue: '', description: 'Veb sayt manzili', type: 'text' },
  
  // Branch
  { category: 'branch', key: 'branchName', value: 'Asosiy Filial (Chilonzor)', defaultValue: '', description: 'Filial nomi', type: 'text' },
  { category: 'branch', key: 'workingHours', value: '08:00 - 20:00', defaultValue: '09:00 - 18:00', description: 'Ish vaqtlari', type: 'text' },
  { category: 'branch', key: 'timezone', value: 'Asia/Tashkent', defaultValue: 'Asia/Tashkent', description: 'Vaqt mintaqasi', type: 'select', options: JSON.stringify(['Asia/Tashkent', 'Asia/Samarkand', 'Asia/Almaty']) },
  { category: 'branch', key: 'currency', value: 'UZS', defaultValue: 'UZS', description: 'Asosiy valyuta', type: 'select', options: JSON.stringify(['UZS', 'USD']) },

  // Academic
  { category: 'academic', key: 'attendanceRules', value: 'strict', defaultValue: 'normal', description: 'Davomatni nazorat qilish darajasi', type: 'select', options: JSON.stringify(['strict', 'normal', 'relaxed']) },
  { category: 'academic', key: 'lessonDuration', value: '90', defaultValue: '90', description: 'Bir darsning davomiyligi (daqiqa)', type: 'number' },
  { category: 'academic', key: 'defaultGroupCapacity', value: '15', defaultValue: '12', description: 'Guruhning standart sig\'imi', type: 'number' },
  { category: 'academic', key: 'gradingSystem', value: '100', defaultValue: '100', description: 'Baholash tizimi (5 lik, 100 lik)', type: 'select', options: JSON.stringify(['5', '100']) },

  // Finance
  { category: 'finance', key: 'defaultCurrency', value: 'UZS', defaultValue: 'UZS', description: 'Tizimdagi asosiy hisob valyutasi', type: 'select', options: JSON.stringify(['UZS', 'USD']) },
  { category: 'finance', key: 'paymentMethods', value: 'naqd,click,payme,bank', defaultValue: 'naqd', description: 'Ruxsat etilgan to\'lov usullari (vergul bilan ajrating)', type: 'text' },
  { category: 'finance', key: 'receiptPrefix', value: 'REC-', defaultValue: 'REC-', description: 'Kvitansiya raqamlari uchun prefiks', type: 'text' },
  { category: 'finance', key: 'invoicePrefix', value: 'INV-', defaultValue: 'INV-', description: 'Invoyslar uchun prefiks', type: 'text' },

  // Notifications
  { category: 'notifications', key: 'emailEnabled', value: 'true', defaultValue: 'true', description: 'Email orqali bildirishnomalarni yoqish', type: 'boolean' },
  { category: 'notifications', key: 'smsEnabled', value: 'false', defaultValue: 'false', description: 'SMS xabarnomalarni yoqish', type: 'boolean' },
  { category: 'notifications', key: 'telegramEnabled', value: 'true', defaultValue: 'false', description: 'Telegram bot orqali xabarlar', type: 'boolean' },
  { category: 'notifications', key: 'pushEnabled', value: 'true', defaultValue: 'true', description: 'Tizim ichidagi (Push) bildirishnomalar', type: 'boolean' },

  // Security
  { category: 'security', key: 'passwordPolicy', value: 'strong', defaultValue: 'medium', description: 'Parol kuchliligi siyosati', type: 'select', options: JSON.stringify(['low', 'medium', 'strong']) },
  { category: 'security', key: 'sessionTimeout', value: '30', defaultValue: '60', description: 'Tizimdan avtomatik chiqib ketish vaqti (daqiqa)', type: 'number' },
  { category: 'security', key: 'maxLoginAttempts', value: '5', defaultValue: '5', description: 'Ketma-ket xato kirishlar soni chegarasi', type: 'number' },
  { category: 'security', key: 'twoFactorAuth', value: 'false', defaultValue: 'false', description: 'Ikki bosqichli autentifikatsiya (2FA)', type: 'boolean' },

  // Appearance
  { category: 'appearance', key: 'theme', value: 'system', defaultValue: 'light', description: 'Tizim mavzusi (Light, Dark, System)', type: 'select', options: JSON.stringify(['light', 'dark', 'system']) },
  { category: 'appearance', key: 'primaryColor', value: 'blue', defaultValue: 'blue', description: 'Tizimning asosiy rangi', type: 'select', options: JSON.stringify(['blue', 'indigo', 'purple', 'emerald']) },

  // Language
  { category: 'language', key: 'systemLanguage', value: 'uz', defaultValue: 'uz', description: 'Interfeysning standart tili', type: 'select', options: JSON.stringify(['uz', 'ru', 'en']) }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = settings.map(s => ({
      id: uuidv4(),
      ...s,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('SystemSettings', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SystemSettings', null, {});
  }
};
