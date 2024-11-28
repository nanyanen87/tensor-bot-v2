export const type =2; // 2: APPLICATION_COMMAND
export async function execute(client, interaction) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return interaction.reply({
            content: 'Command not found!',
            ephemeral: true,
        });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'An error occurred while executing the command.',
            ephemeral: true,
        });
    }

}