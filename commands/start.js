import { SlashCommandBuilder } from 'discord.js';
import { TimerManager } from '../lib/timerManager.js';
import { TensorDock} from "../lib/tensorDockApi.js";

export const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('サーバーを起動します。');
export async function execute(interaction, serverId=null) {
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    const tensordock = new TensorDock();
    const res = await tensordock.test();
    console.log(res);

    // timerをセット
    const timerManager = new TimerManager();
    const callback = async () => {
        interaction.client.commands.get('stop').execute(interaction, serverId);
        timerManager.clearTimer(serverId);
    }
    timerManager.startTimer(serverId, callback, 1000*20); // 24時間後に停止

    await interaction.followUp(`serverId: ${serverId} を起動しました`, { ephemeral: false });
}
