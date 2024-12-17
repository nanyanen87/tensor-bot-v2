import { REST, Routes } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_APP_CLIENT_ID;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// コマンドの作成
const commands = [];

// commandsディレクトリからコマンドファイル読み込み
const __filename = fileURLToPath(import.meta.url); // 現在のファイルのパス
const __dirname = path.dirname(__filename);  // 現在のファイルがあるディレクトリ
const commandsFolderPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsFolderPath);

// 各ファイルからdeployのためのjsonデータを作成
for (const file of commandFiles) {
    const filePath = path.join(commandsFolderPath, file);
    const exported = await import(filePath);
    if ('data' in exported && 'execute' in exported) {
        const commandJson = exported.data.toJSON();
        commands.push(commandJson);
    } else {
        console.log(`[WARNING] ${filePath} には "data" または "execute" プロパティがありません。`);
    }
}

// deployの処理
const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}