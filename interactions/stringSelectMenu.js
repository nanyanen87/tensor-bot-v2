export const type = 3; // 3: MESSAGE_COMPONENT
export async function execute(client, interaction) {
    console.log('stringSelectMenu executed: ', interaction.customId);
    if (interaction.customId === 'start-server') {
        // 選択されたらcomponentを削除
        await interaction.update({ components: [] });

        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const startCommand = client.commands.get('start');

        try {
            await startCommand.execute(interaction, selectedServerId);
        } catch (error) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Error starting timer: ${error.message}`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `Error starting timer: ${error.message}`,
                    ephemeral: true,
                });
            }
        }
    }

    if (interaction.customId === 'stop-server') {
        // 選択されたらcomponentを削除
        await interaction.update({ components: [] });

        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const stopCommand = client.commands.get('stop');

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