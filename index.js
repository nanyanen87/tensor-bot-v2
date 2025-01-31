import {Client, Collection, Events, GatewayIntentBits} from 'discord.js';
import dotenv from "dotenv";
import fs from "fs";
import {deployCommands} from "./script/deploy-commands.js";
import {interactionHandler} from "./interactionHandler.js";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // メッセージの内容を読み取るために必要
    ]
});
import OllamaApi from './lib/ollamaApi.js';
const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `./.env.${env}`});
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_APP_CLIENT_ID;


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// コマンドをデプロイ
if (env === 'prod') {
    deployCommands(TOKEN, CLIENT_ID);
}

// コマンドの読み込み、これでexecuteが実行できるようにする
client.commands = new Collection()
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const exported = await import(`./commands/${file}`);
    if ('data' in exported && 'execute' in exported) {
        client.commands.set(exported.data.name, exported);
    } else {
        console.log(`[WARNING] ${file} には "data" または "execute" プロパティがありません。`);
    }
}

// messageが来たときの処理
client.on(Events.MessageCreate, async message => {
    // Bot自身のメッセージは無視
    if (message.author.bot) return;
    // リプライ（メンション）が含まれているか確認
    if (message.mentions.has(client.user)) {
        // リプライに対して返信する
        const ollama = new OllamaApi();
        try {
            const response = await ollama.generate(message.content.slice(5));
            await message.reply(response.response);
        } catch (error) {
            await message.reply('エラーが発生しました: ' + error.message);
        }
    }
});


client.on(Events.InteractionCreate, async interaction => {
    await interactionHandler(interaction, client);
});

client.login(TOKEN);