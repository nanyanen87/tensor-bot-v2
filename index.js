import {Client, Collection, Events, GatewayIntentBits} from 'discord.js';
import dotenv from "dotenv";
import fs from "fs";
import {deployCommands} from "./deploy-commands.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `./.env.${env}`});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// コマンドをデプロイ
if (env === 'prod') {
    deployCommands();
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


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return; // コマンド以外のイベントは無視する
    const command = interaction.client.commands.get(interaction.commandName);
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(TOKEN);