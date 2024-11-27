import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('サーバーを起動します。');
export async function execute(interaction) {
    console.log('stop command executed');
    // apiを叩く
    await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
}
