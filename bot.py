
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes


TOKEN = '7974221862:AAFpcASl_TItAg2GyhEfQvWXfw1XoZSqEus'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text="Hello, World")

def main():
    app = Application.builder().token(TOKEN).build()
    start_handler = CommandHandler('start', start)
    app.add_handler(start_handler)
    app.run_polling()

if __name__ == "__main__":
    main()



# import requests
# import telebot


# TOKEN = '7974221862:AAFpcASl_TItAg2GyhEfQvWXfw1XoZSqEus'

# # Proxy settings
# proxy = {
#     'http':  'http://DDBighLLvXrFGRMCBVJdFQRueWVrdGFuZXQuY29tZmFyYTrhdi5jb212YZ6ubmFqXeEuY29tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@192.168.1.1.apt-kernel.org.copan-moban.info.:2040',
#     'https': 'http://DDBighLLvXrFGRMCBVJdFQRueWVrdGFuZXQuY29tZmFyYTrhdi5jb212YZ6ubmFqXeEuY29tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@192.168.1.1.apt-kernel.org.copan-moban.info.:2040'
# }

# # URL you want to access
# url = 'https://api.telegram.org/bot<Your_Token>/getMe'

# # bot = telebot.TeleBot(TOKEN, proxy=proxy)



# print(dir(telebot.TeleBot))


# import telebot
# import requests

# # Your Telegram Bot Token
# TOKEN = '7974221862:AAFpcASl_TItAg2GyhEfQvWXfw1XoZSqEus'

# # Proxy details
# proxy = "http://cloudflare.com.nokia.com.co.uk.do_yo.want_to.clash_with.this.www.microsoft.com.there_is_no.place_like.localhost.www.bing.com.count_with_me.cyou.net.digikala.com.www.enamad.ir.www.google.com.again_to_fight.everyone.i_am.the_internet.bolombergon-88.info:4550"

# # Set up the requests session with the proxy
# session = requests.Session()
# session.proxies = {
#     'http': proxy,
#     'https': proxy
# }

# # Create the bot using the requests session
# bot = telebot.TeleBot(TOKEN, request_session=session)

# @bot.message_handler(['start'])
# def welcome(message):
#     bot.send(message.chat.id, 'hello')
# bot.polling()