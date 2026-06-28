import { Telegraf, Markup } from "telegraf";
import { addNote, getNotes, deleteNote, Note } from './storage';
import { config } from './config';

const bot = new Telegraf(config.botToken, {
    telegram: { agent: config.agent },
});

const mainKeyboard = Markup.keyboard([
    ['☰ Мои заметки'],
]).resize();

function buildNotesKeyboard(notes: Note[]) {
    const rows = notes.map((note) =>
        [Markup.button.callback(`✕ ${note.text}`, `del_${note.id}`)]
    );
    return Markup.inlineKeyboard(rows);
}

bot.start((ctx) => {
    ctx.reply(
`Бот для заметок

Сохраняю мысли, идеи и дела, чтобы ничего не забылось.

▪ Отправь любой текст — он сохранится как заметка
▪ «Мои заметки» — покажу весь список
▪ Нажми на заметку — удалю её

Чтобы начать, отправь первую заметку.`, mainKeyboard);
});

bot.hears('☰ Мои заметки', (ctx) => {
    const notes = getNotes(ctx.from.id);
    if (notes.length === 0) {
        ctx.reply(
`Заметок пока нет

Отправь любой текст — он станет твоей первой заметкой.`);
    } else {
        const text = notes.map((note) => `▪ ${note.text}`).join('\n');
        ctx.reply(`Твои заметки · ${notes.length}\n\n${text}\n\nНажми на заметку ниже, чтобы удалить.`, buildNotesKeyboard(notes));
    }
});

bot.action(/^del_(\d+)$/, (ctx) => {
    ctx.answerCbQuery('Заметка удалена');
    const id = Number(ctx.match[1]);
    deleteNote(ctx.from.id, id);
    ctx.reply('Заметка удалена\n\nОткрой «☰ Мои заметки», чтобы посмотреть, что осталось.');
});

bot.on('text', (ctx) => {
    addNote(ctx.from.id, ctx.message.text);
    ctx.reply(
`Заметка сохранена

Открой «☰ Мои заметки», чтобы посмотреть весь список.`);
});

bot.launch(() => console.log('Бот запущен!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));