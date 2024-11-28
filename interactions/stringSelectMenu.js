export const type = 3; // 3: MESSAGE_COMPONENT
export async function execute(client, interaction) {
    if (interaction.customId === 'select-server') {
        const selectedServerId = interaction.values[0];
        console.log(`Selected server: ${selectedServerId}`);
        const startCommand = client.commands.get('start');

        if (!startCommand) {
            return interaction.reply({
                content: 'Start command not found.',
                ephemeral: true,
            });
        }

        try {
            await startCommand.execute(interaction, selectedServerId);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `Error starting timer: ${error.message}`,
                ephemeral: true,
            });
        }
    }

    // 他のselectMenuの処理を追加する場合はここに追加
}