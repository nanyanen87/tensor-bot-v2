import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('start-server')
    .setDescription('起動するサーバーを選択します。');
export async function execute(interaction) {
    // サンプルサーバーリスト（必要に応じて動的に取得）
    const servers = [
        { id: 'server1', name: 'Server 1' },
        { id: 'server2', name: 'Server 2' },
        { id: 'server3', name: 'Server 3' },
    ];

    const options = servers.map(server => ({
        label: server.name,
        value: server.id,
    }));

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-server')
        .setPlaceholder('Select a server...')
        .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
        content: 'Please select a server:',
        components: [row],
        ephemeral: true, // メッセージをプライベートに
    });
}
