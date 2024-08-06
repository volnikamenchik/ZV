import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { config } from "./config.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on(message("text"), (ctx) =>
  ctx.reply(
    config.helloText,
    Markup.inlineKeyboard([
      [Markup.button.callback(config.pdf.text, "pdfs")],
      [Markup.button.callback(config.about.text, "about")],
    ])
  )
);
bot.action("about", (ctx) => ctx.reply(config.about.answer));
bot.action("pdfs", (ctx) =>
  ctx.reply(
    config.pdf.answer,
    Markup.inlineKeyboard(
      config.pdf.files.map((f, index) => [
        Markup.button.callback(f.name, "pdf:" + index),
      ])
    )
  )
);
bot.action(/pdf:(.+)/, (ctx) => {
  const index = ctx.match[1];
  const pdf = config.pdf.files[index];
  if (!pdf) {
    ctx.reply(config.pdf.notFoundError);
    return;
  }

  const filename = pdf.name + ".pdf";
  ctx.reply(config.pdf.loading + ' "' + filename + '"');

  ctx.replyWithDocument({ source: pdf.path, filename });
});
bot.launch();
