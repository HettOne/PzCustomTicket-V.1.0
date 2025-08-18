const { Colors, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../settings/config');
const db = require('../../db');

module.exports = {
    name: 'ready',
    once: false,
    execute: async (client) => {
        console.log(`[READY] ${client.user.tag} (${client.user.id}) is ready !`.green);

        const channelTicket = client.channels.cache.get(config.ticket_channel);
        if (!channelTicket) return console.error('Canal de tickets não encontrado.');

        await channelTicket.send({ 
            content: "Carregando...", 
            files: ['https://i.imgur.com/6g1lC9k.gif']
        });

        await channelTicket.bulkDelete(2);

        await channelTicket.send({
            embeds: [{
                title: "",
                color: Colors.Orange,
                footer: {
                    text: "Pz Custom's - Ticket",
                },
                timestamp: new Date(),
                image: {
                    url: 'https://cdn.discordapp.com/attachments/1247371425384501320/1343224135265816658/ticket_-_banner_3.png'
                },
            }],
            components: [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('category')
                        .setPlaceholder('Selecione o que você precisa.')
                        .addOptions([
                            {
                                label: 'Comprar',
                                description: 'Caso você deseje adquirir algum veículo da Pz Custom',
                                value: 'comprar',
                                emoji: '1335666696924434553',
                            },
                            {
                                label: 'Suporte',
                                description: 'Caso você precise de suporte com algum veículo da Pz Custom',
                                value: 'suporte',
                                emoji: '1335652677052530810',
                            },
                            {
                                label: 'Ticket Padrão',
                                description: 'Abrir um ticket padrão.',
                                value: 'padrao',
                                emoji: '1335666499096150016',
                            }
                        ])
                )
            ]
        });
    }
};
