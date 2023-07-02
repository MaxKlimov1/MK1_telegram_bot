require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const cities = require('./cities/cities');

const wetherRequest = require('./plugins/wetherPlugin');

const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const startBot = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        await bot.setMyCommands([
            { command: '/start', description: 'Начальное приветствие' },
            { command: '/info', description: 'Информация о боте' },
            { command: '/wether', description: 'Информация о погоде' }
        ])

        if (text === '/start') {
            await bot.sendMessage(chatId, `Здравствуйте "${msg.chat.username}", я бот-ассистент "MK-1". Чем могу помочь?`);

            return bot.sendMessage(chatId, `Список доступных комманд:
            /start   - Начальное приветствие
            /info   - Информация о боте
            /wether   - Информация о погоде`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Еще раз хочу представиться, меня зовут MK-1. Я бот-ассистент, которого создал один не очень опытный, но подающий большие надежды разработчик. Моя задача в том, чтобы помочь вам в определенных задачах, а вот в каких... это надо смотреть в списке команд =)`);
        }

        if (text === '/wether') {
            return await bot.sendMessage(chatId, 'Чтобы получить информацию о погоде вам нужно лишь ввести название города по шаблону:   "Москва.погода"')
        }

        cities.forEach(async item => {
            if (text.toLowerCase() === `${item.toLowerCase()}.погода`) {
                const wether = await wetherRequest(`${item},Россия`);

                return bot.sendMessage(chatId,
                    `Локация: ${wether.location}
                Регион: ${wether.region}
                Страна: ${wether.country}
                Местное время: ${wether.locationTime}
                Температура: ${wether.temp_c}
                Облачность: ${wether.cloud}`);
            }
        })

        return bot.sendMessage(chatId, text);

    })
}

startBot();

