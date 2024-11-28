import { SlashCommandBuilder } from 'discord.js';
// import TimerManager from '../lib/TimerManager.js';
export const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('サーバーを起動します。');
export async function execute(interaction, serverId=null) {
    console.log('stop command executed');
    await interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す

    await interaction.followUp(`serverId: ${serverId}`);
}
