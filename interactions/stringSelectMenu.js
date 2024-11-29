import { TensorDock } from "../lib/tensorDockApi.js";

export const type = 3; // 3: MESSAGE_COMPONENT
export async function execute(client, interaction) {
    if (interaction.customId === 'start-server') {
        // 選択されたらcomponentを削除
        await interaction.update({ components: [] });

        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const startCommand = client.commands.get('start');


        if (!startCommand) {
            return interaction.followUp({
                content: 'Start command not found.',
                ephemeral: true,
            });
        }

        try {
            await startCommand.execute(interaction, selectedServerId);
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                content: `Error starting timer: ${error.message}`,
                ephemeral: true,
            });
        }
    }

    if (interaction.customId === 'stop-server') {
        // 選択されたらcomponentを削除
        await interaction.update({ components: [] });

        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const stopCommand = client.commands.get('stop');

        if (!stopCommand) {
            return interaction.followUp({
                content: 'Stop command not found.',
                ephemeral: true,
            });
        }

        try {
            await stopCommand.execute(interaction, selectedServerId);
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                content: `Error stopping timer: ${error.message}`,
                ephemeral: true,
            });
        }
    }
}