import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { TensorDock } from "../lib/tensorDockApi.js";

export const data = new SlashCommandBuilder()
    .setName('start-server')
    .setDescription('起動するサーバーを選択します。');
export async function execute(interaction) {
    await interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す

    const tensordock = new TensorDock();
    const serverMap = await tensordock.list();
    const serverIds = Object.keys(serverMap);

    const options = serverIds.map((serverId) => {
        if (serverMap[serverId].status === 'StoppedDisassociated') {
            const label = serverMap[serverId].name + ': ' + serverMap[serverId].status;
            return {
                label: label,
                value: serverId,
            };
        }
        return null;
    }).filter((option) => option !== null);

    if (options.length === 0) {
        await interaction.followUp({
            content: '起動可能なサーバーがありません。',
            ephemeral: false,
        });
        return;
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('start-server')
        .setPlaceholder('Select a server...')
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.followUp({
        content: 'Please select a server:',
        components: [row],
        ephemeral: true, // メッセージをプライベートに
    });
}
