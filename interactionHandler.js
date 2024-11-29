import fs from "fs";
import path from "path";

const interactions = new Map();

const __dirname = import.meta.dirname // 現在のファイルがあるディレクトリ
const interactionFolderPath = path.join(__dirname, 'interactions'); // interactionsディレクトリのパス
const interactionFiles = fs.readdirSync(interactionFolderPath).filter(file => file.endsWith(".js"));

(async () => {
    for (const file of interactionFiles) {
        const filePath = path.join(interactionFolderPath, file);
        console.log(filePath);
        const interaction = await import(filePath);
        if ('type' in interaction && 'execute' in interaction) {
            interactions.set(interaction.type, interaction.execute);
        } else {
            console.log(`[WARNING] The interaction at ${filePath} is missing a required "type" or "execute" property.`);
        }
    }
})();

export async function interactionHandler(interaction, client) {
    const handler = interactions.get(interaction.type);
    if (!handler) {
        return interaction.followUp({
            content: `Interaction not found! ${interaction.type}`,
            ephemeral: true,
        });
    }

    try {
        await handler(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'An error occurred while executing the interaction.',
            ephemeral: true,
        });
    }
}