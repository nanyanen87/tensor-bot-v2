import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `./.env.${env}`});
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_APP_CLIENT_ID;

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];
const productionCommands = [
    'startServer',
    'stopServer',
    'list',
    'extendServer'
];
// commandsディレクトリからコマンドの中身を取得してデプロイする
const __dirname = import.meta.dirname // 現在のファイルがあるディレクトリ
const commandsFolderPath = path.join(__dirname, '../commands'); // commandsディレクトリのパス
const commandFiles = fs.readdirSync(commandsFolderPath);
// ファイルからdeployのためのjsonデータを作成
for (const file of commandFiles) {
    // production環境ではproductionCommandsのみデプロイする
    if (env === 'prod' && !productionCommands.includes(file.replace('.js', ''))) {
        continue;
    }
    const filePath = path.join(commandsFolderPath, file);
    const exported = await import(filePath);
    if ('data' in exported && 'execute' in exported) {
        const commandJson = exported.data.toJSON();
        commands.push(commandJson);
    } else {
        console.log(`[WARNING] ${filePath} には "data" または "execute" プロパティがありません。`);
    }
}


export function deployCommands(TOKEN, CLIENT_ID) {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');

        rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
            .then(() => {
                console.log(`Successfully reloaded application (/) ${commands.length} commands.`);
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
}

// deployCommands(TOKEN, CLIENT_ID);
