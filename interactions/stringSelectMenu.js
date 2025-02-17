
export const type = 3; // 3: MESSAGE_COMPONENT
export async function execute(client, interaction) {
    console.log('stringSelectMenu executed: ', interaction.customId);
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

    if (interaction.customId === 'extend-server') {
        // 選択されたらcomponentを削除
        await interaction.update({ components: [] });

        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const extendCommand = client.commands.get('extend');

        if (!extendCommand) {
            return interaction.followUp({
                content: 'Extend command not found.',
                ephemeral: true,
            });
        }

        try {
            await extendCommand.execute(interaction, selectedServerId);
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                content: `Error Extending timer: ${error.message}`,
                ephemeral: true,
            });
        }
    }
}