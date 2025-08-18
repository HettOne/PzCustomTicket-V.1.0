const { ActionRowBuilder, ChannelType, Colors, ButtonBuilder, ButtonStyle, PermissionFlagsBits, } = require('discord.js')
const config = require('../../settings/config');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if(!interaction.isStringSelectMenu()) return;

        let support_team = config.support_team;

        let AlreadyChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id);
        if (AlreadyChannel) return interaction.reply({
            content: ":x: | Você já tem um ticket aberto!",
            ephemeral: true
        });

        if(interaction.values[0] === 'report') {
            interaction.channel.delete();
            let ticket = interaction.guild.channels.create({
                name: `Ticket of ${interaction.user.username}`,
                topic: interaction.user.id,
                type: ChannelType.GuildText,
                parent: config.ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: support_team,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone]
                    }
                ]
            }).then((c) => {
                c.send({
                    embeds: [{
                        title: "Pz Custom's",
                        description: `Bem vindo ${interaction.user} !\nA equipe irá até você e cuidará de você o mais rápido possível!`,
                        color: Colors.Orange,
                        footer: {
                            text: "Pz Custom's"
                        },
                        timestamp: new Date(),
                        image: {
                            url: 'https://cdn.discordapp.com/attachments/1247371425384501320/1322098443073880175/ticket.png?ex=676fa3a0&is=676e5220&hm=50236f01bebb42218eb2c3d5e023fc17a7c157209057c36a2cefe9bde3fc86d5&'
                        }
                    }],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder() .setCustomId('close') .setLabel('Close') .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
                c.send({
                    content: `${interaction.user} <@${config.support_team}>`
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete(), 1000
                    })
                });
            });
        } 
        else if (interaction.values[0] === "question") {
            interaction.channel.delete();
            let ticket = interaction.guild.channels.create({
                name: `Ticket of ${interaction.user.username}`,
                topic: interaction.user.id,
                type: ChannelType.GuildText,
                parent: config.ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: support_team,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone]
                    }
                ]
            }).then((c) => {
                c.send({
                    embeds: [{
                        title: "Pz Custom's",
                        description: `Bem vindo ${interaction.user} !\nA equipe irá até você e cuidará de você o mais rápido possível!`,
                        color: Colors.Orange,
                        footer: {
                            text: "Pz Custom's"
                        },
                        timestamp: new Date(),
                        image: {
                            url: 'https://cdn.discordapp.com/attachments/1247371425384501320/1322098443073880175/ticket.png?ex=676fa3a0&is=676e5220&hm=50236f01bebb42218eb2c3d5e023fc17a7c157209057c36a2cefe9bde3fc86d5&'
                        }
                    }],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder() .setCustomId('close') .setLabel('Close') .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
                c.send({
                    content: `${interaction.user} <@${config.support_team}>`
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete(), 1000
                    })
                });
            });
        }
        else if (interaction.values[0] === "other") {
            interaction.channel.delete();
            let ticket = interaction.guild.channels.create({
                name: `Ticket de ${interaction.user.username}`,
                topic: interaction.user.id,
                type: ChannelType.GuildText,
                parent: config.ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: support_team,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone]
                    }
                ]
            }).then((c) => {
                c.send({
                    embeds: [{
                        title: "Pz Custom's",
                        description: `Bem vindo ${interaction.user} !\nA equipe irá até você e cuidará de você o mais rápido possível!`,
                        color: Colors.Orange,
                        footer: {
                            text: "Pz Custom's"
                        },
                        timestamp: new Date(),
                        image: {
                            url: 'https://cdn.discordapp.com/attachments/1247371425384501320/1322098443073880175/ticket.png?ex=676fa3a0&is=676e5220&hm=50236f01bebb42218eb2c3d5e023fc17a7c157209057c36a2cefe9bde3fc86d5&'
                        }
                    }],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder() .setCustomId('close') .setLabel('Close') .setStyle(ButtonStyle.Danger)
                        )
                    ]
                });
                c.send({
                    content: `${interaction.user} <@${config.support_team}>`
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete(), 1000
                    })
                });
            });
        }
    }
}
