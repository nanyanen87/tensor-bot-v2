import { SlashCommandBuilder } from 'discord.js';
import { timerManager } from '../lib/timerManager.js';

export const data = new SlashCommandBuilder()
    .setName('extend')
    .setDescription('3時間に延長します');
export async function execute(interaction, serverId=null) {
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    timerManager.extendTimer(serverId, 60*60*1000*3)


    await interaction.followUp(`serverId: ${serverId} を延長しました`, { ephemeral: false });
}