const { Telegraf } = require('telegraf');
const { User, Student, Parent, Teacher } = require('../models');
const { Op } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Placeholder for missing token per user requirements
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'PLACEHOLDER_TOKEN_ENTERPRISE';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Algoritm CRM ga xush kelibsiz! Raqamingizni yuborish tugmasini bosing:', {
    reply_markup: {
      keyboard: [
        [{ text: '📱 Telefon raqamni yuborish', request_contact: true }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.on('contact', async (ctx) => {
  try {
    const phoneNumber = ctx.message.contact.phone_number.replace('+', '');
    const telegramId = ctx.from.id.toString();

    // Check user in DB by phone
    const user = await User.findOne({ 
      where: { 
        phone: { [Op.like]: `%${phoneNumber}%` } 
      } 
    });

    if (!user) {
      return ctx.reply('Sizning raqamingiz tizimdan topilmadi. Ma\'muriyatga murojaat qiling.');
    }

    // Save telegram ID
    user.telegramId = telegramId;
    await user.save();

    ctx.reply(`Xush kelibsiz, ${user.firstName}! Endi siz tizim xabarnomalarini shu yerda qabul qilasiz.`, {
      reply_markup: {
        keyboard: [
          ['📅 Dars jadvali', '💰 Balans'],
          ['📚 Uy vazifalari', '⚙️ Sozlamalar']
        ],
        resize_keyboard: true
      }
    });

  } catch (error) {
    console.error('Bot contact error:', error);
    ctx.reply('Xatolik yuz berdi. Iltimos keyinroq urunib ko\'ring.');
  }
});

bot.hears('💰 Balans', async (ctx) => {
  try {
    const telegramId = ctx.from.id.toString();
    const user = await User.findOne({ where: { telegramId } });
    if (!user) return ctx.reply('Avval ro\'yxatdan o\'ting ( /start )');

    if (user.role === 'student') {
      const student = await Student.findOne({ where: { userId: user.id } });
      ctx.reply(`Sizning joriy balansingiz: ${student?.balance || 0} so'm`);
    } else {
      ctx.reply('Balans faqat talabalar uchun mavjud.');
    }
  } catch (error) {
    ctx.reply('Xatolik yuz berdi.');
  }
});

// Launch bot gracefully
if (BOT_TOKEN !== 'PLACEHOLDER_TOKEN_ENTERPRISE') {
  bot.launch().catch(err => console.log('Bot launch failed:', err.message));
  console.log('Telegram Bot started!');
} else {
  console.log('Telegram Bot skipped: No valid token provided in .env');
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
