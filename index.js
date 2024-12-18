import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.DISCORD_BOT_TOKEN;
import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import fs from 'fs';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import {interactionHandler} from "./interactionHandler.js";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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


// interactionがあったときの処理
client.on(Events.InteractionCreate, async interaction => {
    await interactionHandler(interaction, client);
});

client.login(TOKEN);