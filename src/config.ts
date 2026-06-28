import 'dotenv/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
    throw new Error('BOT_TOKEN не задан - добавь его в файл .env');
}

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;

const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

export const config = {
    botToken,
    agent,
};