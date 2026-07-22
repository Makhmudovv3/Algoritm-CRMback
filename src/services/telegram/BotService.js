
class BotService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
  }
  start() {
    if(!this.token) return console.log('Telegram Token not set');
    console.log('Telegram Bot Started');
  }
}
module.exports = new BotService();
