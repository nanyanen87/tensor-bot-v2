import { SlashCommandBuilder } from 'discord.js';
import {TensorDock} from "../lib/tensorDockApi.js";

export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('サーバーを停止します。');
export async function execute(interaction, serverId=null) {
    console.log('stop command executed');
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        await interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    const tensordock = new TensorDock();
    const res = await tensordock.stop(serverId);
    if (res.success === false) {
        await interaction.followUp({
            content: 'サーバーの停止に失敗しました。'+ res.error,
            ephemeral: false,
        });
        return;
    }
    if (res.status === true && res.status === 'already') {
        await interaction.followUp({
            content: 'サーバーは既に停止しています。',
            ephemeral: false,
        });
    }

    await interaction.followUp(`serverId: ${serverId} を停止しました`, { ephemeral: false });
}
