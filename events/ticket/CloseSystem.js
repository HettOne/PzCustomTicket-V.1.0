const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js')
const config = require('../../settings/config');
const transcript = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if(!interaction.isButton()) return;

        if(interaction.customId === "close") {
            interaction.reply({
                content: `Tem certeza de que deseja excluir o ticket?`,
                ephemeral: true,
            });

            interaction.channel.send({
                embeds: [{
                    title: "Pz Custom's",
                    description: "O ticket será fechado, você quer a transcrição dele?",
                    color: Colors.Blurple,
                    footer: {
                        text: "Pz Custom's"
                    },
                    timestamp: new Date()
                }],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder() .setCustomId('yes') .setLabel('Sim') .setStyle(ButtonStyle.Success),
                        new ButtonBuilder() .setCustomId('no') .setLabel('Não') .setStyle(ButtonStyle.Danger)    
                    )
                ]
            });
        }
        else if (interaction.customId === "yes") {
            let ticket_logs = client.channels.cache.get(config.ticket_logs);

            await ticket_logs.send({
                embeds: [{
                    title: "Pz Custom's",
                    description: `Novo ticket fechado  (${interaction.channel.name}) por ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Pz Custom's"
                    },
                    timestamp: new Date()
                }],
                files: [await transcript.createTranscript(interaction.channel)]
            });

            await interaction.channel.send({
                embeds: [{
                    title: "Pz Custom's",
                    description: `Ticket fechado por ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Pz Custom's"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        }
        else if (interaction.customId === "no") {
            interaction.channel.send({
                embeds: [{
                    title: "Pz Custom's",
                    description: `Ticket fechado por  ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Pz Custom's"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        }
    }
}