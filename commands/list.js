import { SlashCommandBuilder } from 'discord.js';
import {TensorDock} from "../lib/tensorDockApi.js";
export const data = new SlashCommandBuilder()
    .setName('list')
    .setDescription('サーバーの一覧を表示します');
export async function execute(interaction) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        await interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    const tensordock = new TensorDock();
    const serverMap = await tensordock.list();
    const serverIds = Object.keys(serverMap);

    // country,name,specs,statusを表示する
    let text = '';
    // 見やすく整形
    for (let i = 0; i < serverIds.length; i++) {
        const serverId = serverIds[i];
        const status = serverMap[serverId].status;
        const name = serverMap[serverId].name;
        const gpu = serverMap[serverId].specs.gpu.type;
        text += `${name}: ${status} ${gpu}\n`;
    }

    await interaction.followUp({
        content: `${text}`,
        ephemeral: false,
    });
}