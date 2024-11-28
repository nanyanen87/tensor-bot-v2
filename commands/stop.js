import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('サーバーを停止します。');
export async function execute(interaction, serverId=null) {
    console.log('stop command executed');
    // apiを叩く
    await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);

}
