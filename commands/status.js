import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('comfyUIの状態を確認します');
export async function execute(interaction, serverId=null) {
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    await interaction.followUp(`serverId: ${serverId} を停止しました`, { ephemeral: false });
}