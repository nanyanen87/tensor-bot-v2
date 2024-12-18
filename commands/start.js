import { SlashCommandBuilder } from 'discord.js';
import { TensorDock} from "../lib/tensorDockApi.js";
import { timerManager } from '../lib/timerManager.js';

export const data = new SlashCommandBuilder()
    .setName('start')
    // .addStringOption(option => option.setName('server_id').setDescription('server_id').setRequired(true))
    .setDescription('サーバーを起動します。');
export async function execute(interaction, serverId=null) {
    if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: '処理中...', ephemeral: false }); // まず応答を返す
    } else {
        interaction.reply({ content: '処理中...', ephemeral: false }); // まず応答を返す
    }

    // const serverId = interaction.options.getString('server_id');

    const tensordock = new TensorDock();
    const res = await tensordock.start(serverId);

    if (res.success === false) {
        await interaction.followUp({
            content: 'サーバーの起動に失敗しました。'+ res.error,
            ephemeral: false,
        });
        return;
    }

    if (res.status === true && res.status === 'already') {
        await interaction.followUp({
            content: 'サーバーは既に起動しています。',
            ephemeral: false,
        });
    }

    // timerをセット
    const callback = async () => {
        await interaction.client.commands.get('stop').execute(interaction, serverId);
        timerManager.clearTimer(serverId);
    }
    timerManager.startTimer(serverId, callback, 60*1000); // 1時間後に停止

    await interaction.followUp(`サーバーを起動しました。`, { ephemeral: false });
}