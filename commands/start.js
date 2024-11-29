import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('サーバーを起動します。');
export async function execute(interaction) {
    console.log('stop command executed');
    // ゆくゆくはapiを叩く
    // なんか適当な処理
    await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
}
