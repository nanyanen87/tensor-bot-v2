import dotenv from "dotenv";
dotenv.config();
const TOKEN = process.env.DISCORD_BOT_TOKEN;
import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import fs from 'fs';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// コマンドの読み込み、これでexecuteが実行できるようにする
client.commands = new Collection()
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const exported = await import(`./commands/${file}`);
    if ('data' in exported && 'execute' in exported) {
        client.commands.set(exported.data.name, exported);
    } else {
        console.log(`[WARNING] ${file} には "data" または "execute" プロパティがありません。`);
    }
}

//


// interactionがあったときの処理
client.on(Events.InteractionCreate, async interaction => {
    // select menu,command以外は無視
    if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

    // select menuのinteraction
    if (interaction.isSelectMenu()) {
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
    }

    // コマンドのinteraction
    if (interaction.isCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
});

client.login(TOKEN);