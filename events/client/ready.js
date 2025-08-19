const {
    Colors,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder,
} = require("discord.js");
const config = require("../../settings/config");
const db = require("../../db");

module.exports = {
    name: "ready",
    once: false,
    execute: async (client) => {
        console.log(
            `[READY] ${client.user.tag} (${client.user.id}) is ready !`.green,
        );

        const channelTicket = client.channels.cache.get(config.ticket_channel);
        if (!channelTicket)
            return console.error("Canal de tickets não encontrado.");

        // Mensagem de carregando
        await channelTicket.send({
            content: "Carregando...",
            files: ["https://i.imgur.com/6g1lC9k.gif"],
        });

        await channelTicket.bulkDelete(2);

        // Criar embed de regras
        const regrasEmbed = new EmbedBuilder()
            .setDescription(
                "`⚠️ 1. Não abra um ticket de forma desnecessária.`\n" +
                    "`🧑‍💻 2. Seja educado com a equipe de suporte.`\n" +
                    "`❌ 3. Não envie spam ou conteúdo ofensivo.`\n" +
                    "`📌 4. Use o ticket apenas para assuntos relacionados à Pz Custom's.`\n" +
                    "`📝 5. Forneça informações claras sobre seu problema ou pedido.`\n" +
                    "`🚫 6. Evite flood de mensagens dentro do ticket.`\n" +
                    "`⏳ 7. Tickets inativos podem ser fechados sem aviso.`",
            )
            .setColor(Colors.Orange)
            .setFooter({
                text: "• Pz Custom's | Todos os direitos reservados ©",
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setImage(
                "https://cdn.discordapp.com/attachments/1247371425384501320/1343224135265816658/ticket_-_banner_3.png",
            );

        // Enviar embed com menu de seleção
        await channelTicket.send({
            embeds: [regrasEmbed],
            components: [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("category")
                        .setPlaceholder("Selecione o que você precisa.")
                        .addOptions([
                            {
                                label: "Comprar",
                                description:
                                    "Caso você deseje adquirir algum veículo da Pz Custom",
                                value: "comprar",
                                emoji: "1335666696924434553",
                            },
                            {
                                label: "Suporte",
                                description:
                                    "Caso você precise de suporte com algum veículo da Pz Custom",
                                value: "suporte",
                                emoji: "1335652677052530810",
                            },
                            {
                                label: "Ticket Padrão",
                                description: "Abrir um ticket padrão.",
                                value: "padrao",
                                emoji: "1335666499096150016",
                            },
                        ]),
                ),
            ],
        });
    },
};
