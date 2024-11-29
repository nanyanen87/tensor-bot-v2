import { SlashCommandBuilder } from 'discord.js';
import {TimerManager} from "../lib/timerManager.js";

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('サーバーを停止します。');
export async function execute(interaction, serverId=null) {
    console.log('stop command executed');
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    await interaction.followUp(`serverId: ${serverId} を停止しました`, { ephemeral: false });
}
